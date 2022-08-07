import CameraScreen from "../tab-screens/CameraScreen";
import FoodsScreen from "../tab-screens/FoodsScreen";
import {
	Camera,
	CameraResultType,
	CameraSource,
	Photo,
} from "@capacitor/camera";
import { useState } from "react";
import MeScreen from "../tab-screens/MeScreen";

export default function Home({ foodData }) {
	const [capturedPhoto, setCapturedPhoto] = useState();
	async function addNewToGallery() {
		Camera.getPhoto({
			resultType: CameraResultType.Uri,
			source: CameraSource.Camera,
			quality: 100,
		}).then((foto) => setCapturedPhoto(foto.webPath));
	}

	return (
		<>
			<ion-tabs>
				<ion-tab-bar slot="bottom">
					<ion-tab-button tab="foods">
						{/* <ion-label>Foods</ion-label> */}
						<ion-icon src="/svg/fruits-icon.svg"></ion-icon>
					</ion-tab-button>

					<ion-tab-button tab="camera" onClick={addNewToGallery}>
						{/* <ion-label>Photo</ion-label> */}
						<ion-icon src="/svg/camera.svg"></ion-icon>
					</ion-tab-button>

					<ion-tab-button tab="me">
						{/* <ion-label>Me</ion-label> */}
						<ion-icon src="/svg/person.svg"></ion-icon>
					</ion-tab-button>
				</ion-tab-bar>

				<ion-tab tab="foods">
					<FoodsScreen foodData={foodData} />
				</ion-tab>

				<ion-tab tab="camera">
					<CameraScreen
						capturedPhoto={capturedPhoto}
						setCapturedPhoto={setCapturedPhoto}
					/>
					{capturedPhoto && (
						<img src={capturedPhoto} alt="captured photo" />
					)}
				</ion-tab>

				<ion-tab tab="me">
					<MeScreen foodData={foodData} />
				</ion-tab>
			</ion-tabs>
				
		</>
	);
}

// SSR FETCH A API ORIGINAL (MAXIMO 200 RESULTADOS)
// export async function getServerSideProps(context) {
// 	const params = {
// 		api_key: "X66ugLvvhHYrDgeiwTuSwPZEJAhupK2WSEEcxvaC",
// 		query: "Mango",
// 		dataType: ["foundation (FNDDS)"],
// 		pagesize: 200,
// 	};
// 	const res = await fetch(
// 		`https://api.nal.usda.gov/fdc/v1/foods/list?api_key=${encodeURIComponent(
// 			"X66ugLvvhHYrDgeiwTuSwPZEJAhupK2WSEEcxvaC"
// 		)}
// 		&dataType=${encodeURIComponent(
// 			params.dataType
// 		)}&pageSize=${encodeURIComponent(params.pagesize)}`
// 	);
// 	const foodData = await res.json();
// 	console.log(foodData);
// 	return { props: { foodData } };
// }

// SSR FETCH A API PROPIA (no funca, muy lento para vercel)
// export async function getServerSideProps(context) {
// 	const res = await fetch("https://nutros.vercel.app/api/foods");
// 	const foodData = await res.json();
// 	console.log(foodData);
// 	return { props: { foodData } };
// }
