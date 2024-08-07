import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { FRANCHISE_CAFE_LIST, FILTER_TYPE_LIST, SIGNUP } from "./Constants";

export interface CafeDTO {
  place_name: string;
  distance: string;
  place_url: string;
  category_name: string;
  address_name: string;
  road_address_name: string;
  id: string;
  phone: string;
  category_group_code: string;
  category_group_name: string;
  x: string;
  y: string;
};

export type FRANCHISE_CAFE_TYPE = typeof FRANCHISE_CAFE_LIST[number];

export type FILTER_TYPE = typeof FILTER_TYPE_LIST[number];

export interface User {
  userId: string;
  email: string;
  name: string;
  profileUrl?: string;
}

export interface Review {
  reviewId: string;
  userId: string;
  cafeId: string;
  cafeName: string;
  rating: number;
  comment: string;
  reviewPhotoUrls: string[];
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

export interface ReviewWithUser extends Review {
  userId: string;
  userName: string;
  userProfileUrl?: string;
}

export type SIGNUP_TYPE = typeof SIGNUP[keyof typeof SIGNUP];

export type RegexType = {
  EMAIL: RegExp;
  PASSWORD: RegExp;
  PASSWORD_CHECK?: RegExp;
  NAME: RegExp;
};

export type ImageViewResourceType = { uri: string };