import { useRouter } from "next/router";
import dv from "../../dv.json";
import NutrientItem from "../../components/NutrientItem";
import { minerals, vitamins } from "../../nutrients";
import Head from "next/head";
import { convertToUrl, getFoodPortion } from "../../utils/functions";
// import fs from "fs";
// import path from "path";
import foodData from "../../public/foodData_foundation.json";
import { doc, getDoc } from "firebase/firestore";
import { db } from "..";
import IonSelect from "../../components/IonSelect";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";

const food = ({ userData }) => {
	const router = useRouter();
	const { description } = router.query;
	const food = foodData.find(
		(f) => convertToUrl(f.description) == description
	);
	const foodPortion = getFoodPortion(food);

	const [portion, setPortion] = useState(foodPortion);

	console.log("food", food);

	let omega3 = 0;
	let omega6 = 0;

	const nutrientsHaveN3 = food?.foodNutrients.find((item) =>
		item?.nutrient?.name.includes("n-3")
	);

	const nutrientsHaveN6 = food?.foodNutrients.find((item) =>
		item?.nutrient?.name.includes("n-6")
	);

	food?.foodNutrients.map((item) => {
		if (nutrientsHaveN3) {
			// OMEGA 3
			if (item?.nutrient?.name.includes("n-3")) {
				omega3 = omega3 + item?.amount;
			}
		} else {
			if (
				item?.nutrient?.name.includes("PUFA 18:3") || // ALA
				item?.nutrient?.name.includes("PUFA 18:4") || // SDA
				item?.nutrient?.name.includes("PUFA 20:5") || // EPA
				item?.nutrient?.name.includes("PUFA 22:5") || // DPA
				item?.nutrient?.name.includes("PUFA 22:6") // DHA
			) {
				console.log("contains omega3");
				omega3 = omega3 + item.amount;
			}
		}

		if (nutrientsHaveN6) {
			// OMEGA 6
			if (item?.nutrient?.name.includes("n-6")) {
				omega6 = omega6 + item?.amount;
			}
		} else {
			if (
				item?.nutrient?.name.includes("PUFA 18:2") || // LA
				// item?.nutrient?.name.includes("PUFA 18:3") || // GLA
				item?.nutrient?.name.includes("PUFA 20:3") || // DGLA
				item?.nutrient?.name.includes("PUFA 20:4") // AA
			) {
				omega6 = omega6 + item.amount;
			}
		}
	});

	const group = userData?.group || "men 19-30";

	console.log("foodPortion", portion);

	const user = useAuth();
	async function removeFoodFromFoundationJson(food) {
		fetch("/api/removeFood", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(food),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Success:", data);
				router.push("/");
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}

	return (
		<>
			<Head>
				<title>
					{food?.emoji} {food?.description} nutrients: vitamins and
					minerals | Nutros
				</title>
				<meta
					name="description"
					content={`Discover the nutrients of ${food?.emoji} ${food?.description} and how much you need to eat to get the recommended daily value of vitamins and minerals.`}
				/>
				<link
					rel="canonical"
					href={`https://nutros.vercel.app/food/${convertToUrl(
						food?.description
					)}/`}
				/>
			</Head>

			{/* {console.log(food?.foodNutrients)} */}
			<ion-header translucent>
				<ion-toolbar>
					<ion-buttons slot="start">
						{/* <a href="/"> */}
						<ion-button
							onClick={() => {
								console.log('document.referrer', document.referrer)
								console.log('window.location.origin', window.location.origin)
								if (
									document.referrer.includes(
										window.location.origin
									)
								) {
									router.back();
								} else {
									router.push("/");
								}
							}}
						>
							<ion-icon src="/svg/chevron-back.svg" />
							All Foods
						</ion-button>
						{/* </a> */}
					</ion-buttons>
					<ion-title>
						<>
							{food?.emoji}&nbsp;&nbsp;
							{food?.description.split(", ")[0]}
						</>
					</ion-title>
				</ion-toolbar>
			</ion-header>

			<ion-content fullscreen>
				<ion-header collapse="condense">
					<ion-toolbar>
						<h1>
							<ion-title size="large" style={{ height: 50 }}>
								{food?.emoji}&nbsp;{food?.description}
							</ion-title>
						</h1>
					</ion-toolbar>

					<ion-toolbar>
						<IonSelect
							value={portion?.gramWeight || "100"}
							placeholder="Select portion"
							style={{
								width: "fit-content",
								paddingLeft: 15,
								textTransform: "capitalize",
							}}
							onChange={(e) => {
								console.log("e", e.detail.value);
								setPortion({
									...portion,
									gramWeight: e.detail.value,
								});
							}}
							interface="alert"
						>
							{food.foodPortions?.map((portion) => (
								<ion-select-option
									value={portion.gramWeight}
									style={{ textTransform: "capitalize" }}
								>
									<span
										class="ion-text-capitalize"
										style={{ textTransform: "capitalize" }}
									>
										{portion.portionDescription?.replace(
											/\([^()]*\)/g,
											""
										) ||
											portion.measureUnit.name ||
											portion.modifier}{" "}
										({portion.gramWeight} grams)
									</span>
								</ion-select-option>
							))}
							<ion-select-option value="100">
								Portion (100 grams)
							</ion-select-option>
							<ion-select-option value="50">
								Portion (50 grams)
							</ion-select-option>
						</IonSelect>
						{/* </ion-item> */}
						{/* <ion-text class="ion-padding">
							<span class="ion-text-capitalize">
								{foodPortion?.portionDescription ||
									foodPortion?.measureUnit.name ||
									foodPortion?.modifier ||
									"Portion"}{" "}
							</span>
							({portion?.gramWeight || 100} grams)
						</ion-text> */}
					</ion-toolbar>
				</ion-header>

				<ion-list>
					{user?.email === "joamartico@gmail.com" && (
						<ion-item>
							<ion-button
								onClick={() => {
									confirm(
										"Remove " +
											food.description +
											" from json?"
									)
										? removeFoodFromFoundationJson(food)
										: console.log("bye");
								}}
							>
								Remove from JSON
							</ion-button>
						</ion-item>
					)}
					<ion-list-header>Vitamins</ion-list-header>

					{vitamins.map((vitamin) => {
						const nutrient = food?.foodNutrients.find(
							(item) => vitamin.dbName == item?.nutrient?.name
						);

						return (
							<NutrientItem
								dbName={vitamin.dbName}
								completeName={vitamin.completeName}
								amount={
									nutrient?.amount *
										(portion?.gramWeight / 100) ||
									nutrient?.amount
								}
								recommendedAmount={dv[group][vitamin.dbName]}
								unitName={nutrient?.nutrient.unitName}
								onClick={() => console.log(nutrient)}
							/>
						);
					})}

					{/* {food?.foodNutrients
						.filter((item) => {
							return (
								parseInt(item.nutrient?.id) > 1104 &&
								parseInt(item.nutrient?.id) < 1186
							);
						})
						.map((item) => {
							if (dv.vitamins[group][item?.nutrient?.name]) {
								return (
									<NutrientItem
										name={item?.nutrient?.name}
										amount={
											item.amount *
												(food.foodPortions[0]
													?.gramWeight /
													100) || item.amount
										}
										unitName={item?.nutrient.unitName}
									/>
								);
							}
						})} */}
				</ion-list>

				<ion-list>
					<ion-list-header>Minerals</ion-list-header>

					{minerals.map((mineral) => {
						const nutrient = food?.foodNutrients.find(
							(item) => mineral.dbName == item?.nutrient?.name
						);

						return (
							<NutrientItem
								dbName={mineral.dbName}
								completeName={mineral.completeName}
								amount={
									nutrient?.amount *
										(portion?.gramWeight / 100) ||
									nutrient?.amount
								}
								recommendedAmount={dv[group][mineral.dbName]}
								unitName={nutrient?.nutrient.unitName}
								onClick={() => console.log(nutrient?.nutrient)}
							/>
						);
					})}

					{/* {food?.foodNutrients
						.filter((item) => {
							return (
								parseInt(item.nutrient?.id) > 1086 &&
								parseInt(item.nutrient?.id) < 1105
							);
						})
						.map((item) => (
							<NutrientItem
								name={item?.nutrient?.name}
								amount={
									item.amount *
										(food.foodPortions[0]?.gramWeight /
											100) || item.amount
								}
								unitName={item?.nutrient.unitName}
							/>
						))} */}
				</ion-list>

				<ion-list>
					<ion-list-header>Fats</ion-list-header>

					<NutrientItem
						name="Omega-3"
						completeName="Omega-3"
						dbName="Omega-3"
						amount={omega3 * (portion?.gramWeight / 100) || omega3}
						unitName={"g"}
						recommendedAmount={dv[group]["Omega-3"]}
					/>

					<NutrientItem
						name="Omega-6"
						completeName="Omega-6"
						dbName="Omega-6"
						amount={omega6 * (portion?.gramWeight / 100) || omega6}
						recommendedAmount={dv[group]["Omega-6"]}
						unitName={"g"}
					/>
				</ion-list>

				<ion-list>
					<ion-list-header>General</ion-list-header>

					{food?.foodNutrients
						.filter((item) => {
							// console.log(item?.nutrient?.name, item.amount);

							return (
								// parseInt(item.nutrient?.id) > 1086 &&
								parseInt(item.nutrient?.id) < 1087
							);
						})
						.map((item) => (
							<NutrientItem
								completeName={item?.nutrient?.name}
								dbName={item?.nutrient?.name}
								amount={
									item.amount * (portion?.gramWeight / 100) ||
									item.amount
								}
								unitName={item?.nutrient.unitName}
								// recommendedAmount={100}
							/>
						))}
				</ion-list>
			</ion-content>
		</>
	);
};

export default food;

export async function getServerSideProps(ctx) {
	const cookies = ctx.req.headers.cookie?.split("; ");
	const userCookie = cookies
		?.find((cookie) => cookie.startsWith("user="))
		?.split("=")[1]
		.replace(/%40/g, "@");
	// console.log('USERCOOKIE: ', userCookie)
	// const auth = getAuth(firebaseApp);
	// const userCookie = user?.split("=")[1];
	// const user = auth.currentUser;
	let userData = userCookie
		? await getDoc(doc(db, "users", userCookie))
		: null;
	userData = userData?.data() || null;

	return {
		props: {
			userData,
		},
	};
}

// export async function getServerSideProps(context) {
// 	const cookies = context.req.headers.cookie?.split("; ");
// 	console.log("cookies: ", cookies);
// 	// const authuser = await getAuth(firebaseApp);
// 	const routeQuery = context.query.description;
// 	console.log("routeQuery: ", routeQuery);

// 	const filePath = path.join(
// 		process.cwd(),
// 		"public",
// 		"foodData_foundation.json"
// 	);
// 	const fileContents = fs.readFileSync(filePath, "utf-8");
// 	const foodData = JSON.parse(fileContents);
// 	const food = foodData.find((f) =>
// 		convertToUrl(f.description).includes(routeQuery)
// 	);

// 	return {
// 		props: {
// 			food,
// 			cookies: cookies || null,
// 		},
// 	};
// }
