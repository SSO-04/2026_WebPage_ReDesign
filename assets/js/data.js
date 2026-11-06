/* VISUAL AID — catalog data (sample prices; replace with real data later) */
(function () {
  var brands = {
    novan:    { key: 'novan',    name: 'NØVAN',    no: 1, theme: 'novan',    dot: '#3b3b39', concept: 'Quiet Structure',    desc: '도시적 미니멀리즘',          page: 'brand-novan.html' },
    meria:    { key: 'meria',    name: 'MÉRIA',    no: 2, theme: 'meria',    dot: '#a9cde3', concept: 'Everyday Escape',    desc: '여유로운 리조트 무드',        page: 'brand-meria.html' },
    silt:     { key: 'silt',     name: 'SILT',     no: 3, theme: 'silt',     dot: '#56603c', concept: 'Made to Move',       desc: '자연과 기능성의 워크웨어',    page: null },
    verase:   { key: 'verase',   name: 'VÉRASE',   no: 4, theme: 'verase',   dot: '#bde6ff', concept: 'Future After Dark',  desc: '차갑고 실험적인 퓨처리즘',    page: null },
    florenne: { key: 'florenne', name: 'FLORÉNNE', no: 5, theme: 'florenne', dot: '#6f2035', concept: 'Softness as Form',   desc: '꽃을 담은 섬세한 아트웨어',   page: null }
  };

  var COLORS = {
    BLACK: '#1a1a1a', CHARCOAL: '#3b3b39', IVORY: '#eeede9',
    BUTTER: '#faf3e1', SAND: '#ecdcbc', 'SKY BLUE': '#a9cde3',
    MOSS: '#56603c', KHAKI: '#8a8663', BROWN: '#6b5238',
    SILVER: '#c8d0d8', 'ICE BLUE': '#bde6ff',
    'DUSTY PINK': '#d9a6a8', BURGUNDY: '#6f2035', CREAM: '#f8f0ea'
  };

  var CLOTHES = ['XS', 'S', 'M', 'L', 'XL'];
  var ONE = ['ONE SIZE'];

  // order here = "NEWEST" order (first = newest)
  var raw = [
    ['novan',    'Oversized Wool Coat',  'OUTER',       'CHARCOAL',   489000, CLOTHES],
    ['meria',    'Linen Shirt',          'TOP',         'BUTTER',     149000, CLOTHES],
    ['silt',     'Multi-Pocket Jacket',  'OUTER',       'MOSS',       329000, CLOTHES],
    ['verase',   'Cropped Tech Jacket',  'OUTER',       'SILVER',     389000, CLOTHES],
    ['florenne', 'Sheer Blouse',         'TOP',         'DUSTY PINK', 179000, CLOTHES],
    ['novan',    'Wide Slacks',          'BOTTOM',      'BLACK',      189000, CLOTHES],
    ['meria',    'Wrap Skirt',           'BOTTOM',      'SAND',       169000, CLOTHES],
    ['silt',     'Cargo Pants',          'BOTTOM',      'BROWN',      199000, CLOTHES],
    ['verase',   'Mesh Top',             'TOP',         'BLACK',      119000, CLOTHES],
    ['florenne', 'Organza Skirt',        'BOTTOM',      'CREAM',      219000, CLOTHES],
    ['novan',    'Structured Shirt',     'TOP',         'IVORY',      159000, CLOTHES],
    ['meria',    'Long Dress',           'DRESS',       'SAND',       229000, CLOTHES],
    ['silt',     'Work Shirt',           'TOP',         'BROWN',      149000, CLOTHES],
    ['verase',   'Asymmetric Skirt',     'BOTTOM',      'BLACK',      189000, CLOTHES],
    ['florenne', 'Draped Dress',         'DRESS',       'BURGUNDY',   329000, CLOTHES],
    ['novan',    'Boxy Jacket',          'OUTER',       'BLACK',      359000, CLOTHES],
    ['meria',    'Light Knit',           'TOP',         'BUTTER',     139000, CLOTHES],
    ['silt',     'Technical Vest',       'OUTER',       'KHAKI',      189000, CLOTHES],
    ['verase',   'Bodysuit',             'TOP',         'BLACK',      149000, CLOTHES],
    ['florenne', 'Satin Slip Dress',     'DRESS',       'BURGUNDY',   289000, CLOTHES],
    ['novan',    'Oversized Wool Coat',  'OUTER',       'BLACK',      489000, CLOTHES],
    ['meria',    'Light Tote Bag',       'BAG',         'SKY BLUE',   119000, ONE],
    ['silt',     'Nylon Crossbody Bag',  'BAG',         'KHAKI',      139000, ONE],
    ['verase',   'Metal Bag',            'BAG',         'SILVER',     259000, ONE],
    ['florenne', 'Sheer Overshirt',      'OUTER',       'CREAM',      199000, CLOTHES],
    ['novan',    'Leather Shoes',        'SHOES',       'BLACK',      279000, ['250', '260', '270', '280']],
    ['meria',    'Ribbed Swimsuit',      'SWIMWEAR',    'SKY BLUE',   129000, CLOTHES],
    ['silt',     'Canvas Cap',           'HEADWEAR',    'BROWN',       69000, ONE],
    ['verase',   'Chunky Silver Ring',   'ACCESSORIES', 'SILVER',      99000, ['S', 'M', 'L']],
    ['florenne', 'Flower Motif Necklace','ACCESSORIES', 'BURGUNDY',   129000, ONE],
    ['novan',    'Structured Shirt',     'TOP',         'BLACK',      159000, CLOTHES],
    ['meria',    'Linen Shirt',          'TOP',         'SAND',       149000, CLOTHES],
    ['silt',     'Multi-Pocket Jacket',  'OUTER',       'KHAKI',      329000, CLOTHES],
    ['verase',   'Cropped Tech Jacket',  'OUTER',       'BLACK',      389000, CLOTHES],
    ['florenne', 'Sheer Blouse',         'TOP',         'CREAM',      179000, CLOTHES],
    ['novan',    'Wide Slacks',          'BOTTOM',      'CHARCOAL',   189000, CLOTHES],
    ['meria',    'Wrap Skirt',           'BOTTOM',      'SKY BLUE',   169000, CLOTHES],
    ['silt',     'Cargo Pants',          'BOTTOM',      'MOSS',       199000, CLOTHES],
    ['verase',   'Mesh Top',             'TOP',         'ICE BLUE',   119000, CLOTHES],
    ['florenne', 'Organza Skirt',        'BOTTOM',      'DUSTY PINK', 219000, CLOTHES],
    ['novan',    'Boxy Jacket',          'OUTER',       'CHARCOAL',   359000, CLOTHES],
    ['meria',    'Light Knit',           'TOP',         'SKY BLUE',   139000, CLOTHES],
    ['silt',     'Work Shirt',           'TOP',         'MOSS',       149000, CLOTHES],
    ['verase',   'Asymmetric Skirt',     'BOTTOM',      'SILVER',     189000, CLOTHES],
    ['florenne', 'Draped Dress',         'DRESS',       'DUSTY PINK', 329000, CLOTHES],
    ['novan',    'Gabardine Trousers',   'BOTTOM',      'IVORY',      209000, CLOTHES],
    ['meria',    'Long Dress',           'DRESS',       'BUTTER',     229000, CLOTHES],
    ['florenne', 'Flower Motif Earrings','ACCESSORIES', 'DUSTY PINK',  89000, ONE]
  ];

  function slug(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  var products = raw.map(function (r, i) {
    var title = r[1] + ' — ' + r[3].toLowerCase().replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    return {
      id: r[0] + '-' + slug(r[1]) + '-' + slug(r[3]),
      brand: r[0],
      base: r[1],
      name: title,
      cat: r[2],
      color: r[3],
      hex: COLORS[r[3]],
      price: r[4],
      sizes: r[5],
      isNew: i < 2,
      rank: i
    };
  });

  window.VA = window.VA || {};
  window.VA.brands = brands;
  window.VA.colors = COLORS;
  window.VA.products = products;
  window.VA.byId = {};
  products.forEach(function (p) { window.VA.byId[p.id] = p; });
})();
