/* VISUAL AID — brand pages: product tabs (3 shown + VIEW ALL), look items, hotspots */
(function () {
  var VA = window.VA, $ = VA.$, $$ = VA.$$;
  var key = document.body.getAttribute('data-brand'), b = VA.brands[key];
  var all = VA.products.filter(function (p) { return p.brand === key; });
  var cat = 'ALL';
  var grid = $('#bprods');

  function render() {
    var list = all.filter(function (p) { return cat === 'ALL' || p.cat === cat; });
    var top = list.slice(0, 3);
    var rest = list.length - top.length;
    var theme = b.theme;
    grid.innerHTML = top.map(function (p) { return VA.card(p); }).join('') +
      '<a class="viewall" href="category.html?brand=' + key + (cat === 'ALL' ? '' : '&cat=' + cat) + '"><span class="lbl">' + rest + ' MORE</span><span class="t12">VIEW ALL ' + b.name + ' →</span></a>';
    $('#bcount').textContent = '(' + top.length + ' / ' + list.length + ')';
    $$('[data-bcat]').forEach(function (t) { t.setAttribute('aria-pressed', t.getAttribute('data-bcat') === cat ? 'true' : 'false'); });
    VA.hydrate(grid);
  }
  $$('[data-bcat]').forEach(function (t) {
    t.addEventListener('click', function () { cat = t.getAttribute('data-bcat'); render(); });
  });

  /* hotspot numbers jump to the matching item and flash it */
  $$('.hs').forEach(function (h) {
    h.addEventListener('click', function () {
      var id = h.getAttribute('href').slice(1), el = document.getElementById(id);
      if (!el) return;
      $$('.li').forEach(function (l) { l.classList.remove('flash'); });
      el.classList.add('flash');
      setTimeout(function () { el.classList.remove('flash'); }, 2400);
    });
  });

  render();
})();
