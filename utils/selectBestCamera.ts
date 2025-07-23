// Utility to robustly detect 'facing back' cameras
const BACK_CAMERA_REGEX = /back|rear|trás|arrière|traseira|traseiro/i;

export async function getBackCameras(): Promise<MediaDeviceInfo[]> {
	const devices = await navigator.mediaDevices.enumerateDevices();
	const videoDevices = devices.filter((d) => d.kind === 'videoinput');
	// Robustly match 'facing back' cameras
	const backCameras = videoDevices.filter((d) =>
		BACK_CAMERA_REGEX.test(d.label),
	);
	// Fallback: if no back cameras, return all video devices
	return backCameras.length > 0 ? backCameras : videoDevices;
}

export async function getBackCameraDeviceIdByIndex(
	index: number,
	onDebug?: (msg: string) => void,
): Promise<string | undefined> {
	const backCameras = await getBackCameras();
	if (onDebug)
		onDebug(
			`Available back cameras: ${backCameras.map((d) => d.label).join(', ')}`,
		);
	if (backCameras.length === 0) {
		if (onDebug) onDebug('No video input devices found');
		return undefined;
	}
	// Loop index if out of range
	const safeIndex =
		((index % backCameras.length) + backCameras.length) % backCameras.length;
	const selected = backCameras[safeIndex];
	if (onDebug) onDebug(`Selected camera: ${selected.label}`);
	return selected.deviceId;
}
