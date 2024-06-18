import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CafeDTO } from './Types';

const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage, 
  defaultExpires: null,
  enableCache: true,
  sync: {}
});

const LIKED_CAFE_LIST = 'likedCafeList'

const saveCafe = async (cafe: CafeDTO) => {
	try {
    await storage.save({
      key: LIKED_CAFE_LIST,
      id: cafe.id,
      data: cafe,
    });
    console.log('Cafe saved successfully');
  } catch (error) {
    console.error('Failed to save cafe', error);
  }
};

const getCafeList = async (): Promise<CafeDTO[]> => {
  try {
    const cafeList = await storage.getAllDataForKey(LIKED_CAFE_LIST);
    console.log('CafeList loaded successfully', cafeList);
    return cafeList;
  } catch (error) {
    console.error('Failed to load cafeList', error);
    return [];
  }
};

const deleteCafe = async (cafeId: string) => {
  try {
    await storage.remove({
      key: LIKED_CAFE_LIST,
      id: cafeId,
		});
    console.log('Cafe deleted successfully');
  } catch (error) {
    console.error('Failed to delete cafeList', error);
  }
};

export { saveCafe, getCafeList, deleteCafe }