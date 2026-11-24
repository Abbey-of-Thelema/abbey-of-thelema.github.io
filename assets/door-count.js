/* Door-button counter client. ORDER 2026-1124-003 A2.
   Counts a first press of each door button (seeker / initiate / agent).
   ENDPOINT is empty until the Worker is deployed; then set it to the Worker URL.
   While the Worker is absent, or if a request fails, this does nothing: the door
   still opens. No cookies. No personal data is sent, only {"door":"<choice>"}.
   A flag in localStorage (not a cookie) keeps the same browser from adding
   the same door twice; the flag is set only after a successful count. */
(function () {
  var ENDPOINT = ""; // set at deploy, e.g. "https://abbey-door-count.<account>.workers.dev/count"
  var FLAG = "abbey-door-counted:";
  var OK = { seeker: 1, initiate: 1, agent: 1 };

  window.abbeyCount = function (choice) {
    if (!OK[choice]) return;
    if (!ENDPOINT) return;
    try {
      if (localStorage.getItem(FLAG + choice)) return;
    } catch (e) {}
    var p = fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ door: choice }),
      mode: "cors",
      credentials: "omit",
      cache: "no-store",
      keepalive: true,
    });
    p.then(function (r) {
      if (r && r.ok) {
        try {
          localStorage.setItem(FLAG + choice, "1");
        } catch (e) {}
      }
    }).catch(function () {});
  };
})();
