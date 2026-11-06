/* VISUAL AID — main page: hero look switching + Shop the Look strip */
(function () {
  var VA = window.VA;
  var HERO = [
    { key: 'novan', file: 'novan_hero_01', fileLbl: 'NOVAN_HERO_01', title: 'Form Before Decoration',
      desc: '비례와 구조, 절제로 완성한 도시적 미니멀리즘을 룩북으로 먼저 만나보세요.',
      note: 'NØVAN LOOK 01 — 콘크리트 계단, 직선 구도, 낮은 채도. 모델은 오른쪽, 왼쪽 40%는 텍스트 여백.',
      href: 'brand-novan.html#lookbook', cta: 'VIEW LOOKBOOK →' },
    { key: 'meria', file: 'meria_hero_01', fileLbl: 'MERIA_HERO_01', title: 'Somewhere Between City and Summer',
      desc: '도시의 일상에 휴양지의 느슨한 감각을 더한 룩을 만나보세요.',
      note: 'MÉRIA LOOK 01 — 테라스 입구, 낮은 의자에 앉은 모델, 따뜻한 자연광. 오른쪽 35%는 햇빛이 비치는 벽과 커튼.',
      href: 'brand-meria.html#lookbook', cta: 'VIEW LOOKBOOK →' },
    { key: 'silt', file: 'silt_hero_01', fileLbl: 'SILT_HERO_01', title: 'Clothing Between Nature and Utility',
      desc: '자연의 색과 기능성이 만나는 워크웨어 룩을 만나보세요.',
      note: 'SILT LOOK 01 — 채석장 가장자리, 캔버스와 돌의 질감, 흐린 날 확산광. 왼쪽 35%는 돌벽 여백.',
      href: '#brands', cta: 'SEE ALL BRANDS ↓' },
    { key: 'verase', file: 'verase_hero_01', fileLbl: 'VERASE_HERO_01', title: 'Designed for the Artificial Night',
      desc: '직접 플래시와 금속 반사가 만드는 차가운 밤의 룩을 만나보세요.',
      note: 'VÉRASE LOOK 01 — 크롬 기둥과 유리 패널, 직접 플래시, 아이스 블루 조명. 오른쪽 40%는 어두운 유리 벽.',
      href: '#brands', cta: 'SEE ALL BRANDS ↓' },
    { key: 'florenne', file: 'florenne_hero_01', fileLbl: 'FLORENNE_HERO_01', title: 'Studies of Fragile Things',
      desc: '꽃잎의 겹침과 투명도를 옷으로 옮긴 룩을 만나보세요.',
      note: 'FLORÉNNE LOOK 01 — 크림 스튜디오, 버건디 꽃 한 송이, 시어 소재의 겹침. 왼쪽 35%는 크림 여백.',
      href: '#brands', cta: 'SEE ALL BRANDS ↓' }
  ];

  var hero = VA.$('#hero');
  var tabs = VA.$$('[data-hero]');
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function setHero(i) {
    var h = HERO[i], b = VA.brands[h.key];
    hero.setAttribute('data-theme', b.theme);
    hero.classList.remove('has-img');
    hero.style.backgroundImage = '';
    hero.__slot = false;
    hero.setAttribute('data-img', 'images/' + h.file);
    VA.$('#hero-title').textContent = h.title;
    VA.$('#hero-label').textContent = 'LOOKBOOK ' + pad(i + 1) + ' / 05 — ' + b.name;
    VA.$('#hero-desc').textContent = h.desc;
    VA.$('#hero-note').textContent = h.note;
    VA.$('#hero-file').textContent = '01 · HERO VISUAL · 16:9 · ' + h.fileLbl;
    VA.$('#hero-count').textContent = pad(i + 1) + ' / 05';
    var cta = VA.$('#hero-cta');
    cta.setAttribute('href', h.href);
    cta.textContent = h.cta;
    tabs.forEach(function (t, k) { t.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    VA.hydrate(hero.parentNode);
  }
  tabs.forEach(function (t, i) { t.addEventListener('click', function () { setHero(i); }); });

  /* Shop the Look strip */
  var LOOK = [
    ['novan-structured-shirt-ivory', '01'], ['novan-oversized-wool-coat-charcoal', '02'], ['novan-wide-slacks-black', '03'],
    ['meria-linen-shirt-butter', '01'], ['meria-wrap-skirt-sand', '02'], ['meria-light-tote-bag-sky-blue', '03']
  ];
  var strip = VA.$('#look-strip');
  strip.innerHTML = LOOK.map(function (l, i) {
    var p = VA.byId[l[0]];
    return VA.card(Object.assign({}, p, { isNew: i === 0 || i === 3 }), { no: l[1] });
  }).join('');
  VA.hydrate(strip);
  VA.slider(strip);

  hero.setAttribute('data-img', 'images/novan_hero_01');
})();
