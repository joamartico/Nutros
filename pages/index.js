import FoodsScreen from "../tab-screens/FoodsScreen";
import { useState } from "react";
import DayScreen from "../tab-screens/DayScreen";
import UserScreen from "../tab-screens/UserScreen";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import firebaseApp from "../firebase";
import useAuth from "../hooks/useAuth";
import { shuffleArray } from "../utils/functions";
import foundationFoodData from "../public/foodData_foundation.json";
import { getAuth } from "firebase/auth";
import Head from "next/head";
const foodNames = foundationFoodData.map(food => food.description);

export const db = getFirestore(firebaseApp);

export default function Home({ shuffledFoodNames, userData }) {
	const [selectedTab, setSelectedTab] = useState("foods");

	// useEffect(() => {
	// 	if (!user) return;
	// 	getDoc(doc(db, "users", user?.email)).then((userDoc) => {
	// 		setUserData(userDoc.data());
	// 	});
	// }, [user]);

	const foodDataMap = foundationFoodData.reduce((acc, food) => {
		acc[food.description] = food;
		return acc;
	}, {});

	const foodData = shuffledFoodNames.map(
		(foodName) => foodDataMap[foodName]
	);

	return (
		<>
			
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
					<DayScreen
						selectedTab={selectedTab}
						foodData={foodData}
						userData={userData}
					/>
				</ion-tab>

				<ion-tab tab="me">
					<UserScreen
						selectedTab={selectedTab}
						foodData={foodData}
						userData={userData}
					/>
				</ion-tab>
			</ion-tabs>
		</>
	);
}

export async function getServerSideProps(ctx) {
	const shuffledFoodNames = shuffleArray(foodNames);
	const cookies = ctx.req.headers.cookie?.split("; ");
	if(!cookies) return { props: { shuffledFoodNames } }
	const userCookie = cookies?.find((cookie) => cookie.startsWith("user="))?.split("=")[1].replace(/%40/g, '@');
	console.log('USERCOOKIE: ', userCookie)
	const auth = getAuth(firebaseApp);
	// const userCookie = user?.split("=")[1];
	// const user = auth.currentUser;
	let userData = userCookie
		? await getDoc(doc(db, "users", userCookie))
		: null;
	userData = userData?.data() || null;

	return {
			props: {
					shuffledFoodNames,
					cookies,
					userData,
					// userCookie
			},
	};
}


// export async function getStaticProps() {
//   const filePath = path.join(process.cwd(), "public", "foodData_foundation.json");
//   const fileContents = fs.readFileSync(filePath, "utf-8");
//   const foodData = JSON.parse(fileContents);

//   const randomOrderFoods = shuffleArray(foodData);

//   return {
//     props: {
//       foodData: randomOrderFoods,
//     },
//     revalidate: 60 * 60 * 2, // 2 hours
//   };
// }
