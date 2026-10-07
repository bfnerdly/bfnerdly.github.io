/* The home page behavior map (illustrative, not real data).
   Points start as uniform noise and settle into the four clusters defined in _data/clusters.yml
   (read from the region labels' data attributes), while a magma density field and contour lines
   resolve underneath. Under prefers-reduced-motion it draws the settled map at once.
   Hovering a cluster highlights it here and, through window.siteBrush, across the page. */
(function () {
  var fig = document.querySelector("[data-map]");
  if (!fig) return;
  var field = fig.querySelector(".mapfig__field");
  var canvas = field.querySelector("canvas");
  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var labels = [].slice.call(fig.querySelectorAll(".region-label"));
  var narrowMQ = window.matchMedia("(max-width: 819px)");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches || fig.hasAttribute("data-static");
  var DURATION = 2300;

  var MAGMA = [[13, 7, 22], [28, 16, 68], [59, 15, 112], [100, 26, 128], [140, 41, 129], [183, 55, 121],
    [222, 73, 104], [247, 112, 92], [254, 159, 109], [254, 207, 146], [252, 253, 191]];
  function magma(t) {
    t = Math.max(0, Math.min(1, t));
    var x = t * (MAGMA.length - 1), i = Math.floor(x), f = x - i;
    var a = MAGMA[i], b = MAGMA[Math.min(i + 1, MAGMA.length - 1)];
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
  }
  function hexRGB(h) { var n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function mulberry(seed) {
    return function () {
      seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function gauss(r) { return Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r()); }
  function easeOutExpo(t) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); }
  function smooth(a, b, t) { t = Math.max(0, Math.min(1, (t - a) / (b - a))); return t * t * (3 - 2 * t); }

  var clusters = labels.map(function (l) {
    return {
      id: l.getAttribute("data-cluster"),
      x: +l.getAttribute("data-x"), y: +l.getAttribute("data-y"),
      mx: +l.getAttribute("data-mx"), my: +l.getAttribute("data-my"),
      spread: +l.getAttribute("data-spread"), weight: +l.getAttribute("data-weight"),
      rgb: hexRGB(l.getAttribute("data-color"))
    };
  });

  var W, H, dpr, pts, raster, contours, centers, brushed = null, settled = false, startT = 0;

  function build() {
    W = field.clientWidth; H = field.clientHeight;
    if (!W || !H) return false;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var narrow = narrowMQ.matches, r = mulberry(21);
    var N = narrow ? 1200 : 2800;
    var unit = Math.min(W, H * 1.7);

    /* each cluster is three overlapping anisotropic blobs, so the shapes look organic */
    centers = clusters.map(function (c) {
      var cx = (narrow ? c.mx : c.x) * W, cy = (narrow ? c.my : c.y) * H, S = c.spread * unit * (narrow ? 1.25 : 1);
      var subs = [0, 1, 2, 3].map(function () {
        return { ox: gauss(r) * S * 0.85, oy: gauss(r) * S * 0.6, sx: S * (0.3 + 0.4 * r()), sy: S * (0.22 + 0.34 * r()) };
      });
      return { id: c.id, x: cx, y: cy, S: S, subs: subs, rgb: c.rgb, w: c.weight };
    });
    var total = centers.reduce(function (s, c) { return s + c.w; }, 0);

    pts = [];
    for (var i = 0; i < N; i++) {
      var p = { sx: r() * W, sy: r() * H, delay: r() * 0.35, k: -1, tx: 0, ty: 0 };
      if (r() < 0.07) { p.tx = r() * W; p.ty = r() * H; }            /* background noise: the ghost field */
      else {
        var pick = r() * total, k = 0;
        while (k < centers.length - 1 && pick > centers[k].w) { pick -= centers[k].w; k++; }
        var c = centers[k], s = c.subs[Math.floor(r() * 4)];
        p.k = k; p.tx = c.x + s.ox + gauss(r) * s.sx; p.ty = c.y + s.oy + gauss(r) * s.sy;
      }
      pts.push(p);
    }

    /* density grid from the settled positions, blurred into a smooth field */
    var GW = narrow ? 96 : 160, GH = Math.max(24, Math.round(GW * H / W));
    var g = new Float32Array(GW * GH);
    pts.forEach(function (p) {
      var gx = Math.floor(p.tx / W * GW), gy = Math.floor(p.ty / H * GH);
      if (gx >= 0 && gy >= 0 && gx < GW && gy < GH) g[gy * GW + gx] += 1;
    });
    g = blur(blur(blur(g, GW, GH, 2), GW, GH, 1), GW, GH, 1);
    var max = 0;
    for (i = 0; i < g.length; i++) if (g[i] > max) max = g[i];
    for (i = 0; i < g.length; i++) g[i] /= max;

    raster = document.createElement("canvas");
    raster.width = GW; raster.height = GH;
    var rc = raster.getContext("2d"), img = rc.createImageData(GW, GH);
    for (i = 0; i < g.length; i++) {
      var col = magma(Math.pow(g[i], 0.62) * 0.96);
      img.data[i * 4] = col[0]; img.data[i * 4 + 1] = col[1]; img.data[i * 4 + 2] = col[2]; img.data[i * 4 + 3] = 255;
    }
    rc.putImageData(img, 0, 0);

    contours = document.createElement("canvas");
    contours.width = canvas.width; contours.height = canvas.height;
    var cc = contours.getContext("2d");
    cc.setTransform(dpr, 0, 0, dpr, 0, 0);
    cc.lineCap = "round";
    var levels = [0.035, 0.08, 0.16, 0.28, 0.42, 0.58, 0.76];
    levels.forEach(function (lv, li) {
      var ghost = li < 2;
      cc.strokeStyle = ghost ? "rgba(252,253,191,0.13)" : "rgba(" + magma(0.62 + 0.38 * li / levels.length).map(Math.round).join(",") + ",0.55)";
      cc.lineWidth = ghost ? 0.8 : 1;
      cc.setLineDash(ghost ? [2, 3] : []);
      cc.beginPath();
      march(g, GW, GH, lv, W / GW, H / GH, cc);
      cc.stroke();
    });
    return true;
  }

  function blur(src, w, h, rad) {
    var tmp = new Float32Array(src.length), out = new Float32Array(src.length), x, y, k, s, n;
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
      s = 0; n = 0;
      for (k = -rad; k <= rad; k++) { var xx = x + k; if (xx >= 0 && xx < w) { s += src[y * w + xx]; n++; } }
      tmp[y * w + x] = s / n;
    }
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
      s = 0; n = 0;
      for (k = -rad; k <= rad; k++) { var yy = y + k; if (yy >= 0 && yy < h) { s += tmp[yy * w + x]; n++; } }
      out[y * w + x] = s / n;
    }
    return out;
  }

  /* marching squares: adds one line segment per crossing to the current path */
  function march(g, w, h, lv, sx, sy, c) {
    function lerp(a, b) { return (lv - a) / (b - a); }
    for (var y = 0; y < h - 1; y++) for (var x = 0; x < w - 1; x++) {
      var a = g[y * w + x], b = g[y * w + x + 1], d = g[(y + 1) * w + x], e = g[(y + 1) * w + x + 1];
      var idx = (a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (e > lv ? 2 : 0) | (d > lv ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      var X = x + 0.5, Y = y + 0.5;   /* grid values sit at cell centres, like the raster's pixels */
      var top = [(X + lerp(a, b)) * sx, Y * sy], right = [(X + 1) * sx, (Y + lerp(b, e)) * sy];
      var bottom = [(X + lerp(d, e)) * sx, (Y + 1) * sy], left = [X * sx, (Y + lerp(a, d)) * sy];
      var segs = {
        1: [[left, bottom]], 2: [[bottom, right]], 3: [[left, right]], 4: [[top, right]],
        5: [[left, top], [bottom, right]], 6: [[top, bottom]], 7: [[left, top]], 8: [[left, top]],
        9: [[top, bottom]], 10: [[top, right], [left, bottom]], 11: [[top, right]], 12: [[left, right]],
        13: [[bottom, right]], 14: [[left, bottom]]
      }[idx];
      segs.forEach(function (sgm) { c.moveTo(sgm[0][0], sgm[0][1]); c.lineTo(sgm[1][0], sgm[1][1]); });
    }
  }

  function draw(p) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#0D0716";
    ctx.fillRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.globalAlpha = smooth(0.25, 1, p);
    ctx.drawImage(raster, 0, 0, W, H);
    ctx.globalAlpha = smooth(0.55, 1, p);
    ctx.drawImage(contours, 0, 0, W, H);
    ctx.globalAlpha = 1;

    var bk = brushed == null ? -1 : centers.findIndex(function (c) { return c.id === brushed; });
    for (var i = 0; i < pts.length; i++) {
      var q = pts[i], t = easeOutExpo(Math.max(0, Math.min(1, (p - q.delay) / 0.65)));
      var x = q.sx + (q.tx - q.sx) * t, y = q.sy + (q.ty - q.sy) * t;
      if (bk >= 0 && q.k === bk) {
        var c = centers[bk].rgb;
        ctx.fillStyle = "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
        ctx.fillRect(x - 1.2, y - 1.2, 2.4, 2.4);
      } else {
        ctx.fillStyle = bk >= 0 ? "rgba(252,253,191,0.16)" : "rgba(252,253,191,0.5)";
        ctx.fillRect(x - 0.7, y - 0.7, 1.4, 1.4);
      }
    }
  }

  function frame(now) {
    if (settled) return;
    if (!startT) startT = now;
    var p = Math.min(1, (now - startT) / DURATION);
    draw(p);
    if (p < 1) requestAnimationFrame(frame);
    else settle();
  }
  function settle() { settled = true; fig.classList.add("is-settled"); draw(1); }

  /* hover: the nearest cluster within reach lights up */
  field.addEventListener("pointermove", function (e) {
    if (!settled || !centers) return;
    var rect = field.getBoundingClientRect(), x = e.clientX - rect.left, y = e.clientY - rect.top, hit = null, best = Infinity;
    centers.forEach(function (c) {
      var d = Math.hypot(x - c.x, (y - c.y) * 1.3);
      if (d < c.S * 1.7 && d < best) { best = d; hit = c.id; }
    });
    field.style.cursor = hit ? "pointer" : "";
    if (hit !== brushed && window.siteBrush) window.siteBrush(hit);
  });
  field.addEventListener("pointerleave", function () { if (window.siteBrush) window.siteBrush(null); });
  field.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest("a")) return;
    if (brushed) { var t = document.getElementById(brushed); if (t) t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); }
  });
  document.addEventListener("brush", function (e) {
    brushed = e.detail || null;
    labels.forEach(function (l) { l.classList.toggle("is-lit", l.getAttribute("data-cluster") === brushed); });
    if (settled) draw(1);
  });

  /* Start once the field has a size (a page opened in a background tab can measure 0 at first). */
  var lastW = 0, started = false;
  function start() {
    if (started || !build()) return;
    started = true;
    fig.classList.add("is-live");      /* only now hide the static fallback and the labels */
    lastW = W;
    if (reduce) settle();
    else {
      requestAnimationFrame(frame);
      /* if animation frames never arrive (hidden tab, throttled renderer), still end on the drawn map */
      setTimeout(function () { if (!settled) settle(); }, DURATION + 1500);
    }
  }
  if ("ResizeObserver" in window) {
    var timer;
    new ResizeObserver(function () {
      if (!started) { start(); return; }
      if (field.clientWidth === lastW) return;
      clearTimeout(timer);
      timer = setTimeout(function () { lastW = field.clientWidth; if (build()) draw(settled ? 1 : 0); }, 150);
    }).observe(field);
  } else {
    window.addEventListener("load", start);
  }
  start();
})();
