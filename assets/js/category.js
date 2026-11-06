/* VISUAL AID — category page: tabs, filters, sort, editorial tiles, load more */
(function () {
  var VA = window.VA, $ = VA.$, $$ = VA.$$, esc = VA.esc;
  var PAGE = 12;
  var PRICES = [
    ['UNDER 100,000', 0, 100000], ['100,000 – 200,000', 100000, 200000],
    ['200,000 – 300,000', 200000, 300000], ['OVER 300,000', 300000, Infinity]
  ];
  var SIZES = ['XS', 'S', 'M', 'L', 'XL', 'ONE SIZE'];
  var SORTS = [['newest', 'NEWEST'], ['low', 'PRICE LOW → HIGH'], ['high', 'PRICE HIGH → LOW']];
  var TILES = [
    { brand: 'novan', note: 'NØVAN LOOK 01 — 콘크리트 계단, 직선 구도, 낮은 채도', title: 'NØVAN — Quiet Structure', img: 'images/novan_lookbook_01', file: 'NOVAN_LOOKBOOK_01' },
    { brand: 'meria', note: 'MÉRIA LOOK 01 — 테라스, 자연광, 바람에 움직이는 린넨', title: 'MÉRIA — Everyday Escape', img: 'images/meria_lookbook_01', file: 'MERIA_LOOKBOOK_01' }
  ];

  var SCOPE = document.body.getAttribute('data-scope') || 'all';
  var CLOTHES = ['OUTER', 'TOP', 'BOTTOM', 'DRESS', 'SWIMWEAR'];
  var S = { cat: 'ALL', brand: [], color: [], size: [], price: [], sort: 'newest', shown: PAGE, open: null };

  /* ----- state from URL ----- */
  (function () {
    var q = new URLSearchParams(location.search);
    var c = (q.get('cat') || '').toUpperCase();
    if (c && (SCOPE !== 'clothing' || CLOTHES.indexOf(c) > -1)) S.cat = c;
    (q.get('brand') || '').split(',').forEach(function (b) { if (VA.brands[b]) S.brand.push(b); });
  })();
  function syncUrl() {
    var q = new URLSearchParams();
    if (S.cat !== 'ALL') q.set('cat', S.cat);
    if (S.brand.length) q.set('brand', S.brand.join(','));
    try { history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : '')); } catch (e) {}
  }

  function toggle(arr, v) { var i = arr.indexOf(v); if (i > -1) arr.splice(i, 1); else arr.push(v); }

  function list() {
    var out = VA.products.filter(function (p) {
      if (SCOPE === 'clothing' && CLOTHES.indexOf(p.cat) < 0) return false;
      if (S.cat !== 'ALL' && p.cat !== S.cat) return false;
      if (S.brand.length && S.brand.indexOf(p.brand) < 0) return false;
      if (S.color.length && S.color.indexOf(p.color) < 0) return false;
      if (S.size.length && !p.sizes.some(function (s) { return S.size.indexOf(s) > -1; })) return false;
      if (S.price.length && !S.price.some(function (i) { return p.price >= PRICES[i][1] && p.price < PRICES[i][2]; })) return false;
      return true;
    });
    if (S.sort === 'low') out.sort(function (a, b) { return a.price - b.price || a.rank - b.rank; });
    if (S.sort === 'high') out.sort(function (a, b) { return b.price - a.price || a.rank - b.rank; });
    return out;
  }

  function tileHTML(k) {
    var allowed = TILES.filter(function (t) { return !S.brand.length || S.brand.indexOf(t.brand) > -1; });
    if (!allowed.length) return '';
    var t = allowed[k % allowed.length], b = VA.brands[t.brand];
    return '<a class="tile" href="' + b.page + '#lookbook" data-theme="' + b.theme + '">' +
      '<div class="ph" data-img="' + t.img + '"><span class="t">EDITORIAL TILE · LOOKBOOK</span><span class="n">' + esc(t.note) + '</span></div>' +
      '<div class="tb"><div class="col"><span class="lbl">EDITORIAL PICK</span><span class="tt disp">' + esc(t.title) + '</span></div><span class="t12">SHOP THE LOOK →</span></div></a>';
  }

  function renderTabs() {
    $$('[data-cat]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-cat') === S.cat ? 'true' : 'false'); });
  }

  function renderChips() {
    var chips = [];
    S.brand.forEach(function (v) { chips.push(['brand', v, VA.brands[v].name]); });
    S.color.forEach(function (v) { chips.push(['color', v, v]); });
    S.size.forEach(function (v) { chips.push(['size', v, 'SIZE ' + v]); });
    S.price.forEach(function (v) { chips.push(['price', v, PRICES[v][0]]); });
    var el = $('#chips');
    el.hidden = !chips.length;
    el.innerHTML = chips.map(function (c) {
      return '<button class="chip" data-chip="' + c[0] + '" data-v="' + esc(c[1]) + '">' + esc(c[2]) + ' ×</button>';
    }).join('') + (chips.length ? '<button class="lbl" id="clear" style="text-decoration:underline">CLEAR ALL</button>' : '');
  }

  function renderPanel() {
    var p = $('#fpanel'), f = S.open;
    $$('[data-f]').forEach(function (b) { b.setAttribute('aria-expanded', b.getAttribute('data-f') === f ? 'true' : 'false'); });
    if (!f) { p.hidden = true; return; }
    var html = '';
    if (f === 'brand') html = Object.keys(VA.brands).map(function (k) {
      return '<button data-opt="brand" data-v="' + k + '" aria-pressed="' + (S.brand.indexOf(k) > -1) + '"><span class="box"></span><span class="sw" style="background:' + VA.brands[k].dot + '"></span>' + esc(VA.brands[k].name) + '</button>';
    }).join('');
    if (f === 'color') html = Object.keys(VA.colors).map(function (c) {
      return '<button data-opt="color" data-v="' + c + '" aria-pressed="' + (S.color.indexOf(c) > -1) + '"><span class="sw" style="background:' + VA.colors[c] + '"></span>' + c + '</button>';
    }).join('');
    if (f === 'size') html = SIZES.map(function (s) {
      return '<button data-opt="size" data-v="' + s + '" aria-pressed="' + (S.size.indexOf(s) > -1) + '"><span class="box"></span>' + s + '</button>';
    }).join('');
    if (f === 'price') html = PRICES.map(function (r, i) {
      return '<button data-opt="price" data-v="' + i + '" aria-pressed="' + (S.price.indexOf(i) > -1) + '"><span class="box"></span>' + r[0] + '</button>';
    }).join('');
    if (f === 'sort') html = SORTS.map(function (s) {
      return '<button data-opt="sort" data-v="' + s[0] + '" aria-pressed="' + (S.sort === s[0]) + '"><span class="box"></span>' + s[1] + '</button>';
    }).join('');
    p.innerHTML = html; p.hidden = false;
  }

  function render() {
    var all = list(), shown = Math.min(S.shown, all.length), items = all.slice(0, shown), html = '';
    items.forEach(function (p, i) {
      html += VA.card(p);
      var n = i + 1;
      if (n >= 4 && (n - 4) % 8 === 0) html += tileHTML((n - 4) / 8);
    });
    var grid = $('#pgrid');
    grid.innerHTML = html;
    $('#empty').hidden = all.length > 0;
    grid.hidden = !all.length;
    $('#count').textContent = all.length + ' ITEMS';
    $('#more').hidden = shown >= all.length;
    $('#more-n').textContent = shown + ' / ' + all.length;
    $('#more-bar').style.width = (all.length ? shown / all.length * 100 : 0) + '%';
    $('#sort-lbl').textContent = 'SORT · ' + SORTS.filter(function (s) { return s[0] === S.sort; })[0][1] + ' +';
    renderTabs(); renderChips(); renderPanel(); syncUrl();
    VA.hydrate(grid);
  }

  function reset() { S.shown = PAGE; }

  document.addEventListener('click', function (e) {
    var c = e.target.closest('[data-cat]');
    if (c) { S.cat = c.getAttribute('data-cat'); reset(); render(); return; }
    var f = e.target.closest('[data-f]');
    if (f) { var k = f.getAttribute('data-f'); S.open = S.open === k ? null : k; renderPanel(); return; }
    var o = e.target.closest('[data-opt]');
    if (o) {
      var kind = o.getAttribute('data-opt'), v = o.getAttribute('data-v');
      if (kind === 'sort') { S.sort = v; S.open = null; }
      else if (kind === 'price') toggle(S.price, +v);
      else toggle(S[kind], v);
      reset(); render(); return;
    }
    var ch = e.target.closest('[data-chip]');
    if (ch) {
      var ck = ch.getAttribute('data-chip'), cv = ch.getAttribute('data-v');
      toggle(S[ck], ck === 'price' ? +cv : cv); reset(); render(); return;
    }
    if (e.target.closest('#clear')) { S.brand = []; S.color = []; S.size = []; S.price = []; reset(); render(); return; }
    if (e.target.closest('#more-btn')) { S.shown += PAGE; render(); return; }
  });

  render();
})();
