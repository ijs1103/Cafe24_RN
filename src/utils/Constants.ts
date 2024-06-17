const url = {
  searchKeyword: 'https://dapi.kakao.com/v2/local/search/keyword.json',
  searchCategory: 'https://dapi.kakao.com/v2/local/search/category.json',
} as const;

const DELTA = {
  LONGITUDE: 0.015,
  LATITUDE: 0.0121
} as const;

const FRANCHISE_CAFE_LIST = ['스타벅스', '이디야', '할리스', '메가커피', '빽다방', '카페베네', '투썸플레이스', '탐앤탐스'] as const;

export {
  url, DELTA, FRANCHISE_CAFE_LIST
};