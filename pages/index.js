import FoodsScreen from "../tab-screens/FoodsScreen";
import { useEffect, useState } from "react";
import DayScreen from "../tab-screens/DayScreen";
import UserScreen from "../tab-screens/UserScreen";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import firebaseApp from "../firebase";
import useAuth from "../hooks/useAuth";
import fs from "fs";
import path from "path";
import { shuffleArray } from "../utils/functions";

export const db = getFirestore(firebaseApp);

export default function Home({ foodData }) {
	const [selectedTab, setSelectedTab] = useState("foods");
	const [userData, setUserData] = useState();
	const user = useAuth();

	useEffect(() => {
		if (!user) return;
		getDoc(doc(db, "users", user?.email)).then((userDoc) => {
			setUserData(userDoc.data());
		});
	}, [user]);


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


export async function getServerSideProps(context) {
	const cookies = context.req.headers.cookie?.split('; ');
	console.log("cookies: ", cookies);
	// const authuser = await getAuth(firebaseApp);

	const filePath = path.join(process.cwd(), "public", "foodData_foundation.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const foodData = JSON.parse(fileContents);

  // const randomOrderFoods = foodData.sort(() => Math.random() - Math.random());
	const randomOrderFoods = shuffleArray(foodData);

	return {
		props: {
			foodData: randomOrderFoods,
			cookies: cookies || null,
			// userData: userDoc?.data() ?? null,
		},
	};
}
