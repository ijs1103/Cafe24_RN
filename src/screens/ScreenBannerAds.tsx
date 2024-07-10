import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
import { ADMOB_BANNER_ID } from '@env';

const adUnitId = __DEV__ ? TestIds.BANNER : ADMOB_BANNER_ID;

export const ScreenBannerAds: React.FC = () => {
  return (
    <BannerAd unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
  );
};