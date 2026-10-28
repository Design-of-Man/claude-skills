/**
 * HYBRID add-on: visitor confirmation email only, via Resend.
 * Use when the office should keep receiving FormSubmit's emails exactly as
 * before (staff used to them) and only the visitor confirmation is new.
 * Live reference: jupiterlaser.com /rsvp/ (api/rsvp-confirm.js in
 * Design-of-Man/abacoapodiatry).
 *
 * The browser calls this ONLY after FormSubmit answered success:"true" for
 * the office copy, so no visitor is told they're registered for a request the
 * office never got. On failure the page falls back to "we'll call you".
 *
 * Template from the resend-forms skill. Edit only the CONFIG block.
 *
 *   POST JSON { name, email, _honey } -> 200 {success:"true"} | 400 | 502 | 503
 *
 * Environment: RESEND_API_KEY (required; 503 without it).
 */

"use strict";

// ---------------------------------------------------------------- CONFIG --
const CONFIG = {
  from: "Example Clinic <forms@example.com>",
  replyTo: "frontdesk@example.com",
  subject: "We got your request",
  // {first} -> escaped first name. Fixed text: the endpoint can't relay
  // anyone else's content, which is what keeps an open POST from being abused.
  text: [
    "Hi {first},",
    "",
    "Thanks for reaching out. We received your request and someone from our team will call you shortly.",
    "",
    "Example Clinic",
  ].join("\n"),
  brandColor: "#1f4e79",
  ics: null, // { filename, content } for event RSVPs
};
// ------------------------------------------------------------ end CONFIG --

const OK = { success: "true" };
const NOT_OK = { success: "false" };
const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[a-z]{2,}$/i;

function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(body));
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, NOT_OK);
  }
  if (!process.env.RESEND_API_KEY) {
    console.warn("confirm: RESEND_API_KEY not set -- no confirmation sent");
    return json(res, 503, NOT_OK);
  }
  const body = req.body && typeof req.body === "object" ? req.body : {};
  if (typeof body._honey === "string" && body._honey.trim()) return json(res, 200, OK);

  const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : "";
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 200) : "";
  if (!EMAIL_RE.test(email) || !name || /https?:\/\/|www\.|[<>]/i.test(name)) {
    return json(res, 400, NOT_OK);
  }
  const text = CONFIG.text.replace(/\{first\}/g, name.split(/\s+/)[0]);
  const html = `<!doctype html><html><body style="margin:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;color:#1d1d1d">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:12px;overflow:hidden">
<tr><td style="background:${CONFIG.brandColor};height:6px"></td></tr>
<tr><td style="padding:26px 28px;font-size:16px;line-height:1.55">${esc(text).replace(/\n/g, "<br>")}</td></tr>
</table></td></tr></table></body></html>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: CONFIG.from,
        to: [email],
        reply_to: CONFIG.replyTo,
        subject: CONFIG.subject,
        text,
        html,
        ...(CONFIG.ics ? { attachments: [{
          filename: CONFIG.ics.filename,
          content: Buffer.from(CONFIG.ics.content).toString("base64"),
          content_type: "text/calendar",
        }] } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) {
      console.error("confirm: resend failed", r.status, await r.text());
      return json(res, 502, NOT_OK);
    }
    return json(res, 200, OK);
  } catch (err) {
    console.error("confirm: resend threw", err && err.message);
    return json(res, 502, NOT_OK);
  }
};
