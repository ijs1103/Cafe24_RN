export const url = {
  searchKeyword: 'https://dapi.kakao.com/v2/local/search/keyword.json',
  searchCategory: 'https://dapi.kakao.com/v2/local/search/category.json',
} as const;

export const DELTA = {
  LONGITUDE: 0.015,
  LATITUDE: 0.0121
} as const;