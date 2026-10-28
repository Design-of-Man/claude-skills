#!/usr/bin/env node
/* Exercise templates/api/lead.js and confirm.js against a mocked Resend.
 * No network, no email sent. Run after editing a template or a client copy:
 *   node scripts/test-templates.js                 (the skill's templates)
 *   node scripts/test-templates.js path/to/api     (a client's copies)
 */
"use strict";
const path = require("path");
const dir = path.resolve(process.argv[2] || path.join(__dirname, "../templates/api"));
let sent = [], resendStatus = 200, failures = 0;
global.fetch = async (url, opts) => {
  sent.push({ url, body: JSON.parse(opts.body) });
  return { ok: resendStatus < 300, status: resendStatus, text: async () => "mock error" };
};
console.error = console.warn = console.log = () => {}; // silence handler logs
const out = (...a) => process.stdout.write(a.join(" ") + "\n");
function call(file, body, method = "POST") {
  delete require.cache[require.resolve(file)];
  return new Promise((done) => {
    const res = { code: 0, status(c) { this.code = c; return this; }, setHeader() {},
      send(b) { done({ code: this.code, body: JSON.parse(b) }); } };
    require(file)({ method, body }, res);
  });
}
function check(label, cond, detail) {
  out((cond ? "PASS " : "FAIL ") + label + (cond ? "" : "  <- " + JSON.stringify(detail)));
  if (!cond) failures++;
}
(async () => {
  for (const name of ["lead.js", "confirm.js"]) {
    const f = path.join(dir, name);
    try { require.resolve(f); } catch { out("skip " + name + " (not found)"); continue; }
    out("== " + name);
    delete process.env.RESEND_API_KEY;
    let r = await call(f, { name: "Ann Lee", email: "a@b.co", phone: "5617441234" });
    check("no key -> 503", r.code === 503, r);
    process.env.RESEND_API_KEY = "re_test";
    r = await call(f, {}, "GET"); check("GET -> 405", r.code === 405, r);
    sent = []; r = await call(f, { name: "Bot", email: "a@b.co", phone: "5617441234", _honey: "x" });
    check("honeypot -> 200, nothing sent", r.code === 200 && sent.length === 0, { r, sent: sent.length });
    r = await call(f, { name: "", email: "nope" }); check("bad input -> 400", r.code === 400, r);
    sent = []; resendStatus = 200;
    r = await call(f, { name: "O'Neil & Co", email: "a@b.co", phone: "5617441234", topic: "Heel pain" });
    check("valid -> 200 success:\"true\"", r.code === 200 && r.body.success === "true", r);
    const conf = sent.find((s) => s.body.to[0] === "a@b.co");
    check("confirmation sent to visitor", !!conf, sent.map((s) => s.body.to));
    check("name escaped in html", conf && conf.body.html.includes("O&#39;Neil") && !/O'Neil/.test(conf.body.html), conf && conf.body.html.slice(0, 200));
    if (name === "lead.js") {
      const office = sent[0];
      check("office email first, carries extra field", office && office.body.to[0] !== "a@b.co" && /topic:\s+Heel pain/.test(office.body.text), office && office.body.text);
      check("confirmed:\"true\"", r.body.confirmed === "true", r);
      sent = []; r = await call(f, { name: "Spammy", email: "a@b.co", phone: "123", message: "see https://x.io" });
      check("flagged lead: office told, NO confirmation", r.code === 200 && sent.length === 1 && /possible spam/.test(sent[0].body.subject), sent.map((s) => s.body.subject));
      resendStatus = 500; r = await call(f, { name: "Ann", email: "a@b.co", phone: "5617441234" });
      check("office email fails -> 502", r.code === 502, r); resendStatus = 200;
    } else {
      resendStatus = 500; r = await call(f, { name: "Ann", email: "a@b.co" });
      check("resend fails -> 502", r.code === 502, r); resendStatus = 200;
    }
  }
  out(failures ? `\n${failures} FAILED` : "\nall passed");
  process.exit(failures ? 1 : 0);
})();
