import {URL} from './Constants';
import {CafeDTO} from './Types';
import { KAKAO_API_KEY } from '@env';

export const getCafeListFromLatLng = (
  latitude: number,
  longitude: number,
): Promise<[CafeDTO] | null> => {
  return fetch(
    `${URL.SEARCH_CATEGORY}?category_group_code=CE7&radius=500&x=${longitude}&y=${latitude}`,
    {
      method: 'GET',
      headers: {
        Authorization: `KakaoAK ${KAKAO_API_KEY}`,
      },
    },
  )
    .then(result => result.json())
    .then(result => {
      if (result.meta.total_count === 0 || result.documents.length === 0) {
        return null;
      }
      return result.documents;
    });
};

export const getCafeListFromKeyword = (
  keyword: string,
  latitude: number,
  longitude: number,
): Promise<[CafeDTO] | null> => {
  return fetch(
    `${URL.SEARCH_KEYWORD}?category_group_code=CE7&radius=2000&x=${longitude}&y=${latitude}&query=${keyword}`,
    {
      method: 'GET',
      headers: {
        Authorization: `KakaoAK ${KAKAO_API_KEY}`,
      },
    },
  )
    .then(result => result.json())
    .then(result => {
      if (result.meta.total_count === 0 || result.documents.length === 0) {
        return null;
      }

      return result.documents.sort((a: CafeDTO, b: CafeDTO) => { return parseFloat(a.distance) - parseFloat(b.distance) })
    });
};
