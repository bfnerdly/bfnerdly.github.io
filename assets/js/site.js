/* Site behavior. Everything here is an enhancement: every page reads fully without JavaScript.
   - theme toggle: match system → light → dark → match system
   - linked brushing: hovering, focusing or clicking a cluster key (C1–C4) lights everything tagged
     with that cluster across the page and dims the rest; click pins it, Escape clears
   - copy-to-clipboard for the email address
   - publication filter (all / first author) */
(function () {
  var root = document.documentElement;
  var body = document.body;

  /* ---------- theme ---------- */
  var toggle = document.querySelector(".theme-toggle");
  var NEXT = { system: "light", light: "dark", dark: "system" };
  var NAME = { system: "match system", light: "light", dark: "dark" };

  function setMode(mode) {
    try {
      if (mode === "system") localStorage.removeItem("theme");
      else localStorage.setItem("theme", mode);
    } catch (e) {}
    if (mode === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", mode);
    if (toggle) {
      toggle.setAttribute("data-mode", mode);
      toggle.setAttribute("aria-label", "Color theme: " + NAME[mode] + ". Switch to " + NAME[NEXT[mode]] + ".");
    }
  }

  if (toggle) {
    var saved = root.getAttribute("data-theme");
    setMode(saved === "light" || saved === "dark" ? saved : "system");
    toggle.addEventListener("click", function () {
      setMode(NEXT[toggle.getAttribute("data-mode")] || "light");
    });
  }

  /* ---------- linked brushing ---------- */
  var pinned = null;
  var keys = [].slice.call(document.querySelectorAll("[data-brush]"));

  function brush(id) {
    if (id) body.setAttribute("data-brush", id);
    else body.removeAttribute("data-brush");
    keys.forEach(function (k) {
      if (k.hasAttribute("aria-pressed")) k.setAttribute("aria-pressed", String(pinned === k.getAttribute("data-brush")));
      k.classList.toggle("is-lit", id === k.getAttribute("data-brush"));
    });
    document.dispatchEvent(new CustomEvent("brush", { detail: id }));
  }
  /* The map calls this on hover; passing null falls back to the pinned cluster. */
  window.siteBrush = function (id) { brush(id || pinned); };

  keys.forEach(function (k) {
    var id = k.getAttribute("data-brush");
    var isLink = k.tagName === "A";
    if (!isLink && k.tagName !== "BUTTON") {
      k.setAttribute("tabindex", "0");
      k.setAttribute("role", "button");
      k.setAttribute("aria-label", "Highlight " + (k.getAttribute("data-name") || k.textContent.trim()) + " across the page");
    }
    if (!isLink) k.setAttribute("aria-pressed", "false");

    k.addEventListener("pointerenter", function () { brush(id); });
    k.addEventListener("pointerleave", function () { brush(pinned); });
    k.addEventListener("focus", function () { brush(id); });
    k.addEventListener("blur", function () { brush(pinned); });
    if (!isLink) {
      var pin = function () { pinned = pinned === id ? null : id; brush(pinned || id); };
      k.addEventListener("click", pin);
      k.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pin(); }
      });
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && pinned) { pinned = null; brush(null); }
  });

  /* ---------- copy email ---------- */
  [].forEach.call(document.querySelectorAll("[data-copy]"), function (btn) {
    var status = btn.parentNode.querySelector("[data-copy-status]");
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var done = function () {
        btn.textContent = "Copied";
        btn.setAttribute("data-state", "done");
        if (status) status.textContent = "Email address copied to clipboard";
        setTimeout(function () { btn.textContent = "Copy"; btn.removeAttribute("data-state"); }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {
          if (status) status.textContent = "Copy failed. Select the address and copy it manually.";
        });
      }
    });
  });

  /* ---------- publication filter ---------- */
  var filters = [].slice.call(document.querySelectorAll("[data-pub-filter]"));
  var countEl = document.querySelector("[data-pub-count]");
  if (filters.length) {
    filters.forEach(function (f) {
      f.addEventListener("click", function () {
        var mode = f.getAttribute("data-pub-filter");
        filters.forEach(function (o) { o.setAttribute("aria-pressed", String(o === f)); });
        var shown = 0;
        [].forEach.call(document.querySelectorAll("[data-pub]"), function (p) {
          var ok = mode === "all" || p.hasAttribute("data-first-author");
          p.hidden = !ok;
          if (ok) shown++;
        });
        [].forEach.call(document.querySelectorAll("[data-pub-year]"), function (g) {
          g.hidden = !g.querySelector("[data-pub]:not([hidden])");
        });
        if (countEl) countEl.textContent = shown;
      });
    });
  }
})();
