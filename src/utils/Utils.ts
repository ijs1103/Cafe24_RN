import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { useCallback } from "react";
const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];  

const formatTimestamp = useCallback((timestamp: FirebaseFirestoreTypes.Timestamp): string => {
	const date = timestamp.toDate();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const dayOfWeek = daysOfWeek[date.getDay()];
  return `${month}.${day}.${dayOfWeek}`;
}, []);

export { formatTimestamp };