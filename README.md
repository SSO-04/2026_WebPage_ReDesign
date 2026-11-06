# VISUAL AID — 리뉴얼 웹사이트 (프로토타입)

빌드 도구 없이 HTML / CSS / JS만으로 만든 정적 사이트입니다.

## 실행 방법
- `index.html`을 더블클릭하면 바로 열립니다.
- 폰트(Google Fonts) 로드를 위해 인터넷 연결이 필요합니다.
- 서버로 열고 싶다면 이 폴더에서 `python3 -m http.server 8000` 후 http://localhost:8000
- 호스팅은 이 폴더 전체를 Netlify / Vercel / GitHub Pages / 일반 웹호스팅에 그대로 올리면 됩니다.

## 작동하는 것
- 메인: 히어로 룩 전환(5개 브랜드), 브랜드 카드 드래그 슬라이드, Shop the Look(룩에 맞는 아이템) 슬라이드
- 카테고리: 카테고리 탭, 브랜드/컬러/사이즈/가격 필터, 정렬, 선택 칩, MORE(12개씩), 에디토리얼 타일
- NØVAN / MÉRIA 브랜드 페이지: 핫스팟 → 아이템 이동, 제품 탭, VIEW ALL, 다음 브랜드
- 공통: 상품 퀵뷰(사이즈 선택), 장바구니(수량 변경/삭제, 새로고침해도 유지), 검색
- SILT / VÉRASE / FLORÉNNE: 상세 페이지는 "준비 중", 상품은 카테고리에서 확인 가능
- 결제는 연결되어 있지 않습니다(CHECKOUT은 프로토타입 안내만 표시).

## 이미지 교체
이미지 칸은 파일을 넣으면 자동으로 채워집니다(코드 수정 불필요). `.jpg` / `.png` / `.webp` 지원, 크기는 칸 비율에 맞춰 크롭됩니다.

| 위치 | 파일 이름 (images/ 폴더) |
|---|---|
| 메인 히어로 | `novan_hero_01`, `meria_hero_01`, `silt_hero_01`, `verase_hero_01`, `florenne_hero_01` |
| 브랜드 카드 / 카테고리 타일 | `novan_lookbook_02`, `meria_lookbook_02`, `silt_lookbook_02` … |
| 브랜드 룩북 | `novan_lookbook_01`, `novan_detail_01`, `novan_lookbook_02` / `meria_…` 동일 |
| 매장 | `store_01` |
| 상품 | `products/<상품id>` 예) `products/novan-oversized-wool-coat-charcoal.jpg` |

상품 id 전체 목록은 `assets/js/data.js`의 `VA.products`에서 확인합니다(브랜드-상품명-컬러 소문자 + 하이픈).
이미지 파일이 아직 없는 칸은 브라우저 콘솔에 404가 표시되는데, 정상입니다(파일이 없는지 확인하는 과정).

## 수정 위치
- 색/폰트/간격: `assets/css/site.css` 상단의 브랜드별 `[data-theme]` 변수
- 상품·가격(샘플 값): `assets/js/data.js`
- 메인 히어로 문구/링크: `assets/js/main.js`
- 새 브랜드 페이지를 추가하면 `data.js`의 `page:null`을 파일명으로 바꾸면 링크가 연결됩니다.
