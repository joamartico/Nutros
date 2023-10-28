import FoodsScreen from "../tab-screens/FoodsScreen";
import { useState } from "react";
import DayScreen from "../tab-screens/DayScreen";
import UserScreen from "../tab-screens/UserScreen";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import firebaseApp from "../firebase";
import { shuffleArray } from "../utils/functions";
import foundationFoodData from "../public/foodData_foundation.json";
// import { getAuth } from "firebase/auth";
import ChatbotScreen from "../tab-screens/ChatbotScreen";
const foodNames = foundationFoodData.map((food) => food.description);

export const db = getFirestore(firebaseApp);

export default function Home({ shuffledFoodNames, userData, ip }) {
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

	const foodData = shuffledFoodNames.map((foodName) => foodDataMap[foodName]);

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
						tab="chatbot"
						onClick={() => setSelectedTab("chatbot")}
					>
						<ion-icon src="/svg/bot.svg" size="large"></ion-icon>
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
						userData={userData}
						ip={ip}
					/>
				</ion-tab>

				{/* <ion-tab tab="camera">
					<CameraScreen
						selectedTab={selectedTab}
						foodData={foodData}
						userData={userData}
						ip={ip}
					/>
				</ion-tab> */}

				<ion-tab tab="track">
					<DayScreen
						selectedTab={selectedTab}
						foodData={foodData}
						userData={userData}
						ip={ip}
					/>
				</ion-tab>

				<ion-tab tab="chatbot">
					<ChatbotScreen
						selectedTab={selectedTab}
						foodData={foodData}
						userData={userData}
						ip={ip}
					/>
				</ion-tab>

				<ion-tab tab="me">
					<UserScreen
						selectedTab={selectedTab}
						foodData={foodData}
						userData={userData}
						ip={ip}
					/>
				</ion-tab>
			</ion-tabs>
		</>
	);
}

export async function getServerSideProps(ctx) {
	const shuffledFoodNames = shuffleArray(foodNames);


	// Extract IP from the request headers
	let ip =
		ctx.req.headers["x-forwarded-for"] ||
		ctx.req.connection.remoteAddress;

	// If the IP contains a comma, consider the first part (in case of multiple forwarded addresses)
	if (ip.includes(",")) {
		ip = ip.split(",")[0];
	}

	// Remove IPv6 prefix if it's there
	ip = ip.replace("::ffff:", "");


	const cookies = ctx.req.headers.cookie?.split("; ");
	// if (!cookies) return { props: { shuffledFoodNames } };
	const userCookie = cookies
		?.find((cookie) => cookie.startsWith("user="))
		?.split("=")[1]
		.replace(/%40/g, "@");
		// let userData = userCookie
		// 	? await getDoc(doc(db, "users", userCookie))
		// 	: null;
	let userData = await getDoc(doc(db, "users", userCookie || ip))

	userData = userData?.data() || null;
	if (userData) {
		userData.email = userCookie || "";
	}

	return {
		props: {
			shuffledFoodNames,
			cookies,
			userData,
			ip,
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
