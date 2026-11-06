/* VISUAL AID — shared behaviour: cart, quick view, search, sliders, image slots */
(function () {
  var VA = window.VA;
  var CART_KEY = 'va_cart_v1';

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function won(n) { return 'KRW ' + Number(n).toLocaleString('ko-KR'); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  VA.esc = esc; VA.won = won; VA.$ = $; VA.$$ = $$;

  /* ---------- image slots ----------
     Any element with data-img="images/name" shows images/name.jpg|png|webp when the file exists.
     Without a file, the tinted placeholder (and its caption) stays. */
  var EXT = ['jpg', 'png', 'webp'];
  function loadSlot(el) {
    var base = el.getAttribute('data-img');
    if (!base || el.__slot) return;
    el.__slot = true;
    (function tryNext(i) {
      if (i >= EXT.length) return;
      var url = base + '.' + EXT[i];
      var img = new Image();
      img.onload = function () {
        el.style.backgroundImage = 'url("' + url + '")';
        el.classList.add('has-img');
      };
      img.onerror = function () { tryNext(i + 1); };
      img.src = url;
    })(0);
  }
  VA.hydrate = function (root) { $$('[data-img]', root).forEach(loadSlot); };

  /* ---------- cart ---------- */
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch (e) { cart = []; }
  if (!Array.isArray(cart)) cart = [];
  cart = cart.filter(function (l) { return VA.byId[l.id]; });
  function saveCart() { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {} }
  function cartCount() { return cart.reduce(function (a, l) { return a + l.qty; }, 0); }
  function cartTotal() { return cart.reduce(function (a, l) { return a + l.qty * VA.byId[l.id].price; }, 0); }
  function syncBadge() { $$('[data-cart-count]').forEach(function (b) { b.textContent = cartCount(); }); }
  VA.addToCart = function (id, size) {
    var f = cart.filter(function (l) { return l.id === id && l.size === size; })[0];
    if (f) f.qty += 1; else cart.push({ id: id, size: size, qty: 1 });
    saveCart(); syncBadge(); renderCart();
  };
  function setQty(i, q) {
    if (q <= 0) cart.splice(i, 1); else cart[i].qty = Math.min(q, 9);
    saveCart(); syncBadge(); renderCart();
  }

  /* ---------- overlays ---------- */
  var lastFocus = null, openKind = null;
  function mount(html) {
    var wrap = document.createElement('div');
    wrap.innerHTML = html;
    var el = wrap.firstElementChild;
    document.body.appendChild(el);
    return el;
  }
  function closeOverlay() {
    $$('.ov').forEach(function (o) { o.remove(); });
    document.body.style.overflow = '';
    openKind = null;
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  }
  function openOverlay(html, kind, focusSel) {
    closeOverlay();
    lastFocus = document.activeElement;
    var el = mount(html);
    openKind = kind;
    document.body.style.overflow = 'hidden';
    el.addEventListener('mousedown', function (e) { if (e.target === el) closeOverlay(); });
    $$('[data-close]', el).forEach(function (b) { b.addEventListener('click', closeOverlay); });
    VA.hydrate(el);
    var f = focusSel && $(focusSel, el);
    if (f) f.focus();
    return el;
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && openKind) closeOverlay(); });

  function toast(msg) {
    var t = mount('<div class="toast" role="status">' + esc(msg) + '</div>');
    setTimeout(function () { t.remove(); }, 2600);
  }
  VA.toast = toast;

  /* ----- cart drawer ----- */
  function openCart() {
    var el = openOverlay(
      '<div class="ov right" data-theme="visualaid"><aside class="panel drawer" role="dialog" aria-modal="true" aria-label="Cart">' +
      '<div class="dh"><span class="t12">CART <span data-cart-count class="badge">' + cartCount() + '</span></span><button class="t12" data-close>CLOSE</button></div>' +
      '<div class="db" id="cart-body"></div><div class="df" id="cart-foot"></div></aside></div>', 'cart', '[data-close]');
    renderCart();
    return el;
  }
  function renderCart() {
    var body = $('#cart-body'), foot = $('#cart-foot');
    if (!body) return;
    if (!cart.length) {
      body.innerHTML = '<div class="empty"><p class="lead muted" style="margin:0 auto">장바구니가 비어 있습니다.</p></div>';
      foot.innerHTML = '<a class="btn" href="category.html">CONTINUE SHOPPING</a>';
      return;
    }
    body.innerHTML = cart.map(function (l, i) {
      var p = VA.byId[l.id];
      return '<div class="citem"><div class="th" data-img="images/products/' + p.id + '"></div><div class="tx">' +
        '<span class="lbl">' + esc(VA.brands[p.brand].name) + '</span>' +
        '<span style="font-size:12px;line-height:18px">' + esc(p.name) + '</span>' +
        '<span class="cap">SIZE ' + esc(l.size) + ' · ' + won(p.price) + '</span>' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">' +
        '<div class="qty"><button data-q="' + i + '" data-d="-1" aria-label="Decrease">−</button><span>' + l.qty + '</span><button data-q="' + i + '" data-d="1" aria-label="Increase">+</button></div>' +
        '<button class="t12 muted" data-rm="' + i + '">REMOVE</button></div></div></div>';
    }).join('');
    foot.innerHTML = '<div class="sumrow"><span class="t12">SUBTOTAL</span><span>' + won(cartTotal()) + '</span></div>' +
      '<button class="btn btn-solid" id="checkout">CHECKOUT</button>' +
      '<span class="cap">프로토타입이라 실제 결제는 연결되어 있지 않습니다.</span>';
    VA.hydrate(body);
    $$('[data-q]', body).forEach(function (b) {
      b.addEventListener('click', function () {
        var i = +b.getAttribute('data-q'); setQty(i, cart[i].qty + (+b.getAttribute('data-d')));
      });
    });
    $$('[data-rm]', body).forEach(function (b) {
      b.addEventListener('click', function () { setQty(+b.getAttribute('data-rm'), 0); });
    });
    $('#checkout').addEventListener('click', function () { toast('결제 연동 전 단계입니다. 주문서 화면은 아직 없습니다.'); });
  }

  /* ----- quick view ----- */
  VA.openQuick = function (id) {
    var p = VA.byId[id]; if (!p) return;
    var b = VA.brands[p.brand];
    var chosen = p.sizes.length === 1 ? p.sizes[0] : null;
    var el = openOverlay(
      '<div class="ov center" data-theme="visualaid"><div class="panel qv" role="dialog" aria-modal="true" aria-label="' + esc(p.name) + '">' +
      '<div class="ph r34" data-img="images/products/' + p.id + '"><span class="t">PRODUCT · 3:4</span></div>' +
      '<div class="info"><div class="top"><button class="t12" data-close>CLOSE</button></div>' +
      '<div style="display:flex;flex-direction:column;gap:8px"><span class="lbl">' + esc(b.name) + (p.isNew ? ' &nbsp;<span class="new"><i></i>NEW</span>' : '') + '</span>' +
      '<h2 class="h2" style="font-size:24px;line-height:32px">' + esc(p.name) + '</h2>' +
      '<span>' + won(p.price) + '</span></div>' +
      '<div style="display:flex;align-items:center;gap:8px"><span style="width:16px;height:16px;border-radius:999px;border:1px solid var(--line-strong);background:' + p.hex + '"></span><span class="t12">' + esc(p.color) + '</span></div>' +
      '<div style="display:flex;flex-direction:column;gap:10px"><span class="lbl">SIZE</span><div class="sizes" id="qv-sizes">' +
      p.sizes.map(function (s) { return '<button data-size="' + esc(s) + '" aria-pressed="' + (s === chosen) + '">' + esc(s) + '</button>'; }).join('') + '</div></div>' +
      '<button class="btn btn-solid" id="qv-add"' + (chosen ? '' : ' disabled') + '>' + (chosen ? 'ADD TO CART' : 'SELECT SIZE') + '</button>' +
      (b.page ? '<a class="tlink" href="' + b.page + '">VIEW ' + esc(b.name) + ' →</a>' : '<span class="cap">' + esc(b.name) + ' 상세 페이지 준비 중</span>') +
      '</div></div></div>', 'quick', '[data-close]');
    var add = $('#qv-add', el);
    $$('[data-size]', el).forEach(function (btn) {
      btn.addEventListener('click', function () {
        chosen = btn.getAttribute('data-size');
        $$('[data-size]', el).forEach(function (o) { o.setAttribute('aria-pressed', o === btn ? 'true' : 'false'); });
        add.disabled = false; add.textContent = 'ADD TO CART';
      });
    });
    add.addEventListener('click', function () {
      if (!chosen) return;
      VA.addToCart(p.id, chosen);
      closeOverlay(); openCart();
    });
  };

  /* ----- search ----- */
  function openSearch() {
    var el = openOverlay(
      '<div class="ov top" data-theme="visualaid"><div class="panel search" role="dialog" aria-modal="true" aria-label="Search">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span class="lbl">SEARCH</span><button class="t12" data-close>CLOSE</button></div>' +
      '<input id="s-in" type="search" placeholder="브랜드, 상품명, 색상" autocomplete="off" aria-label="Search products">' +
      '<div class="sres" id="s-res"></div></div></div>', 'search', '#s-in');
    var input = $('#s-in', el), res = $('#s-res', el);
    function draw() {
      var q = input.value.trim().toLowerCase();
      if (!q) {
        res.innerHTML = '<div class="lbl" style="padding:16px 0">BRANDS</div>' + Object.keys(VA.brands).map(function (k) {
          var b = VA.brands[k];
          return (b.page ? '<a href="' + b.page + '"' : '<a href="category.html?brand=' + k + '"') + ' class="t12" style="padding:12px 0;border-bottom:1px solid var(--line);display:block">' + esc(b.name) + ' <span class="muted" style="font-weight:400"> — ' + esc(b.concept) + '</span></a>';
        }).join('');
        return;
      }
      var list = VA.products.filter(function (p) {
        return (p.name + ' ' + VA.brands[p.brand].name + ' ' + p.cat + ' ' + p.color).toLowerCase().indexOf(q) > -1;
      });
      res.innerHTML = list.length ? list.slice(0, 8).map(function (p) {
        return '<button data-pid="' + p.id + '"><div class="th" data-img="images/products/' + p.id + '"></div><div style="display:flex;flex-direction:column;gap:2px"><span class="lbl">' + esc(VA.brands[p.brand].name) + '</span><span style="font-size:13px">' + esc(p.name) + '</span><span class="cap">' + won(p.price) + '</span></div></button>';
      }).join('') + (list.length > 8 ? '<a class="tlink" href="category.html">+' + (list.length - 8) + ' MORE — VIEW ALL →</a>' : '')
        : '<p class="muted" style="margin:24px 0">검색 결과가 없습니다.</p>';
      VA.hydrate(res);
    }
    input.addEventListener('input', draw);
    res.addEventListener('click', function (e) {
      var b = e.target.closest('[data-pid]'); if (b) VA.openQuick(b.getAttribute('data-pid'));
    });
    draw();
  }

  /* ---------- product card ---------- */
  VA.card = function (p, o) {
    o = o || {};
    var tint = o.theme ? ' data-theme="' + o.theme + '"' : '';
    var nm = VA.brands[p.brand].name;
    return '<button class="prod" data-pid="' + p.id + '"' + tint + '>' +
      '<div class="ph r34" data-img="images/products/' + p.id + '"><span class="t">PRODUCT · 3:4</span></div>' +
      '<div class="info"><div class="bl"><span class="lbl">' + (o.no ? o.no + ' · ' : '') + esc(nm) + '</span>' +
      (p.isNew ? '<span class="new"><i></i>NEW</span>' : '') + '</div>' +
      '<span class="nm">' + esc(p.name) + '</span><span class="pr">' + won(p.price) + '</span></div></button>';
  };

  /* ---------- drag / swipe slider ---------- */
  VA.slider = function (el) {
    if (!el || el.__drag) return; el.__drag = true;
    var sx = 0, sl = 0, down = false, moved = false;
    el.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      down = true; moved = false; sx = e.clientX; sl = el.scrollLeft;
    });
    window.addEventListener('mousemove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (Math.abs(dx) > 5) { moved = true; el.classList.add('drag'); }
      if (moved) el.scrollLeft = sl - dx;
    });
    window.addEventListener('mouseup', function () { down = false; el.classList.remove('drag'); });
    el.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
    }, true);
    el.addEventListener('dragstart', function (e) { e.preventDefault(); });
  };

  /* ---------- wiring ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-pid]');
    if (t && !t.closest('.ov')) { VA.openQuick(t.getAttribute('data-pid')); return; }
    var o = e.target.closest('[data-open]');
    if (o) {
      var k = o.getAttribute('data-open');
      if (k === 'cart') openCart(); else if (k === 'search') openSearch();
    }
    var s = e.target.closest('[data-soon]');
    if (s) { e.preventDefault(); toast(s.getAttribute('data-soon')); }
  });
  document.addEventListener('DOMContentLoaded', function () {
    syncBadge();
    VA.hydrate(document);
    $$('.hscroll').forEach(VA.slider);
  });
})();
