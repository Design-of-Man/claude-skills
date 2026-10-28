/* Browser half of the resend-forms template. Vanilla, no dependencies.
 *
 * Markup:
 *   <form data-lead-form action="/api/lead/" method="POST">
 *     <input name="name" required> <input name="phone" type="tel" required>
 *     <input name="email" type="email">
 *     <textarea name="message"></textarea>
 *     <input type="text" name="_honey" style="display:none" tabindex="-1"
 *            aria-hidden="true" autocomplete="off">
 *     <input type="hidden" name="src">            (optional: ?src= tag)
 *     <button type="submit">Send</button>
 *     <div data-lead-status role="status" aria-live="polite"></div>
 *   </form>
 *
 * No novalidate on the form: let the browser enforce required/email first.
 * Messages come from data attributes so copy stays in the HTML:
 *   data-ok-confirmed  data-ok-unconfirmed  data-error
 *
 * Success is believed ONLY when the body says success:"true" (string). A 200
 * alone proves nothing: FormSubmit answered 200 {"success":"false"} for months
 * while dropping every lead because nobody had clicked its activation link.
 */
(function () {
  "use strict";
  var loadedAt = Date.now();

  function track(name, data) {
    // Placement only, never field values: what a visitor typed is theirs.
    try { if (typeof window.va === "function") window.va("event", { name: name, data: data }); } catch (e) {}
    try { if (typeof window.gtag === "function") window.gtag("event", name, data); } catch (e) {}
  }

  Array.prototype.forEach.call(document.querySelectorAll("form[data-lead-form]"), function (form) {
    var status = form.querySelector("[data-lead-status]");
    var btn = form.querySelector('button[type="submit"]');
    var label = btn ? btn.textContent : "";
    var src = form.querySelector('input[name="src"]');
    if (src) {
      var m = window.location.search.match(/[?&](?:src|utm_source)=([\w.-]{1,40})/i);
      src.value = m ? m[1] : "direct";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var payload = {};
      new FormData(form).forEach(function (v, k) { payload[k] = v; });
      if ((Date.now() - loadedAt) / 1000 < 4) payload.timing = "filled in under 4s";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

      fetch(form.getAttribute("action"), {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json", Accept: "application/json" }
      }).then(function (r) {
        return r.json().catch(function () { return {}; });
      }).then(function (d) {
        if (String(d && d.success) !== "true") throw new Error("not delivered");
        status.className = "form-status ok";
        status.textContent = String(d.confirmed) === "true"
          ? (form.getAttribute("data-ok-confirmed") || "Thank you! A confirmation is on its way to your email.")
          : (form.getAttribute("data-ok-unconfirmed") || "Thank you! Our team will be in touch shortly.");
        track("form_submit", { form: form.id || "lead" });
        form.reset();
      }).catch(function () {
        status.className = "form-status err";
        status.textContent = form.getAttribute("data-error") ||
          "Something went wrong sending your request. Please call us and we'll take care of you.";
      }).finally(function () {
        if (btn) { btn.disabled = false; btn.textContent = label; }
      });
    });
  });
})();
