import CameraScreen from "../tab-screens/CameraScreen";
import FoodsScreen from "../tab-screens/FoodsScreen";
import { useState } from "react";
import DayScreen from "../tab-screens/DayScreen";
import UserScreen from "../tab-screens/UserScreen";
import Head from "next/head";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import firebaseApp from "../firebase";
export const db = getFirestore(firebaseApp);

export default function Home({ foodData, userData }) {
	const [selectedTab, setSelectedTab] = useState("foods");

	async function getNewFoods() {
		const newFoods = [];
		foodData.forEach((food) => {
			console.log("food: ", food.description);
			console.log(
				"emoji: ",
				e.suggest("eatable " + food.description.split(", ")[0])[0]?.ref
			);
			console.log("");
			console.log("");
			newFoods.push({
				emoji: e.suggest(
					"eatable " + food.description.split(", ")[0]
				)[0]?.ref,
				...food,
			});
		});
		console.log(newFoods);
		return newFoods;
	}

	return (
		<>
			{/* <Head>
				<link rel="canonical" href="https://nutros.vercel.app" />
			</Head> */}

			<ion-tabs id="tabs">
				<ion-tab-bar slot="bottom">
					<ion-tab-button
						tab="foods"
						onClick={() => setSelectedTab("foods")}
					>
						<ion-icon src="/svg/fruits-icon.svg"></ion-icon>
					</ion-tab-button>

					{/* <ion-tab-button
						tab="camera"
						onClick={() => setSelectedTab("camera")}
					>
						<ion-icon src="/svg/camera.svg"></ion-icon>
					</ion-tab-button> */}

					<ion-tab-button
						tab="track"
						onClick={() => setSelectedTab("track")}
					>
						<ion-icon src="/svg/calendar.svg"></ion-icon>
					</ion-tab-button>

					<ion-tab-button
						tab="me"
						onClick={() => setSelectedTab("me")}
					>
						<ion-icon src="/svg/person.svg"></ion-icon>
					</ion-tab-button>
				</ion-tab-bar>

				<ion-tab tab="foods">
					<FoodsScreen
						selectedTab={selectedTab}
						foodData={foodData}
					/>
				</ion-tab>

				{/* <ion-tab tab="camera">
					<CameraScreen
						selectedTab={selectedTab}
						foodData={foodData}
					/>
				</ion-tab> */}

				<ion-tab tab="track">
					<DayScreen selectedTab={selectedTab} foodData={foodData} userData={userData}/>
				</ion-tab>

				<ion-tab tab="me">
					<UserScreen selectedTab={selectedTab} foodData={foodData} userData={userData}/>
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


export async function getServerSideProps(context) {
	const userDoc = await getDoc(doc(db, 'users', 'joamartico@gmail.com'));

	return {
		props: {
			userData: userDoc?.data() ?? null,
		},
	};
}