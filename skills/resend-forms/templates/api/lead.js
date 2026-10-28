/**
 * Lead form handler: office notification + visitor confirmation via Resend.
 * Drop into a static Vercel site as /api/lead.js (Vercel serves it at
 * /api/lead/ -- call it WITH the trailing slash if vercel.json sets
 * trailingSlash: true, or the POST takes a 308 detour first).
 *
 * Template from the resend-forms skill. Edit only the CONFIG block below; it
 * is the one place per-client values live.
 *
 * Contract with the browser (templates/lead-form.js):
 *   POST JSON { name, phone?, email?, message?, ...any extra fields, _honey }
 *   -> 200 { success: "true", confirmed: "true"|"false" }   office was notified
 *   -> 400 { success: "false" }                              missing name/contact
 *   -> 502 { success: "false" }                              office NOT notified
 *   -> 503 { success: "false" }                              RESEND_API_KEY unset
 * success is the STRING "true", never a boolean, so a browser check of
 * String(data.success) === "true" can't be fooled by a truthy error body.
 *
 * The rule: never report success for a lead the office did not get. The
 * visitor confirmation is best effort and can never turn a success into a
 * failure (the lead already reached the office).
 *
 * Spam is LABELLED, never blocked (a missed real lead costs more than a read
 * spam email): the office email carries a "flags" line. The honeypot is the
 * one exception -- a filled _honey gets a fake 200 and nothing is sent.
 *
 * Zero dependencies, CommonJS, Node 18+ global fetch: static sites on Vercel
 * deploy with no install step, and a package.json would add one.
 *
 * Environment:
 *   RESEND_API_KEY  required (Vercel project -> Settings -> Environment
 *                   Variables, Production + Preview; redeploy after adding).
 */

"use strict";

// ---------------------------------------------------------------- CONFIG --
const CONFIG = {
  site: "example.com",
  // Office recipients. The first is To:, the rest Cc:.
  officeTo: ["frontdesk@example.com"],
  // Sender on the client's Resend-verified domain. The mailbox need not exist.
  from: "Example Clinic <forms@example.com>",
  // Where replies to the VISITOR confirmation go (a real, monitored inbox).
  replyTo: "frontdesk@example.com",
  officeSubject: "New website request",
  // Visitor confirmation. Set enabled:false for office-only.
  confirm: {
    enabled: true,
    subject: "We got your request",
    // Plain-text body. {first} is replaced with the escaped first name.
    // Fixed text on purpose: the only visitor values used are the first name
    // and the address, so the endpoint can't relay anyone else's content.
    text: [
      "Hi {first},",
      "",
      "Thanks for reaching out. We received your request and someone from our team will call you shortly.",
      "",
      "If it's urgent, call us at (555) 555-0100.",
      "",
      "Example Clinic",
    ].join("\n"),
    brandColor: "#1f4e79",
    // Optional .ics attachment for event RSVPs: { filename, content } or null.
    ics: null,
  },
  // Optional durable copy (e.g. a Supabase Edge Function that inserts a row).
  // When set, it is written FIRST and its result decides the response, the
  // same as api/contact.js on jupiterlaser.com. Leave url "" to skip.
  store: { url: "", apikey: "" },
};
// ------------------------------------------------------------ end CONFIG --

const TIMEOUT_MS = 8000;
const LIMITS = { name: 200, phone: 50, email: 200, message: 4000, other: 500 };
const OK = (confirmed) => ({ success: "true", confirmed: confirmed ? "true" : "false" });
const NOT_OK = { success: "false" };

function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(body));
}
function clean(v, max) { return typeof v === "string" ? v.trim().slice(0, max) : ""; }
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}
const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[a-z]{2,}$/i;

async function resend(payload) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!r.ok) throw new Error(`resend ${r.status}: ${await r.text()}`);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, NOT_OK);
  }
  if (!process.env.RESEND_API_KEY) {
    console.warn("lead: RESEND_API_KEY not set -- nothing sent");
    return json(res, 503, NOT_OK);
  }
  const body = req.body && typeof req.body === "object" ? req.body : {};
  if (clean(body._honey, 100)) return json(res, 200, OK(false));

  const lead = {
    name: clean(body.name, LIMITS.name),
    phone: clean(body.phone, LIMITS.phone),
    email: clean(body.email, LIMITS.email),
    message: clean(body.message, LIMITS.message),
  };
  if (!lead.name || (!lead.phone && !EMAIL_RE.test(lead.email))) return json(res, 400, NOT_OK);

  // Any other submitted fields (topic, seats, src ...) ride along to the office.
  const extra = {};
  for (const [k, v] of Object.entries(body)) {
    if (k.startsWith("_") || k in lead || k === "timing" || typeof v !== "string") continue;
    extra[k.slice(0, 40)] = clean(v, LIMITS.other);
  }

  const flags = [];
  if (clean(body.timing, 60)) flags.push(clean(body.timing, 60)); // set by lead-form.js
  const digits = lead.phone.replace(/\D/g, "");
  if (lead.phone && !(digits.length === 10 || (digits.length === 11 && digits[0] === "1"))) {
    flags.push("phone not a 10-digit US number");
  }
  if (/https?:\/\/|www\./i.test(lead.name + " " + lead.message)) flags.push("contains a link");
  if (/\b(seo|backlink|guest post|bitcoin|crypto|coinbase|virtual assistant)\b/i.test(lead.name + " " + lead.message)) {
    flags.push("matches cold-pitch/crypto spam language");
  }

  // --- Durable copy first, when configured. It decides the response. ---
  if (CONFIG.store.url) {
    try {
      const r = await fetch(CONFIG.store.url, {
        method: "POST",
        headers: { apikey: CONFIG.store.apikey, Authorization: `Bearer ${CONFIG.store.apikey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, extra, flags, site: CONFIG.site }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!r.ok) throw new Error(`store ${r.status}`);
    } catch (err) {
      console.error("lead: store failed", err && err.message);
      return json(res, 502, NOT_OK);
    }
  }

  // --- Office notification. Without a store, THIS decides the response. ---
  const lines = [
    `Name:    ${lead.name}`,
    `Phone:   ${lead.phone || "(not given)"}`,
    `Email:   ${lead.email || "(not given)"}`,
    ...Object.entries(extra).map(([k, v]) => `${(k + ":").padEnd(9)}${v}`),
    `Flags:   ${flags.length ? flags.join("; ") : "none"}`,
    "",
    lead.message || "(no message)",
    "",
    `-- Submitted on ${CONFIG.site}.`,
  ];
  try {
    const [to, ...cc] = CONFIG.officeTo;
    await resend({
      from: CONFIG.from,
      to: [to],
      ...(cc.length ? { cc } : {}),
      ...(EMAIL_RE.test(lead.email) ? { reply_to: lead.email } : {}),
      subject: `${CONFIG.officeSubject}${flags.length ? " [check: possible spam]" : ""} — ${lead.name}`,
      text: lines.join("\n"),
    });
  } catch (err) {
    console.error("lead: office email failed", err && err.message);
    // With a store configured the lead is already safe; report success.
    if (!CONFIG.store.url) return json(res, 502, NOT_OK);
  }

  // --- Visitor confirmation. Best effort; never changes success. ---
  let confirmed = false;
  if (CONFIG.confirm.enabled && EMAIL_RE.test(lead.email) && !flags.length) {
    const first = lead.name.split(/\s+/)[0];
    const text = CONFIG.confirm.text.replace(/\{first\}/g, first);
    const html = `<!doctype html><html><body style="margin:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;color:#1d1d1d">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:12px;overflow:hidden">
<tr><td style="background:${CONFIG.confirm.brandColor};height:6px"></td></tr>
<tr><td style="padding:26px 28px;font-size:16px;line-height:1.55">${esc(text).replace(/\n/g, "<br>")}</td></tr>
</table></td></tr></table></body></html>`;
    try {
      await resend({
        from: CONFIG.from,
        to: [lead.email],
        reply_to: CONFIG.replyTo,
        subject: CONFIG.confirm.subject,
        text,
        html,
        ...(CONFIG.confirm.ics ? { attachments: [{
          filename: CONFIG.confirm.ics.filename,
          content: Buffer.from(CONFIG.confirm.ics.content).toString("base64"),
          content_type: "text/calendar",
        }] } : {}),
      });
      confirmed = true;
    } catch (err) {
      console.error("lead: confirmation failed", err && err.message);
    }
  }
  return json(res, 200, OK(confirmed));
};
