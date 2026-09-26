/* ViTeX-Bench leaderboard: load submissions.jsonl, mark the Pareto set on the
 * three primary metrics, and render a sortable table. Shared by the
 * leaderboard page and the project homepage. */
var ViTeXLeaderboard = (function () {
  var DIGITS = {
    SeqAcc: 3, CharAcc: 3, TTS: 3,
    Flicker_full: 2, Flicker_crop: 2, Warp_full: 2, Warp_crop: 2,
    MUSIQ_full: 2, MUSIQ_crop: 2,
    PSNR_loc: 2, SSIM_loc: 3, LPIPS_loc: 3, DreamSim_loc: 3
  };
  var TEMPORAL = ['Flicker_full', 'Flicker_crop', 'Warp_full', 'Warp_crop'];

  function load(url) {
    return fetch(url, { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
      .then(function (text) {
        var rows = text.split('\n').filter(function (l) { return l.trim(); })
          .map(function (l) { return JSON.parse(l); });
        markPareto(rows);
        return rows;
      });
  }

  // A raw editor is on the front unless another raw editor is at least as good
  // on SeqAcc (higher), Warp_crop (lower), DreamSim_loc (lower) and strictly
  // better on one. Reference/post-processed rows and editors without comparable
  // temporal scores are not eligible.
  function markPareto(rows) {
    var pool = rows.filter(function (r) { return r.kind === 'editor' && r.temporal_comparable; });
    rows.forEach(function (r) {
      if (pool.indexOf(r) < 0) { r.pareto = null; return; }
      r.pareto = !pool.some(function (o) {
        if (o === r) return false;
        var ge = o.SeqAcc >= r.SeqAcc && o.Warp_crop <= r.Warp_crop && o.DreamSim_loc <= r.DreamSim_loc;
        var gt = o.SeqAcc > r.SeqAcc || o.Warp_crop < r.Warp_crop || o.DreamSim_loc < r.DreamSim_loc;
        return ge && gt;
      });
    });
  }

  function cell(r, k) {
    if (k === 'method') {
      var name = r.method + (r.temporal_comparable ? '' : ' †');
      return r.code_url ? '<a href="' + r.code_url + '">' + name + '</a>' : name;
    }
    if (k === 'family') return r.kind === 'reference' ? 'reference' : (r.family || '').split(' ')[0];
    if (k === 'pareto') return r.pareto === null ? '—' : (r.pareto ? '✓' : '');
    var v = r[k];
    if (k === 'PSNR_loc' && r.kind === 'reference') return '∞';
    if (v === null || v === undefined) return '—';
    var s = Number(v).toFixed(DIGITS[k]).replace(/^-(0\.0+)$/, '$1');
    return (!r.temporal_comparable && TEMPORAL.indexOf(k) >= 0) ? s + '†' : s;
  }

  function sortValue(r, k, dir) {
    if (k === 'pareto') return r.pareto ? 1 : 0;
    if (k === 'method' || k === 'family') return null;
    var v = r[k];
    if (k === 'PSNR_loc' && r.kind === 'reference') v = Infinity;
    if (v === null || v === undefined) return -Infinity;
    return dir === 'down' ? -v : v;
  }

  // Unranked rows (reference / post-processed) always sink below ranked ones.
  function sortRows(rows, k, dir) {
    return rows.slice().sort(function (a, b) {
      var ua = a.kind !== 'editor', ub = b.kind !== 'editor';
      if (ua !== ub) return ua ? 1 : -1;
      if (k === 'method' || k === 'family') return String(a[k]).localeCompare(String(b[k]));
      return sortValue(b, k, dir) - sortValue(a, k, dir);
    });
  }

  function render(table, rows, opts) {
    opts = opts || {};
    var heads = Array.prototype.slice.call(table.querySelectorAll('thead th[data-k]'));
    var keys = heads.map(function (th) { return th.getAttribute('data-k'); });
    var tbody = table.querySelector('tbody');
    function draw(k, dir) {
      tbody.innerHTML = sortRows(rows, k, dir).map(function (r) {
        var cls = r.kind === 'editor' ? '' : ' class="ref"';
        return '<tr' + cls + '>' + keys.map(function (key) {
          var left = key === 'method' || key === 'family';
          return '<td' + (left ? ' class="left"' : '') + '>' + cell(r, key) + '</td>';
        }).join('') + '</tr>';
      }).join('');
    }
    heads.forEach(function (th) {
      th.addEventListener('click', function () {
        draw(th.getAttribute('data-k'), th.getAttribute('data-dir'));
      });
    });
    draw(opts.sortKey || 'SeqAcc', 'up');
  }

  return { load: load, render: render, markPareto: markPareto };
})();
