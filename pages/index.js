import FoodsScreen from "../tab-screens/FoodsScreen";
import { useEffect, useState } from "react";
import DayScreen from "../tab-screens/DayScreen";
import UserScreen from "../tab-screens/UserScreen";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import firebaseApp from "../firebase";
import useAuth from "../hooks/useAuth";
import { shuffleArray } from "../utils/functions";
import foundationFoodData from "../public/foodData_foundation.json";
const foodNames = foundationFoodData.map(food => food.description);


export const db = getFirestore(firebaseApp);

export default function Home({ shuffledFoodNames }) {
	const [selectedTab, setSelectedTab] = useState("foods");
	const [userData, setUserData] = useState();
	const user = useAuth();

	useEffect(() => {
		if (!user) return;
		getDoc(doc(db, "users", user?.email)).then((userDoc) => {
			setUserData(userDoc.data());
		});
	}, [user]);

	const foodDataMap = foundationFoodData.reduce((acc, food) => {
		acc[food.description] = food;
		return acc;
	}, {});

	const foodData = shuffledFoodNames.map(
		(foodName) => foodDataMap[foodName]
	);

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

export async function getServerSideProps() {
	const shuffledFoodNames = shuffleArray(foodNames);

	return {
			props: {
					shuffledFoodNames,
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
