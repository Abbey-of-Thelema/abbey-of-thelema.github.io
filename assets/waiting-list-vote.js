/* Waiting-list thumbs. ORDER 2026-1124-004 C.
   ENDPOINT is empty until a vote-count Worker is deployed. That deploy uses the
   same Cloudflare Workers token as the door-button counter, never the DNS token.
   Spend nothing and do not deploy from this file.
   While ENDPOINT is empty, every thumbs control stays disabled and reads
   "Voting opens soon."
   When ENDPOINT is set, a click POSTs only {"song":"<id>"} — no names, no
   addresses, nothing about the visitor. One vote per song per browser: a
   localStorage flag (not a cookie) is written only after the Worker answers
   yes, and that flag is never sent anywhere.
*/
(function () {
  var ENDPOINT = ""; // set at deploy, e.g. the Worker URL plus /count
  var FLAG = "abbey-waiting-voted:";

  function voted(id) {
    try { return !!localStorage.getItem(FLAG + id); } catch (e) { return false; }
  }
  function mark(id) {
    try { localStorage.setItem(FLAG + id, "1"); } catch (e) {}
  }
  function disable(btn, label) {
    btn.disabled = true;
    btn.setAttribute("aria-disabled", "true");
    var t = btn.querySelector(".vote-state");
    if (t) t.textContent = label;
  }
  function setup(btn) {
    var id = btn.getAttribute("data-song-vote");
    if (!id) return;
    if (!ENDPOINT) {
      disable(btn, "Voting opens soon");
      return;
    }
    if (voted(id)) {
      disable(btn, "Voted");
      return;
    }
    btn.disabled = false;
    btn.removeAttribute("aria-disabled");
    btn.setAttribute("aria-label", "Vote for this song to be decoded next");
    var state = btn.querySelector(".vote-state");
    if (state) state.textContent = "Thumbs up";
    btn.addEventListener("click", function () {
      if (voted(id) || btn.disabled) return;
      btn.disabled = true;
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ song: id }),
        mode: "cors",
        credentials: "omit",
        cache: "no-store",
        keepalive: true
      }).then(function (r) {
        if (r && r.ok) {
          mark(id);
          disable(btn, "Voted");
        } else {
          btn.disabled = false;
          btn.removeAttribute("aria-disabled");
        }
      }).catch(function () {
        btn.disabled = false;
        btn.removeAttribute("aria-disabled");
      });
    });
  }
  function ready() {
    var nodes = document.querySelectorAll("[data-song-vote]");
    for (var i = 0; i < nodes.length; i++) setup(nodes[i]);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
  else ready();
})();
