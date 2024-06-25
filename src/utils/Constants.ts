import { RegexType } from "./Types";

const URL = {
  SEARCH_KEYWORD: 'https://dapi.kakao.com/v2/local/search/keyword.json',
  SEARCH_CATEGORY: 'https://dapi.kakao.com/v2/local/search/category.json',
  PRIVACY_POLICY: 'https://plum-puppet-fa1.notion.site/24-6cbb13ead22240bbba8a5735df2e93a6'
} as const;

const DELTA = {
  LONGITUDE: 0.015,
  LATITUDE: 0.0121
} as const;

const FRANCHISE_CAFE_LIST = ['스타벅스', '이디야', '할리스', '메가커피', '빽다방', '카페베네', '투썸플레이스', '탐앤탐스'] as const;

const FILTER_TYPE_LIST = ['거리 가까운순', '별점 높은순', '리뷰 많은순'] as const;

const COLLECTIONS = {
  USERS: 'users',
  REVIEWS: 'reviews'
} as const;

const SIGNUP = {
  EMAIL_PASSWORD: 'EMAIL_PASSWORD',
  GOOGLE: 'GOOGLE'
} as const;

const REGEX: RegexType = {
  EMAIL: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  PASSWORD: /^[a-zA-Z0-9]{8,16}$/,
  NAME: /^[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]{1,12}$/,
} as const;

const FORM_ERROR_MESSAGE = {
  EMAIL: '올바른 이메일 패턴이 아닙니다.',
  PASSWORD: '8~16자 영문 대소문자, 숫자를 사용하세요.',
  NAME: '이름은 최대 12자까지 입력.',
  REQUIRED: '해당란을 입력해주세요.',
  PASSWORD_CHECK: '비밀번호가 일치하지 않습니다.',
} as const;

const INPUT_LABEL = {
  EMAIL: '이메일',
  PASSWORD: '비밀번호',
  NAME: '이름',
  PASSWORD_CHECK: '비밀번호 확인'
} as const;

export {
  URL, DELTA, FRANCHISE_CAFE_LIST, FILTER_TYPE_LIST, COLLECTIONS, SIGNUP, REGEX, FORM_ERROR_MESSAGE, INPUT_LABEL
};