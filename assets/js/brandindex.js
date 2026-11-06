/* VISUAL AID — brand index: item counts */
(function () {
  var VA = window.VA;
  VA.$$('[data-bn]').forEach(function (el) {
    var k = el.getAttribute('data-bn');
    var n = VA.products.filter(function (p) { return p.brand === k; }).length;
    el.textContent = n + ' ITEMS';
  });
})();
