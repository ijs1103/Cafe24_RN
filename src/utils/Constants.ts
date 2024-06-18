const URL = {
  SEARCH_KEYWORD: 'https://dapi.kakao.com/v2/local/search/keyword.json',
  SEARCH_CATEGORY: 'https://dapi.kakao.com/v2/local/search/category.json',
} as const;

const DELTA = {
  LONGITUDE: 0.015,
  LATITUDE: 0.0121
} as const;

const FRANCHISE_CAFE_LIST = ['스타벅스', '이디야', '할리스', '메가커피', '빽다방', '카페베네', '투썸플레이스', '탐앤탐스'] as const;

const FILTER_TYPE_LIST = ['거리 가까운순', '별점 높은순', '리뷰 많은순'] as const;

export {
  URL, DELTA, FRANCHISE_CAFE_LIST, FILTER_TYPE_LIST
};