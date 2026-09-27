/* ViTeX-Bench leaderboard page: a 3-D star space of the three primary metrics,
 * axis leaders, the leaderboard table, and the protocol summary.
 * Data comes from data/submissions.jsonl through ViTeXLeaderboard.load (leaderboard.js),
 * which also marks the Pareto set on the three primary metrics. */
(function () {
  'use strict';

  // ---------- Protocol metadata ----------
  var M = {
    SeqAcc:       { html: 'SeqAcc', text: 'SeqAcc', dir: 'up', digits: 3, scale: 'lin', axis: 'correctness', primary: true,
                    def: 'Share of text-readable frames where OCR of the edited region contains the exact target string.' },
    CharAcc:      { html: 'CharAcc', text: 'CharAcc', dir: 'up', digits: 3, scale: 'lin', axis: 'correctness',
                    def: 'Character-level similarity to the target string, with partial credit.' },
    TTS:          { html: 'TTS', text: 'TTS', dir: 'up', digits: 3, scale: 'lin', axis: 'correctness',
                    def: 'Whether the decoded string stays the same across adjacent frames. Read with SeqAcc.' },
    Flicker_full: { html: 'Flicker<sub>f</sub>', text: 'Flicker_f', dir: 'down', digits: 2, scale: 'log', axis: 'temporal', temporal: true,
                    def: 'Mean absolute difference between adjacent frames, full frame.' },
    Flicker_crop: { html: 'Flicker<sub>c</sub>', text: 'Flicker_c', dir: 'down', digits: 2, scale: 'log', axis: 'temporal', temporal: true,
                    def: 'The same inside a fixed text-crop box.' },
    Warp_full:    { html: 'Warp<sub>f</sub>', text: 'Warp_f', dir: 'down', digits: 2, scale: 'log', axis: 'temporal', temporal: true,
                    def: 'Adjacent-frame error after compensating source motion, full frame.' },
    Warp_crop:    { html: 'Warp<sub>c</sub>', text: 'Warp_c', dir: 'down', digits: 2, scale: 'log', axis: 'temporal', temporal: true, primary: true,
                    def: 'Motion-compensated adjacent-frame error inside the text crop.' },
    MUSIQ_full:   { html: 'MUSIQ<sub>f</sub>', text: 'MUSIQ_f', dir: 'up', digits: 2, scale: 'lin', axis: 'temporal',
                    def: 'No-reference perceptual quality, full frame.' },
    MUSIQ_crop:   { html: 'MUSIQ<sub>c</sub>', text: 'MUSIQ_c', dir: 'up', digits: 2, scale: 'lin', axis: 'temporal',
                    def: 'No-reference perceptual quality of the text crop.' },
    PSNR_loc:     { html: 'PSNR<sub>loc</sub>', text: 'PSNR_loc', dir: 'up', digits: 2, scale: 'lin', axis: 'locality',
                    def: 'Pixel fidelity outside the mask, against the source.' },
    SSIM_loc:     { html: 'SSIM<sub>loc</sub>', text: 'SSIM_loc', dir: 'up', digits: 3, scale: 'lin', axis: 'locality',
                    def: 'Structural similarity outside the mask.' },
    LPIPS_loc:    { html: 'LPIPS<sub>loc</sub>', text: 'LPIPS_loc', dir: 'down', digits: 3, scale: 'log', axis: 'locality',
                    def: 'Learned perceptual distance outside the mask.' },
    DreamSim_loc: { html: 'DreamSim<sub>loc</sub>', text: 'DreamSim_loc', dir: 'down', digits: 3, scale: 'log', axis: 'locality', primary: true,
                    def: 'Learned perceptual distance outside the mask.' }
  };
  var AXES = [
    { id: 'correctness', name: 'Text correctness', short: 'Correctness', q: 'Does the edited region read as the target string?',
      keys: ['SeqAcc', 'CharAcc', 'TTS'], primary: 'SeqAcc' },
    { id: 'temporal', name: 'Temporal quality', short: 'Temporal', q: 'Is the edited video natural and stable over time?',
      keys: ['Flicker_full', 'Flicker_crop', 'Warp_full', 'Warp_crop', 'MUSIQ_full', 'MUSIQ_crop'], primary: 'Warp_crop' },
    { id: 'locality', name: 'Edit locality', short: 'Locality', q: 'Does the scene outside the mask stay unchanged?',
      keys: ['PSNR_loc', 'SSIM_loc', 'LPIPS_loc', 'DreamSim_loc'], primary: 'DreamSim_loc' }
  ];
  var PRIMARIES = ['SeqAcc', 'Warp_crop', 'DreamSim_loc'];
  var ALL = AXES[0].keys.concat(AXES[1].keys, AXES[2].keys);
  var LOG_FLOOR = { DreamSim_loc: 0.001, LPIPS_loc: 0.002 };

  // ---------- Helpers ----------
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function reduced() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function isRanked(r) { return r.kind === 'editor'; }
  function comparable(r, k) { return !(M[k] && M[k].temporal && !r.temporal_comparable); }
  function eligible(r, k) { return isRanked(r) && comparable(r, k); }
  function val(r, k) {
    var v = r[k];
    if (k === 'PSNR_loc' && r.kind === 'reference' && v == null) return Infinity;
    return v == null ? null : v;
  }
  function better(k, a, b) { return M[k].dir === 'up' ? a > b : a < b; }
  function fmtNum(k, v) { return Number(v).toFixed(M[k].digits).replace(/^-(0\.0+)$/, '$1'); }
  function fmt(r, k) { var v = val(r, k); return v === Infinity ? '∞' : v == null ? '–' : fmtNum(k, v); }
  function arrow(k) { return M[k].dir === 'up' ? '↑' : '↓'; }
  function familyCode(r) { var m = /^([A-Z])\s+—/.exec(r.family || ''); return m ? m[1] : ''; }
  function familyLabel(r) {
    if (r.kind === 'reference') return 'Reference';
    if (r.kind === 'postprocessed') return 'Post-processed';
    var f = r.family || '', i = f.indexOf('— ');
    var s = i >= 0 ? f.slice(i + 2) : f;
    s = s.charAt(0).toUpperCase() + s.slice(1);
    return (familyCode(r) ? familyCode(r) + ' · ' : '') + s;
  }
  function ordinal(n) { var s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }

  var rows = [], byId = {}, ranks = {}, best = {};
  function computeRanks() {
    Object.keys(M).forEach(function (k) {
      var pool = rows.filter(function (r) { return eligible(r, k) && val(r, k) != null; });
      ranks[k] = {};
      pool.forEach(function (r) {
        var v = val(r, k);
        ranks[k][r.id] = { rank: pool.filter(function (o) { return better(k, val(o, k), v); }).length + 1, of: pool.length };
      });
      best[k] = pool.reduce(function (a, r) { return a == null || better(k, val(r, k), a) ? val(r, k) : a; }, null);
    });
    // Non-dominated sorting on the three primary metrics: layer 1 is the Pareto front,
    // layer 2 is the front once layer 1 is set aside, and so on. Members of one layer are
    // equally good in the Pareto sense, so they are shown in a random order on each visit.
    function dominates(o, r) {
      var ge = PRIMARIES.every(function (k) { return !better(k, val(r, k), val(o, k)); });
      var gt = PRIMARIES.some(function (k) { return better(k, val(o, k), val(r, k)); });
      return ge && gt;
    }
    rows.forEach(function (r) { r.layer = null; r.shuffle = Math.random(); });
    var left = rows.filter(function (r) { return isRanked(r) && r.temporal_comparable && PRIMARIES.every(function (k) { return val(r, k) != null; }); });
    for (var layer = 1; left.length; layer++) {
      var front = left.filter(function (r) { return !left.some(function (o) { return o !== r && dominates(o, r); }); });
      front.forEach(function (r) { r.layer = layer; });
      left = left.filter(function (r) { return front.indexOf(r) < 0; });
    }
  }
  function layerName(n) { return n === 1 ? 'Pareto front' : 'Front ' + n; }
  function byShuffle(a, b) { return a.shuffle - b.shuffle; }

  // =====================================================================
  // 3-D star space. x = correctness (SeqAcc), y = temporal (Warp_c),
  // z = locality (DreamSim_loc). Every axis runs from worst (-1) to best (+1),
  // so the ideal method sits at the corner (1, 1, 1).
  // =====================================================================
  var VIEWS = {
    '3d': { yaw: 0.52, pitch: 0.34, persp: 0.18, zoom: 1 },
    ct:   { yaw: 0, pitch: 0, persp: 0, zoom: 1.36 },
    cl:   { yaw: 0, pitch: -Math.PI / 2, persp: 0, zoom: 1.36 },
    tl:   { yaw: Math.PI / 2, pitch: 0, persp: 0, zoom: 1.36 }
  };
  var AX3 = [
    { key: 'SeqAcc', name: 'Correctness' },
    { key: 'Warp_crop', name: 'Temporal' },
    { key: 'DreamSim_loc', name: 'Locality' }
  ];

  // ---------- State + deep links ----------
  var GROUPS = {
    primary: { name: 'Primary metrics', keys: PRIMARIES },
    correctness: { name: 'Text correctness', keys: AXES[0].keys },
    temporal: { name: 'Temporal quality', keys: AXES[1].keys },
    locality: { name: 'Edit locality', keys: AXES[2].keys }
  };
  var state = { view: '3d', sort: 'front', desc: true, group: 'primary', ref: true, sel: null, open: null };
  function readHash() {
    var p = new URLSearchParams(location.hash.replace(/^#/, ''));
    if (p.has('view') && VIEWS[p.get('view')]) state.view = p.get('view');
    if (p.has('sort') && (M[p.get('sort')] || p.get('sort') === 'method' || p.get('sort') === 'front')) state.sort = p.get('sort');
    if (p.has('order')) state.desc = p.get('order') !== 'worst';
    if (GROUPS[p.get('group')]) state.group = p.get('group');
    if (p.has('ref')) state.ref = p.get('ref') !== '0';
    if (p.has('m')) state.sel = p.get('m');
    if (p.has('open')) state.open = p.get('open');
  }
  function writeHash() {
    var p = new URLSearchParams();
    if (state.view !== '3d') p.set('view', state.view);
    if (state.sort !== 'front') p.set('sort', state.sort);
    if (!state.desc) p.set('order', 'worst');
    if (state.group !== 'primary') p.set('group', state.group);
    if (!state.ref) p.set('ref', '0');
    if (state.sel) p.set('m', state.sel);
    if (state.open) p.set('open', state.open);
    var h = p.toString();
    history.replaceState(null, '', h ? '#' + h : location.pathname + location.search);
  }

  var canvas = $('sky'), ctx = canvas.getContext('2d');
  var cam = { yaw: VIEWS['3d'].yaw, pitch: VIEWS['3d'].pitch, persp: VIEWS['3d'].persp, zoom: 1 };
  var W = 0, H = 0, dpr = 1, colors = {}, scales = [], stars = [], mesh = { tris: [], pts: [] };
  var hover = null, drag = null, interacted = false, tween = null, visible = true, rafId = 0, t0 = performance.now();

  function readColors() {
    var cs = getComputedStyle(document.documentElement);
    function rgb(name) {
      var m = /^#([0-9a-f]{6})$/i.exec(cs.getPropertyValue(name).trim());
      if (!m) return [240, 240, 240];
      var n = parseInt(m[1], 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    colors = { fg: rgb('--fg'), fg3: rgb('--fg-3'), bg: rgb('--bg'), acc: rgb('--accent'), glow: parseFloat(cs.getPropertyValue('--glow')) || 0 };
  }
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

  function makeScale(k, pts) {
    var vals = pts.map(function (r) { return val(r, k); }).filter(function (v) { return v != null && isFinite(v); });
    var floor = LOG_FLOOR[k] || 1e-3, lo, hi, tf;
    if (M[k].scale === 'log') {
      tf = function (v) { return Math.log10(Math.max(v, floor)); };
      lo = Math.min.apply(null, vals.map(tf)); hi = Math.max.apply(null, vals.map(tf));
      var pad = (hi - lo) * 0.06; lo -= pad; hi += pad;
    } else {
      tf = function (v) { return v; };
      lo = Math.min(0, Math.min.apply(null, vals)); hi = Math.max.apply(null, vals);
      hi = Math.ceil(hi * 10 + 0.3) / 10; lo -= (hi - lo) * 0.04;
    }
    var f = function (v) { var t = (tf(v) - lo) / (hi - lo); t = M[k].dir === 'up' ? t : 1 - t; return t * 2 - 1; };
    f.ticks = function () {
      if (M[k].scale === 'log') {
        var cands = [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 1, 1.5, 2, 3, 5, 10, 20];
        return cands.filter(function (v) { var t = tf(v); return t >= lo && t <= hi; })
          .filter(function (v, i, a) { return a.length <= 4 || i % 2 === 0; });
      }
      var out = []; for (var v = 0; v <= hi + 1e-9; v += 0.2) out.push(+v.toFixed(2)); return out;
    };
    return f;
  }

  function buildStars() {
    var pts = rows.filter(function (r) { return AX3.every(function (a) { return comparable(r, a.key) && val(r, a.key) != null; }); });
    scales = AX3.map(function (a) { return makeScale(a.key, pts); });
    stars = pts.map(function (r) {
      return { r: r, p: [scales[0](val(r, 'SeqAcc')), scales[1](val(r, 'Warp_crop')), scales[2](val(r, 'DreamSim_loc'))] };
    });
    buildMesh();
  }

  // The Pareto front as a surface: triangulate the front's stars (Delaunay) in the plane
  // that faces the ideal diagonal (1, 1, 1), then draw those triangles in 3-D.
  function buildMesh() {
    var pts = stars.filter(function (s) { return isRanked(s.r) && s.r.pareto; });
    var uv = pts.map(function (s) {
      var p = s.p;
      return [(p[0] - p[1]) / Math.SQRT2, (p[0] + p[1] - 2 * p[2]) / Math.sqrt(6)];
    });
    var tris = [];
    for (var i = 0; i < uv.length; i++) for (var j = i + 1; j < uv.length; j++) for (var k = j + 1; k < uv.length; k++) {
      var A = uv[i], B = uv[j], Cc = uv[k];
      var d = 2 * (A[0] * (B[1] - Cc[1]) + B[0] * (Cc[1] - A[1]) + Cc[0] * (A[1] - B[1]));
      if (Math.abs(d) < 1e-9) continue;
      var a2 = A[0] * A[0] + A[1] * A[1], b2 = B[0] * B[0] + B[1] * B[1], c2 = Cc[0] * Cc[0] + Cc[1] * Cc[1];
      var ux = (a2 * (B[1] - Cc[1]) + b2 * (Cc[1] - A[1]) + c2 * (A[1] - B[1])) / d;
      var uy = (a2 * (Cc[0] - B[0]) + b2 * (A[0] - Cc[0]) + c2 * (B[0] - A[0])) / d;
      var r2 = (A[0] - ux) * (A[0] - ux) + (A[1] - uy) * (A[1] - uy);
      var empty = uv.every(function (P, m) { return m === i || m === j || m === k || (P[0] - ux) * (P[0] - ux) + (P[1] - uy) * (P[1] - uy) > r2 * (1 + 1e-9); });
      if (empty) tris.push([pts[i].p, pts[j].p, pts[k].p]);
    }
    mesh = { tris: tris, pts: pts.map(function (s) { return s.p; }) };
  }

  function layoutSize() {
    var b = canvas.getBoundingClientRect();
    W = b.width; H = b.height; dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function frame() {
    var wide = W > 860;
    var cx = wide ? W * 0.64 : W / 2;
    var cy = wide ? H * 0.44 : H * 0.5;
    var r3 = wide ? Math.min(W * 0.19, (H * 0.5 - 100) / 1.5) : Math.min(W * 0.26, (H * 0.5 - 30) / 1.45);
    var rF = wide ? Math.min(W * 0.22, H * 0.5 - 120) : Math.min(W * 0.33, H * 0.5 - 56);
    var t = (cam.zoom - 1) / 0.36;
    return { cx: cx, cy: cy, R: r3 + (rF - r3) * t };
  }
  function projector() {
    var F = frame(), cyw = Math.cos(cam.yaw), syw = Math.sin(cam.yaw), cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
    function rot(p) {
      var x1 = p[0] * cyw + p[2] * syw, z1 = -p[0] * syw + p[2] * cyw;
      return [x1, p[1] * cp - z1 * sp, p[1] * sp + z1 * cp];
    }
    var fn = function (p) {
      var q = rot(p), f = 1 / (1 - cam.persp * q[2] * 0.33);
      return { x: F.cx + q[0] * F.R * f, y: F.cy - q[1] * F.R * f, z: q[2], f: f };
    };
    fn.rot = rot; fn.F = F;
    return fn;
  }

  function line(P, a, b, style, width, dash) {
    var p = P(a), q = P(b);
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
    ctx.strokeStyle = style; ctx.lineWidth = width || 1; ctx.setLineDash(dash || []); ctx.stroke(); ctx.setLineDash([]);
  }
  function text(str, x, y, font, color, align, halo) {
    ctx.font = font; ctx.textAlign = align || 'left'; ctx.textBaseline = 'middle';
    if (halo) { ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.strokeStyle = rgba(colors.bg, 0.85); ctx.strokeText(str, x, y); }
    ctx.fillStyle = color; ctx.fillText(str, x, y);
  }
  var SANS = '"Atkinson Hyperlegible Next", system-ui, sans-serif', MONO = '"Atkinson Hyperlegible Mono", ui-monospace, monospace';
  // Draw a metric name the way the HTML does: base, lowered small subscript, direction arrow.
  function metricParts(key) {
    var m = /^(.*?)<sub>(.*?)<\/sub>$/.exec(M[key].html);
    return { base: m ? m[1] : M[key].html, sub: m ? m[2] : '', tail: ' ' + arrow(key) };
  }
  function metricWidth(key, size) {
    var p = metricParts(key);
    ctx.font = '400 ' + size + 'px ' + MONO; var w = ctx.measureText(p.base + p.tail).width;
    ctx.font = '400 ' + (size * 0.75) + 'px ' + MONO; return w + (p.sub ? ctx.measureText(p.sub).width + 1 : 0);
  }
  function metricText(key, x, y, size, color, align) {
    var p = metricParts(key), w = metricWidth(key, size);
    var x0 = align === 'left' ? x : align === 'right' ? x - w : x - w / 2;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = color;
    ctx.font = '400 ' + size + 'px ' + MONO; ctx.fillText(p.base, x0, y); x0 += ctx.measureText(p.base).width;
    if (p.sub) { ctx.font = '400 ' + (size * 0.75) + 'px ' + MONO; ctx.fillText(p.sub, x0 + 0.5, y + size * 0.3); x0 += ctx.measureText(p.sub).width + 1; }
    ctx.font = '400 ' + size + 'px ' + MONO; ctx.fillText(p.tail, x0, y);
  }
  function hit(box, list) { return list.some(function (b) { return box.x < b.x + b.w && b.x < box.x + box.w && box.y < b.y + b.h && b.y < box.y + box.h; }); }

  function draw() {
    if (!W) return;
    var P = projector(), F = P.F, fg = colors.fg, is3d = cam.persp > 0.02;
    ctx.clearRect(0, 0, W, H);

    // Screen box of the cube, used to keep face-view labels inside the plot frame.
    var corners = [], cb = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
    [-1, 1].forEach(function (a) { [-1, 1].forEach(function (b) { [-1, 1].forEach(function (c) { corners.push(P([a, b, c])); }); }); });
    corners.forEach(function (c) { cb.x0 = Math.min(cb.x0, c.x); cb.y0 = Math.min(cb.y0, c.y); cb.x1 = Math.max(cb.x1, c.x); cb.y1 = Math.max(cb.y1, c.y); });

    // Back walls (x = -1, y = -1, z = -1) with grid lines at the tick values.
    var ticks = scales.map(function (s) { return s.ticks().map(function (v) { return { v: v, t: s(v) }; }); });
    var wall = rgba(fg, 0.08), edge = rgba(fg, 0.22);
    ticks[0].forEach(function (k) { line(P, [k.t, -1, -1], [k.t, 1, -1], wall); line(P, [k.t, -1, -1], [k.t, -1, 1], wall); });
    ticks[1].forEach(function (k) { line(P, [-1, k.t, -1], [1, k.t, -1], wall); line(P, [-1, k.t, -1], [-1, k.t, 1], wall); });
    ticks[2].forEach(function (k) { line(P, [-1, -1, k.t], [1, -1, k.t], wall); line(P, [-1, -1, k.t], [-1, 1, k.t], wall); });
    // the full cube outline, faint, so the volume and the ideal corner read at a glance
    var box = rgba(fg, 0.13);
    [[[-1, 1, -1], [1, 1, -1]], [[1, -1, -1], [1, 1, -1]], [[1, -1, -1], [1, -1, 1]], [[-1, 1, -1], [-1, 1, 1]], [[-1, -1, 1], [-1, 1, 1]], [[-1, -1, 1], [1, -1, 1]],
     [[1, 1, -1], [1, 1, 1]], [[-1, 1, 1], [1, 1, 1]], [[1, -1, 1], [1, 1, 1]]].forEach(function (e) { line(P, e[0], e[1], box); });

    // Axes: each runs along whichever parallel cube edge sits outermost (towards the
    // bottom-left) on screen, so ticks and labels never land inside the volume.
    var small = W < 560, axisBoxes = [], C = P([0, 0, 0]);
    AX3.forEach(function (a, i) {
      var o = [0, 0, 0], e = [0, 0, 0]; o[i] = -1; e[i] = 1.12;
      var so = P(o), se = P(e), len = Math.hypot(se.x - so.x, se.y - so.y);
      if (len < F.R * 0.35) return; // axis points at the viewer in a face view
      var ux = (se.x - so.x) / len, uy = (se.y - so.y) / len, nx = -uy, ny = ux;
      if (-nx + ny < 0) { nx = -nx; ny = -ny; }
      var j = (i + 1) % 3, k2 = (i + 2) % 3, bestEdge = null, bestS = -Infinity;
      [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(function (c) {
        var m = [0, 0, 0]; m[j] = c[0]; m[k2] = c[1];
        var pm = P(m), sc = (pm.x - C.x) * nx + (pm.y - C.y) * ny;
        if (sc > bestS + 0.5) { bestS = sc; bestEdge = c; }
      });
      function at(t) { var q = [0, 0, 0]; q[i] = t; q[j] = bestEdge[0]; q[k2] = bestEdge[1]; return q; }
      line(P, at(-1), at(1.12), edge, 1);
      var tip = P(at(1.12));
      ctx.beginPath(); ctx.moveTo(tip.x, tip.y);
      ctx.lineTo(tip.x - ux * 7 - uy * 3.5, tip.y - uy * 7 + ux * 3.5);
      ctx.lineTo(tip.x - ux * 7 + uy * 3.5, tip.y - uy * 7 - ux * 3.5);
      ctx.closePath(); ctx.fillStyle = edge; ctx.fill();
      var tickFont = '400 ' + (small ? 11 : 11.5) + 'px ' + MONO, tickCol = rgba(colors.fg3, 1);
      ctx.font = tickFont;
      ticks[i].forEach(function (k) {
        var p = P(at(k.t)), label = String(k.v), tw0 = ctx.measureText(label).width;
        var box = { x: p.x + nx * 17 - tw0 / 2 - 3, y: p.y + ny * 17 - 8, w: tw0 + 6, h: 16 };
        if (hit(box, axisBoxes)) return; // two axes meeting at a corner: keep the first label only
        text(label, p.x + nx * 17, p.y + ny * 17, tickFont, tickCol, 'center');
        ctx.font = tickFont;
        axisBoxes.push(box);
      });
      var nameFont = '500 ' + (small ? 12 : 13) + 'px ' + SANS, metSize = small ? 11 : 12;
      ctx.font = nameFont; var tw = Math.max(ctx.measureText(a.name).width, metricWidth(a.key, metSize));
      var lx, ly, align, left, box, tries = 0;
      do {
        var push = tries * 14;
        if (Math.abs(uy) < 0.3) { lx = tip.x; ly = tip.y + ny * (40 + push); align = 'right'; }            // horizontal: under the arrow
        else if (Math.abs(ux) < 0.3) { lx = tip.x; ly = tip.y - 36 - push; align = 'center'; }            // vertical: above the arrow
        else { lx = tip.x + ux * (16 + push) + nx * 12; ly = tip.y + uy * (16 + push) + ny * 12 - (uy < 0 ? 18 : 0); align = ux > 0 ? 'left' : 'right'; }
        left = align === 'left' ? lx : align === 'right' ? lx - tw : lx - tw / 2;
        if (left < 6) { lx += 6 - left; left = 6; } else if (left + tw > W - 6) { lx -= left + tw - (W - 6); left = W - 6 - tw; }
        ly = Math.max(12, Math.min(H - (W > 860 ? 96 : 24), ly)); // keep clear of the legend row on wide screens
        box = { x: left - 2, y: ly - 9, w: tw + 4, h: 32 };
        tries++;
      } while (hit(box, axisBoxes) && tries < 5);
      text(a.name, lx, ly, nameFont, rgba(fg, 0.92), align);
      metricText(a.key, lx, ly + 16, metSize, tickCol, align);
      axisBoxes.push(box);
    });

    // The Pareto front mesh (3-D only; it fades out in the two-axis views, where a
    // projected surface would read as a 2-D frontier).
    var meshA = Math.max(0, Math.min(1, (cam.persp - 0.02) / 0.14));
    if (meshA > 0 && mesh.tris.length) {
      mesh.tris.map(function (t) { var q = t.map(P); return { q: q, z: (q[0].z + q[1].z + q[2].z) / 3 }; })
        .sort(function (a, b) { return a.z - b.z; })
        .forEach(function (t) {
          ctx.beginPath(); ctx.moveTo(t.q[0].x, t.q[0].y); ctx.lineTo(t.q[1].x, t.q[1].y); ctx.lineTo(t.q[2].x, t.q[2].y); ctx.closePath();
          ctx.fillStyle = rgba(colors.acc, (colors.glow ? 0.12 : 0.1) * meshA); ctx.fill();
          ctx.strokeStyle = rgba(colors.acc, (colors.glow ? 0.6 : 0.7) * meshA); ctx.lineWidth = 1; ctx.stroke();
        });
    } else if (meshA > 0 && mesh.pts.length === 2) {
      line(P, mesh.pts[0], mesh.pts[1], rgba(colors.acc, 0.6 * meshA), 1);
    }

    // The ideal corner: a large bright star with diffraction spikes.
    var I = P([1, 1, 1]), spike = small ? 22 : 30;
    if (colors.glow) {
      var gR = small ? 46 : 70, gl = ctx.createRadialGradient(I.x, I.y, 0, I.x, I.y, gR);
      gl.addColorStop(0, rgba(fg, 0.55)); gl.addColorStop(0.12, rgba(fg, 0.28)); gl.addColorStop(0.4, rgba(fg, 0.08)); gl.addColorStop(1, rgba(fg, 0));
      ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(I.x, I.y, gR, 0, 6.2832); ctx.fill();
    }
    [[1, 0, spike], [0, 1, spike], [0.7071, 0.7071, spike * 0.45], [0.7071, -0.7071, spike * 0.45]].forEach(function (d) {
      var sg = ctx.createLinearGradient(I.x - d[0] * d[2], I.y - d[1] * d[2], I.x + d[0] * d[2], I.y + d[1] * d[2]);
      sg.addColorStop(0, rgba(fg, 0)); sg.addColorStop(0.5, rgba(fg, colors.glow ? 0.95 : 0.7)); sg.addColorStop(1, rgba(fg, 0));
      ctx.strokeStyle = sg; ctx.lineWidth = d[2] === spike ? 1.4 : 1;
      ctx.beginPath(); ctx.moveTo(I.x - d[0] * d[2], I.y - d[1] * d[2]); ctx.lineTo(I.x + d[0] * d[2], I.y + d[1] * d[2]); ctx.stroke();
    });
    ctx.beginPath(); ctx.arc(I.x, I.y, small ? 4.5 : 5.5, 0, 6.2832); ctx.fillStyle = rgba(fg, 1); ctx.fill();
    ctx.beginPath(); ctx.arc(I.x, I.y, small ? 9 : 11, 0, 6.2832); ctx.strokeStyle = rgba(fg, 0.5); ctx.lineWidth = 1; ctx.stroke();
    ctx.font = '500 ' + (small ? 12 : 13.5) + 'px ' + SANS;
    var iw = ctx.measureText('Ideal').width, ix = I.x + 14, iy = I.y - 16;
    if (ix + iw > W - 6) ix = I.x - 14 - iw;
    text('Ideal', ix, iy, '500 ' + (small ? 12 : 13.5) + 'px ' + SANS, rgba(fg, 0.95), 'left', true);
    var idealBox = { x: Math.min(ix, I.x - spike) - 2, y: I.y - spike, w: Math.max(ix + iw, I.x + spike) - Math.min(ix, I.x - spike) + 4, h: spike * 2 };

    // Stars, far to near
    var proj = stars.map(function (s) { var q = P(s.p); return { s: s, x: q.x, y: q.y, z: q.z, f: q.f }; })
      .sort(function (a, b) { return a.z - b.z; });
    var depth = function (z) { return is3d ? 0.55 + 0.45 * (z + 1.8) / 3.6 : 1; };
    var focus = state.sel || (hover && hover.s.r.id);

    // drop line to the floor for the focused star
    proj.forEach(function (q) {
      if (!is3d || q.s.r.id !== focus) return;
      var base = [q.s.p[0], -1, q.s.p[2]];
      line(P, q.s.p, base, rgba(fg, 0.4), 1, [3, 4]);
      var b = P(base); ctx.beginPath(); ctx.arc(b.x, b.y, 2.2, 0, 6.2832); ctx.fillStyle = rgba(fg, 0.4); ctx.fill();
    });

    proj.forEach(function (q) {
      var r = q.s.r, a = depth(q.z), k = q.f;
      if (!isRanked(r)) {
        ctx.beginPath(); ctx.arc(q.x, q.y, 4.2 * k, 0, 6.2832);
        ctx.strokeStyle = rgba(fg, 0.75 * a); ctx.lineWidth = 1.1; ctx.stroke();
      } else if (r.pareto) {
        if (colors.glow) {
          var g = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, 20 * k);
          g.addColorStop(0, rgba(colors.acc, 0.45 * a)); g.addColorStop(1, rgba(colors.acc, 0));
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(q.x, q.y, 20 * k, 0, 6.2832); ctx.fill();
        }
        ctx.beginPath(); ctx.arc(q.x, q.y, 4.4 * k, 0, 6.2832); ctx.fillStyle = rgba(colors.acc, Math.min(1, a + 0.15)); ctx.fill();
        ctx.beginPath(); ctx.arc(q.x, q.y, 8.5 * k, 0, 6.2832); ctx.strokeStyle = rgba(colors.acc, 0.6 * a); ctx.lineWidth = 1; ctx.stroke();
      } else {
        ctx.beginPath(); ctx.arc(q.x, q.y, 2.8 * k * (is3d ? 0.7 + 0.3 * a : 1), 0, 6.2832); ctx.fillStyle = rgba(fg, 0.62 * a); ctx.fill();
      }
      if (r.id === focus) {
        ctx.beginPath(); ctx.arc(q.x, q.y, 13 * k, 0, 6.2832); ctx.strokeStyle = rgba(fg, 0.9); ctx.lineWidth = 1.2; ctx.stroke();
      }
      q.a = a;
    });

    // Labels: the Pareto set and the focused star in 3-D; every star in a face view.
    var placed = axisBoxes.concat([idealBox]), order = proj.slice().sort(function (a, b) {
      var pa = a.s.r.id === focus ? 0 : a.s.r.pareto ? 1 : isRanked(a.s.r) ? 2 : 3;
      var pb = b.s.r.id === focus ? 0 : b.s.r.pareto ? 1 : isRanked(b.s.r) ? 2 : 3;
      return pa - pb;
    });
    var font = '500 ' + (small ? 11.5 : 12.5) + 'px ' + SANS;
    function nearestIsOwn(box, q) {
      var cx = box.x + box.w / 2, cy = box.y + box.h / 2, dOwn = Math.hypot(q.x - cx, q.y - cy);
      // a clear margin, not a hair: the label must obviously belong to its own star
      return !proj.some(function (o) {
        if (o === q || Math.hypot(o.x - q.x, o.y - q.y) <= 8) return false;
        var ox = Math.max(box.x - o.x, 0, o.x - box.x - box.w), oy = Math.max(box.y - o.y, 0, o.y - box.y - box.h);
        var qx = Math.max(box.x - q.x, 0, q.x - box.x - box.w), qy = Math.max(box.y - q.y, 0, q.y - box.y - box.h);
        return Math.hypot(o.x - cx, o.y - cy) < dOwn + 6 || Math.hypot(ox, oy) < Math.hypot(qx, qy) + 8;
      });
    }
    order.forEach(function (q) {
      var r = q.s.r, on = r.id === focus, must = on || (isRanked(r) && r.pareto) || (!is3d && isRanked(r));
      if (!on && is3d && !r.pareto) return;
      var name = r.method;
      ctx.font = font;
      var w = ctx.measureText(name).width, h = 14, g = (r.pareto ? 13 : 9) * q.f, d = g * 0.75;
      var cands = [[g, 0, 'left'], [-g, 0, 'right'], [d, -d - 4, 'left'], [d, d + 4, 'left'], [-d, -d - 4, 'right'], [-d, d + 4, 'right'], [0, -g - 4, 'center'], [0, g + 6, 'center']];
      var chosen = null;
      function boxFor(c) {
        var x0 = c[2] === 'left' ? q.x + c[0] : c[2] === 'right' ? q.x + c[0] - w : q.x - w / 2;
        return { x: x0 - 2, y: q.y + c[1] - h / 2, w: w + 4, h: h };
      }
      function free(box) {
        if (box.x < 4 || box.x + box.w > W - 4 || box.y < 4 || box.y + box.h > H - 4) return false;
        if (!is3d && (box.x < cb.x0 + 3 || box.x + box.w > cb.x1 + 70)) return false; // stay inside the plot frame
        if (hit(box, placed)) return false;
        return !proj.some(function (o) { return o !== q && o.x > box.x - 5 && o.x < box.x + box.w + 5 && o.y > box.y - 5 && o.y < box.y + box.h + 5; });
      }
      for (var i = 0; i < cands.length && !chosen; i++) {
        var bx = boxFor(cands[i]);
        if (free(bx) && nearestIsOwn(bx, q)) chosen = { c: cands[i], box: bx };
      }
      // Pareto and focused stars always keep their name: push it out on a hairline leader.
      if (!chosen && must) {
        for (var ring = 30; ring <= 90 && !chosen; ring += 15) {
          for (var ang = 0; ang < 8 && !chosen; ang++) {
            var t = ang * Math.PI / 4 - Math.PI / 8, dx = Math.cos(t) * ring, dy = Math.sin(t) * ring * 0.7;
            var c = [dx, dy, dx >= 0 ? 'left' : 'right'], bx2 = boxFor(c);
            if (free(bx2)) chosen = { c: c, box: bx2, leader: true };
          }
        }
        if (!chosen) { var c0 = [g, 0, 'left']; chosen = { c: c0, box: boxFor(c0) }; }
      }
      if (!chosen) return;
      placed.push(chosen.box);
      if (chosen.leader) {
        var ex = chosen.c[2] === 'left' ? chosen.box.x : chosen.box.x + chosen.box.w;
        var ang2 = Math.atan2(chosen.c[1], chosen.c[0]), r0 = (r.pareto ? 10 : 6) * q.f;
        ctx.beginPath(); ctx.moveTo(q.x + Math.cos(ang2) * r0, q.y + Math.sin(ang2) * r0); ctx.lineTo(ex, q.y + chosen.c[1]);
        ctx.strokeStyle = rgba(colors.fg3, 1); ctx.lineWidth = 1; ctx.stroke();
      }
      var col = on ? rgba(fg, 1) : isRanked(r) ? rgba(fg, 0.86 * (q.a || 1)) : rgba(colors.fg3, 1);
      text(name, chosen.c[2] === 'center' ? q.x : q.x + chosen.c[0], q.y + chosen.c[1], font, col, chosen.c[2], true);
    });

    canvas._proj = proj;
  }

  // ---------- Animation ----------
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function pressView(view) {
    document.querySelectorAll('.views [data-view]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-view') === view ? 'true' : 'false'); });
  }
  function goTo(view, instant) {
    state.view = view; pressView(view);
    var to = VIEWS[view];
    if (instant || reduced()) { cam.yaw = to.yaw; cam.pitch = to.pitch; cam.persp = to.persp; cam.zoom = to.zoom; tween = null; draw(); }
    else { tween = { from: { yaw: cam.yaw, pitch: cam.pitch, persp: cam.persp, zoom: cam.zoom }, to: to, start: performance.now(), dur: 1100 }; loop(); }
    updateNote();
  }
  function loop() {
    if (rafId) return;
    rafId = requestAnimationFrame(function (now) {
      rafId = 0;
      var more = false;
      if (tween) {
        var t = Math.min(1, (now - tween.start) / tween.dur), e = ease(t);
        ['yaw', 'pitch', 'persp', 'zoom'].forEach(function (k) { cam[k] = tween.from[k] + (tween.to[k] - tween.from[k]) * e; });
        if (t >= 1) tween = null; else more = true;
      } else if (state.view === '3d' && !interacted && !drag && !reduced()) {
        cam.yaw = VIEWS['3d'].yaw + Math.sin((now - t0) / 9000) * 0.32;
        more = true;
      }
      draw();
      if (more && visible) loop();
    });
  }

  function pick(x, y) {
    var proj = canvas._proj || [], bestQ = null, bestD = 20;
    proj.forEach(function (q) { var d = Math.hypot(q.x - x, q.y - y); if (d < bestD) { bestD = d; bestQ = q; } });
    return bestQ;
  }
  function initInteraction() {
    canvas.addEventListener('pointerdown', function (e) {
      drag = { x: e.clientX, y: e.clientY, yaw: cam.yaw, pitch: cam.pitch, moved: false, id: e.pointerId };
    });
    canvas.addEventListener('pointermove', function (e) {
      var b = canvas.getBoundingClientRect();
      if (drag && drag.id === e.pointerId) {
        var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (!drag.moved && Math.hypot(dx, dy) > 4) {
          drag.moved = true; interacted = true; tween = null;
          try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
          canvas.classList.add('is-dragging');
          if (state.view !== '3d') { state.view = '3d'; cam.persp = VIEWS['3d'].persp; cam.zoom = 1; pressView('3d'); updateNote(); writeHash(); }
        }
        if (drag.moved) {
          cam.yaw = Math.max(-1.8, Math.min(1.8, drag.yaw + dx * 0.008));
          if (e.pointerType === 'mouse') cam.pitch = Math.max(-Math.PI / 2, Math.min(1.25, drag.pitch + dy * 0.008));
          draw();
          return;
        }
      }
      var q = pick(e.clientX - b.left, e.clientY - b.top);
      if ((q && q.s) !== (hover && hover.s)) { hover = q; canvas.classList.toggle('is-hover', !!q); if (!rafId) draw(); }
    });
    function end(e) {
      if (!drag || drag.id !== e.pointerId) return;
      var wasDrag = drag.moved;
      drag = null; canvas.classList.remove('is-dragging');
      if (!wasDrag && e.type === 'pointerup') {
        var b = canvas.getBoundingClientRect(), q = pick(e.clientX - b.left, e.clientY - b.top);
        select(q ? q.s.r.id : null);
      }
    }
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);
    canvas.addEventListener('pointerleave', function () { if (hover) { hover = null; canvas.classList.remove('is-hover'); if (!rafId) draw(); } });
    document.querySelectorAll('.views [data-view]').forEach(function (b) {
      b.addEventListener('click', function () { interacted = true; goTo(b.getAttribute('data-view')); writeHash(); });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && state.sel) select(null); });
    if (window.IntersectionObserver) new IntersectionObserver(function (en) {
      visible = en[0].isIntersecting; if (visible) loop();
    }).observe(canvas);
    if (window.ResizeObserver) new ResizeObserver(function () { layoutSize(); draw(); }).observe(canvas);
  }

  function updateNote() {
    var missing = rows.filter(function (r) { return !stars.some(function (s) { return s.r === r; }); }).map(function (r) { return r.method; });
    var n = state.view === '3d'
      ? 'Drag to rotate. The mesh joins the Pareto front; the bright star is the ideal corner. Select a star for details.'
      : 'A two-axis view. The Pareto front is judged on all three axes, so some of its members can look dominated here.';
    if (missing.length) n += ' ' + missing.join(', ') + ' † is not plotted.';
    $('note').textContent = n;
  }

  // ---------- Selection card ----------
  function renderCard() {
    var card = $('card'), r = state.sel && byId[state.sel];
    if (!r) { card.hidden = true; card.innerHTML = ''; return; }
    var dl = PRIMARIES.map(function (k) {
      var rk = ranks[k][r.id];
      var rt = !isRanked(r) ? '' : !comparable(r, k) ? '†' : rk ? rk.rank + ' / ' + rk.of : '';
      return '<dt>' + M[k].html + ' ' + arrow(k) + '</dt><dd>' + fmt(r, k) + (comparable(r, k) ? '' : '†') + '</dd><dd class="rk">' + rt + '</dd>';
    }).join('');
    var status = !isRanked(r) ? 'Reference, not ranked' : r.layer ? (r.layer === 1 ? 'On the Pareto front' : layerName(r.layer)) : 'Not compared (†)';
    card.innerHTML =
      '<button class="card__close" type="button" aria-label="Close"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<h3>' + symbol(r) + esc(r.method) + '</h3>' +
      '<p class="card__meta">' + esc(familyLabel(r)) + (r.organization ? ' · ' + esc(r.organization) : '') + '</p>' +
      '<dl>' + dl + '</dl>' +
      '<div class="card__foot"><span>' + status + '</span>' +
      '<button class="linkbtn" type="button" data-open>All metrics<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></div>';
    card.hidden = false;
    card.querySelector('.card__close').addEventListener('click', function () { select(null); });
    card.querySelector('[data-open]').addEventListener('click', function () { openRow(r.id, true); });
  }
  function select(id, opts) {
    state.sel = id && byId[id] ? id : null;
    renderCard(); draw(); writeHash();
    if (opts && opts.scroll) {
      var b = canvas.getBoundingClientRect();
      if (b.top < 60 || b.bottom > window.innerHeight + 200) canvas.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'center' });
    }
  }

  // ---------- Axis leaders ----------
  function renderLeaders() {
    var html = PRIMARIES.map(function (k, i) {
      var pool = rows.filter(function (r) { return eligible(r, k) && val(r, k) != null; })
        .sort(function (a, b) { return better(k, val(a, k), val(b, k)) ? -1 : better(k, val(b, k), val(a, k)) ? 1 : 0; });
      var lead = pool[0];
      if (!lead) return '';
      return '<div class="leader"><p class="leader__axis">' + AXES[i].short + ' <span>' + M[k].html + ' ' + arrow(k) + '</span></p>' +
        '<div class="leader__row"><button class="leader__name" type="button" data-sel="' + esc(lead.id) + '">' + esc(lead.method) + '</button>' +
        '<span class="leader__val">' + fmt(lead, k) + '</span></div></div>';
    }).join('');
    var members = rows.filter(function (r) { return r.layer === 1; }).sort(byShuffle);
    html += '<div class="leader"><p class="leader__axis is-front">Pareto front <span>' + members.length + '</span></p><ul class="leader__members">' +
      members.map(function (r) { return '<li><button type="button" data-sel="' + esc(r.id) + '">' + esc(r.method) + '</button></li>'; }).join('') + '</ul></div>';
    var g = $('leaders');
    g.innerHTML = html;
    g.querySelectorAll('[data-sel]').forEach(function (b) {
      b.addEventListener('click', function () { select(b.getAttribute('data-sel'), { scroll: true }); });
    });
  }

  // ---------- Protocol ----------
  function renderAxes() {
    $('axes').innerHTML = AXES.map(function (a) {
      return '<div class="ax"><h3>' + a.name + '</h3><p>' + a.q + '</p><ul>' +
        a.keys.map(function (k) { return '<li' + (M[k].primary ? ' class="prim" title="Primary metric"' : '') + '>' + M[k].html + ' ' + arrow(k) + '</li>'; }).join('') +
        '</ul><details><summary><svg class="icon disc" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12"/><path class="v" d="M12 6v12"/></svg>Definitions</summary><dl>' +
        a.keys.map(function (k) { return '<dt>' + M[k].html + (M[k].primary ? ' · primary' : '') + '</dt><dd>' + M[k].def + '</dd>'; }).join('') +
        '</dl></details></div>';
    }).join('');
  }

  // ---------- Leaderboard ----------
  // Wide screens get a table whose columns are one metric group at a time, so it always
  // fits without sideways scrolling. Narrow screens get one compact entry per method.
  var CARET = '<svg class="caret icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  var CHEV = '<svg class="chev icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';
  function symbol(r) {
    if (!isRanked(r)) return '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="4" class="lg-ring"/></svg>';
    if (r.pareto) return '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" class="lg-acc-ring"/><circle cx="8" cy="8" r="3.4" class="lg-acc"/></svg>';
    return '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="2.6" class="lg-dim"/></svg>';
  }
  function frontPill(r) {
    return r.layer === 1 ? '<span class="pill">' + '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="8" cy="8" r="3" fill="currentColor"/></svg>Pareto front</span>' : '';
  }
  function nameHtml(r) {
    var words = r.method.split(' ');
    if (!r.temporal_comparable) words[words.length - 1] += ' †';
    return words.map(function (w) { return '<span class="nw">' + esc(w) + '</span>'; }).join(' ');
  }
  function compact() { return window.matchMedia('(max-width: 960px)').matches; }
  function keysNow() { return GROUPS[state.group].keys; }
  function metricLabel(k) { return '<span class="sort__k">' + M[k].html + '</span> ' + arrow(k); }

  // Ordered sections: [{ title, rows, rank(r) }]
  function sections() {
    var k = state.sort;
    var list = rows.filter(function (r) { return state.ref || isRanked(r); });
    var refs = list.filter(function (r) { return !isRanked(r); }).sort(function (a, b) { return a.method.localeCompare(b.method); });
    var out = [];
    if (k === 'front') {
      var layered = list.filter(function (r) { return r.layer; });
      var maxL = layered.reduce(function (m, r) { return Math.max(m, r.layer); }, 0);
      for (var L = 1; L <= maxL; L++) {
        var rs = layered.filter(function (r) { return r.layer === L; }).sort(byShuffle);
        if (rs.length) out.push({ title: layerName(L) + (L === 1 ? ' · unbeaten on all three primary metrics, in random order' : ''), rows: rs, rank: function (r) { return r.layer; }, front: L === 1 });
      }
      var excl = list.filter(function (r) { return isRanked(r) && !r.layer; });
      if (excl.length) out.push({ title: 'Not compared · temporal scores not comparable', rows: excl, rank: function () { return '†'; } });
    } else {
      var cmp = function (a, b) {
        if (k === 'method') return state.desc ? a.method.localeCompare(b.method) : b.method.localeCompare(a.method);
        var va = val(a, k), vb = val(b, k);
        if (va == null) return 1; if (vb == null) return -1;
        var s2 = better(k, va, vb) ? -1 : better(k, vb, va) ? 1 : 0;
        return (state.desc ? s2 : -s2) || a.method.localeCompare(b.method);
      };
      var ranked = list.filter(function (r) { return k === 'method' ? isRanked(r) : eligible(r, k); }).sort(cmp);
      var ex2 = list.filter(function (r) { return isRanked(r) && ranked.indexOf(r) < 0; }).sort(cmp);
      out.push({ title: null, rows: ranked.concat(ex2), rank: function (r) { var rk = k !== 'method' && ranks[k][r.id]; return rk ? rk.rank : (k === 'method' ? '' : '†'); } });
    }
    if (refs.length) out.push({ title: 'References · not ranked', rows: refs, rank: function () { return ''; } });
    return out;
  }

  function cellValue(r, k) {
    if (!comparable(r, k)) return { cls: 'na', html: fmt(r, k) + '<span class="dg">†</span>' };
    var isBest = eligible(r, k) && best[k] != null && val(r, k) === best[k];
    return { cls: isBest ? 'best' : '', html: fmt(r, k) + (isBest ? '<span class="visually-hidden"> (best)</span>' : '') };
  }

  function renderTable() {
    var keys = keysNow(), secs = sections(), k = state.sort;
    document.querySelectorAll('.tabs [data-group]').forEach(function (b) { b.setAttribute('aria-checked', b.getAttribute('data-group') === state.group ? 'true' : 'false'); });
    $('sort-sel').value = k;
    $('order-btn').hidden = k === 'front';
    $('order-btn').setAttribute('aria-label', state.desc ? 'Best first. Switch to worst first' : 'Worst first. Switch to best first');
    $('order-btn').querySelector('span').textContent = state.desc ? (k === 'method' ? 'A–Z' : 'Best first') : (k === 'method' ? 'Z–A' : 'Worst first');

    if (compact()) {
      $('table-wrap').hidden = true; $('mlist').hidden = false;
      var html = '';
      secs.forEach(function (sec) {
        if (sec.title) html += '<li class="mlist__div' + (sec.front ? ' is-front' : '') + '">' + esc(sec.title) + '</li>';
        sec.rows.forEach(function (r) {
          var open = state.open === r.id;
          html += '<li class="mitem' + (r.layer === 1 ? ' front' : '') + (isRanked(r) ? '' : ' ref') + (open ? ' open' : '') + '" data-id="' + esc(r.id) + '">' +
            '<button class="mitem__head" type="button" aria-expanded="' + open + '">' +
            '<span class="mitem__rank">' + sec.rank(r) + '</span>' + symbol(r) +
            '<span class="mitem__name">' + nameHtml(r) + '</span>' + frontPill(r) + CHEV + '</button>' +
            '<dl class="mitem__grid">' + keys.map(function (kk) {
              var c = cellValue(r, kk);
              return '<div class="' + (kk === k ? 'sorted' : '') + '"><dt>' + metricLabel(kk) + '</dt><dd class="' + c.cls + '">' + c.html + '</dd></div>';
            }).join('') + '</dl>' +
            (open ? '<div class="mitem__vec">' + vecHtml(r) + '</div>' : '') + '</li>';
        });
      });
      var list = $('mlist');
      list.innerHTML = html;
      list.querySelectorAll('.mitem__head').forEach(function (b) {
        b.addEventListener('click', function () { var id = b.parentNode.getAttribute('data-id'); openRow(state.open === id ? null : id); });
      });
    } else {
      $('table-wrap').hidden = false; $('mlist').hidden = true;
      var sa = function (key) { return k === key ? ' aria-sort="' + (state.desc ? 'descending' : 'ascending') + '"' : ''; };
      var head = '<tr><th class="rank" scope="col"' + sa('front') + '><button class="sort sort--rank" type="button" data-sort="front" title="Sort by Pareto front">' + (k === 'front' ? 'Front' : '#') + '</button></th>' +
        '<th class="l" scope="col"' + sa('method') + '><button class="sort" type="button" data-sort="method">Method' + CARET + '</button></th>' +
        keys.map(function (kk) { return '<th scope="col"' + sa(kk) + '><button class="sort sort--metric" type="button" data-sort="' + kk + '" title="' + esc(M[kk].def) + '"><span class="sort__k">' + M[kk].html + '</span><span class="sort__d">' + arrow(kk) + CARET + '</span></button></th>'; }).join('') + '</tr>';
      $('lb-head').innerHTML = head;
      var body = '';
      secs.forEach(function (sec) {
        if (sec.title) body += '<tr class="divider' + (sec.front ? ' is-front' : '') + '"><td colspan="' + (keys.length + 2) + '">' + esc(sec.title) + '</td></tr>';
        sec.rows.forEach(function (r) {
          var open = state.open === r.id;
          body += '<tr class="row' + (r.layer === 1 ? ' front' : '') + (isRanked(r) ? '' : ' ref') + (open ? ' open' : '') + '" data-id="' + esc(r.id) + '">' +
            '<td class="rank">' + sec.rank(r) + '</td>' +
            '<td class="l"><div class="mcell">' + symbol(r) +
            '<button class="mbtn" type="button" aria-expanded="' + open + '" aria-controls="vec-' + esc(r.id) + '">' +
            '<span class="mname">' + nameHtml(r) + '</span>' +
            '<span class="mmeta">' + frontPill(r) + '<span>' + esc(familyLabel(r)) + '</span></span></button></div></td>' +
            keys.map(function (kk) { var c = cellValue(r, kk); return '<td class="num ' + c.cls + (kk === k ? ' sorted' : '') + '">' + c.html + '</td>'; }).join('') + '</tr>' +
            (open ? '<tr class="detail" id="vec-' + esc(r.id) + '"><td colspan="' + (keys.length + 2) + '">' + vecHtml(r) + '</td></tr>' : '');
        });
      });
      var tb = $('lb-body');
      tb.innerHTML = body;
      $('lb-head').querySelectorAll('[data-sort]').forEach(function (b) {
        b.addEventListener('click', function () { setSort(b.getAttribute('data-sort'), true); });
      });
      tb.querySelectorAll('tr.row').forEach(function (tr) {
        tr.addEventListener('click', function (e) {
          if (e.target.closest('a')) return;
          var id = tr.getAttribute('data-id');
          openRow(state.open === id ? null : id);
        });
      });
    }
    document.querySelectorAll('[data-chart]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.stopPropagation(); select(b.getAttribute('data-chart'), { scroll: true }); });
    });
  }
  function setSort(key, toggle) {
    if (toggle && state.sort === key && key !== 'front') state.desc = !state.desc;
    else { state.sort = key; state.desc = true; }
    if (M[key] && GROUPS[state.group].keys.indexOf(key) < 0) {
      state.group = M[key].primary ? 'primary' : M[key].axis;
    }
    renderTable(); writeHash();
  }

  function track(k, pool) {
    var floor = LOG_FLOOR[k] || 1e-3;
    var tf = M[k].scale === 'log' ? function (v) { return Math.log10(Math.max(v, floor)); } : function (v) { return v; };
    var vs = pool.map(function (o) { return tf(val(o, k)); }), lo = Math.min.apply(null, vs), hi = Math.max.apply(null, vs);
    if (hi === lo) hi = lo + 1;
    return function (v) { var t = (tf(v) - lo) / (hi - lo); t = M[k].dir === 'up' ? t : 1 - t; return Math.max(0, Math.min(1, t)); };
  }
  function vecHtml(r) {
    var axes = AXES.map(function (a) {
      return '<div class="vax"><h4>' + a.name + '</h4>' + a.keys.map(function (k) {
        var pool = rows.filter(function (o) { return eligible(o, k) && val(o, k) != null && isFinite(val(o, k)); });
        var sc = track(k, pool), v = val(r, k), rk = ranks[k][r.id];
        var dots = pool.map(function (o) { return o === r ? '' : '<i style="left:' + (sc(val(o, k)) * 100).toFixed(1) + '%"></i>'; }).join('');
        var mine = v != null && isFinite(v) && comparable(r, k) ? '<b style="left:' + (sc(v) * 100).toFixed(1) + '%"></b>' : '';
        var rt = !isRanked(r) ? '' : !comparable(r, k) ? '†' : rk ? ordinal(rk.rank) + ' of ' + rk.of : '';
        return '<div class="vrow"><span class="vrow__k' + (M[k].primary ? ' prim' : '') + '">' + M[k].html + ' ' + arrow(k) + '</span>' +
          '<span class="vrow__rk">' + rt + '</span><span class="vrow__v">' + fmt(r, k) + (comparable(r, k) ? '' : '†') + '</span>' +
          '<span class="track" aria-hidden="true">' + dots + mine + '</span></div>';
      }).join('') + '<div class="track__ends" aria-hidden="true"><span>worse</span><span>better</span></div></div>';
    }).join('');
    var ext = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';
    var links = (r.paper_url ? '<a href="' + esc(r.paper_url) + '" rel="noopener">Paper' + ext + '</a>' : '') +
      (r.code_url ? '<a href="' + esc(r.code_url) + '" rel="noopener">Code' + ext + '</a>' : '') +
      (stars.some(function (s2) { return s2.r === r; }) ? '<button type="button" data-chart="' + esc(r.id) + '">Show in space</button>' : '');
    var notes = [];
    if (r.layer) notes.push(r.layer === 1 ? 'On the Pareto front: no other raw editor is at least as good on all three primary metrics.' : layerName(r.layer) + ': on the front once the layers above it are set aside.');
    if (!r.temporal_comparable) notes.push('† Flicker and Warp come from interpolated frames and are not compared.');
    if (r.kind === 'postprocessed') notes.push('Post-processed output, shown for reference.');
    if (r.kind === 'reference') notes.push('The unedited source video, shown for reference. PSNR outside the mask is infinite.');
    return '<div class="vec"><div class="vec__who"><h3>' + esc(r.method) + '</h3><p>' + esc(familyLabel(r)) + '</p>' +
      (r.organization ? '<p>' + esc(r.organization) + '</p>' : '') + '<p>Added ' + esc(r.added || '–') + '</p>' +
      '<div class="vec__links">' + links + '</div>' + notes.map(function (n) { return '<p class="vec__note">' + n + '</p>'; }).join('') +
      '</div><div class="vec__axes">' + axes + '</div></div>';
  }
  function openRow(id, scroll) {
    state.open = id;
    if (id && !isRanked(byId[id]) && !state.ref) { state.ref = true; $('show-ref').checked = true; }
    renderTable(); writeHash();
    if (scroll && id) {
      var el = document.querySelector('[data-id="' + CSS.escape(id) + '"]:not([hidden])');
      if (el) el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
    }
  }
  function initControls() {
    document.querySelectorAll('.tabs [data-group]').forEach(function (b) {
      b.addEventListener('click', function () { state.group = b.getAttribute('data-group'); renderTable(); writeHash(); });
    });
    var sel = $('sort-sel');
    AXES.forEach(function (a) {
      var og = document.createElement('optgroup'); og.label = a.name;
      a.keys.forEach(function (k) { var o = document.createElement('option'); o.value = k; o.textContent = M[k].text + ' ' + arrow(k) + (M[k].primary ? '  (primary)' : ''); og.appendChild(o); });
      sel.appendChild(og);
    });
    var om = document.createElement('option'); om.value = 'method'; om.textContent = 'Method name'; sel.appendChild(om);
    sel.addEventListener('change', function () { setSort(sel.value, false); });
    $('order-btn').addEventListener('click', function () { state.desc = !state.desc; renderTable(); writeHash(); });
    var cb = $('show-ref');
    cb.checked = state.ref;
    cb.addEventListener('change', function () { state.ref = cb.checked; renderTable(); writeHash(); });
    var wasCompact = compact();
    window.addEventListener('resize', function () { if (compact() !== wasCompact) { wasCompact = compact(); renderTable(); } });
  }

  // ---------- Theme + citation ----------
  function initTheme() {
    var btn = $('theme-toggle');
    function label() {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      btn.title = dark ? 'Light theme' : 'Dark theme';
    }
    label();
    btn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('vtx-theme', next); } catch (e) {}
      label(); readColors(); draw();
    });
  }
  function initCite() {
    var b = $('copy-bib');
    b.addEventListener('click', function () {
      var done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy BibTeX'; }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText($('bib').textContent).then(done, function () { b.textContent = 'Select and copy'; });
    });
  }

  // ---------- Boot ----------
  function boot() {
    ViTeXLeaderboard.load('data/submissions.jsonl').then(function (data) {
      rows = data;
      rows.forEach(function (r) { r.id = slug(r.method); byId[r.id] = r; });
      computeRanks();
      if (state.sel && !byId[state.sel]) state.sel = null;
      if (state.open && !byId[state.open]) state.open = null;
      $('status').hidden = true;
      readColors(); buildStars(); layoutSize();
      initInteraction(); initControls();
      goTo(state.view, true);
      renderCard(); renderLeaders(); renderTable();
      if (state.open) openRow(state.open, true);
      loop();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
    }).catch(function (err) {
      $('status').textContent = 'The submissions file did not load.';
      $('lb-body').innerHTML = '<tr><td class="lb__empty">The submissions file did not load (' + esc(err && err.message) + '). <a href="data/submissions.jsonl">Open the raw data</a>.</td></tr>';
    });
  }

  readHash();
  initTheme();
  initCite();
  renderAxes();
  boot();
})();
