/* Theme toggle and publication filter. Everything here is optional: the site
   renders fully without JavaScript. */
(function () {
  var root = document.documentElement;

  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* Publications: filter chips (All / First author / year). */
  var chips = document.querySelectorAll("[data-pub-filter]");
  var pubs = document.querySelectorAll("[data-pub]");
  var groups = document.querySelectorAll("[data-pub-year-group]");
  var countEl = document.querySelector("[data-pub-count]");
  if (chips.length && pubs.length) {
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var f = chip.getAttribute("data-pub-filter");
        chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
        var shown = 0;
        pubs.forEach(function (p) {
          var ok = f === "all" || (f === "first" && p.hasAttribute("data-first-author"));
          p.hidden = !ok;
          if (ok) shown++;
        });
        groups.forEach(function (g) {
          g.hidden = !g.querySelector("[data-pub]:not([hidden])");
        });
        if (countEl) countEl.textContent = shown;
      });
    });
  }
})();
