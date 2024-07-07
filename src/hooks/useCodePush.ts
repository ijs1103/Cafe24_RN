import { useCallback, useEffect, useState } from "react";
import CodePush, { DownloadProgress } from "react-native-code-push";

export const useCodePush = () => {
	const [progress, setProgress] = useState<DownloadProgress>();
	const [hasAppUpdate, setHasAppUpdate] = useState(false);

	const checkUpdate = useCallback(async() => {
		let packageToUpdate = await CodePush.checkForUpdate()
		setHasAppUpdate(Boolean(packageToUpdate))
	}, []);

	const proceedUpdating = useCallback(async () => {
		try {
			await CodePush.sync({ 
				installMode: CodePush.InstallMode.IMMEDIATE
			 }, undefined, (progress) => {
				setProgress(progress)
			 })
		} finally {
			setHasAppUpdate(false);
		}
	}, []);

	useEffect(() => {
		checkUpdate();
	}, []);

	return {
		progress,
		hasAppUpdate,
		proceedUpdating
	}
};