import {
	Camera,
	CameraResultType,
	CameraSource,
	Photo,
} from "@capacitor/camera";
import { useEffect } from "react";

const CameraScreen = ({ capturedPhoto, setCapturedPhoto }) => {
	async function addNewToGallery() {
		// Take a photo
		const capturedPhoto = await Camera.getPhoto({
			resultType: CameraResultType.Uri,
			source: CameraSource.Camera,
			quality: 100,
		}).then(photo => setCapturedPhoto(photo.webPath));
	}

	// useEffect(() => {
	// 	addNewToGallery();
	// }, []);

	return (
		<>
			<ion-header translucent>
				<ion-toolbar>
					<ion-title>Photo</ion-title>
				</ion-toolbar>
			</ion-header>
			<ion-content fullscreen class="ion-padding">
				<h1>Take a photo to your Food</h1>
				<p>In development ;)</p>
				{capturedPhoto && <img src={capturedPhoto} alt="captured photo" />}
			</ion-content>
		</>
	);
};

export default CameraScreen;
