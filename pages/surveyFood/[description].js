import { useRouter } from "next/router";
import dv from "../../dv.json";
import NutrientItem from "../../components/NutrientItem";
import { fattyAcids, macronutients, minerals, vitamins } from "../../nutrients";
import Head from "next/head";
import { convertToUrl, getRecommendedAmount } from "../../utils/functions";
// import fs from "fs";
// import path from "path";
// import foodData_survey from "../../public/foodData_survey.json";
// import foodData_foundation from "../../public/foodData_foundation.json";
import { doc, getDoc } from "firebase/firestore";
import { db } from "..";
import { useState } from "react";
import IonSelect from "../../components/IonSelect";

// let newFoodData = foodData_foundation;

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const FOOD_API_KEY = process.env.NEXT_PUBLIC_FOOD_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

function getFoodPortion(food) {
	if (!food?.foodMeasures) return null;

	const regularPortion = food?.foodMeasures?.find((nutrient) =>
		nutrient?.disseminationText?.toLowerCase().includes("regular")
	);

	if (regularPortion) return regularPortion;

	const portion1 = food?.foodMeasures?.find(
		(nutrient) => nutrient?.rank == 1
	);

	if (portion1?.gramWeight > 15 && portion1?.gramWeight < 350) {
		if (food?.description?.toLowerCase().includes("oil")) {
			if (portion1?.gramWeight < 100) return portion1;
		} else return portion1;
	}

	const portion2 = food?.foodMeasures?.find(
		(nutrient) => nutrient?.rank == 2
	);

	if (portion2?.gramWeight > 10 && portion2?.gramWeight < 350)
		return portion2;

	const portion3 = food?.foodMeasures?.find(
		(nutrient) => nutrient?.rank == 3
	);

	if (portion3?.gramWeight > 10 && portion3?.gramWeight < 350)
		return portion3;

	return food?.foodMeasures[0];
}

const food = ({ userData, food }) => {
	console.log("FOOD", food);
	const router = useRouter();
	const { description } = router.query;
	const foodPortion = getFoodPortion(food);
	const [portion, setPortion] = useState(foodPortion);

	// useEffect(() => {
	// fetch(
	// 	`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${FOOD_API_KEY}&query=Applesauce and apricots, baby food, NS as to strained or junior`
	// )
	// 	.then((response) => response.json())
	// 	.then((data) => {
	// 		console.log("data", data);
	// 		// Process the retrieved data here
	// 	})
	// 	.catch((error) => {
	// 		console.log("An error occurred:", error);
	// 	});
	// }, []);

	// const food = foodData_survey.find(
	// 	(f) => convertToUrl(f.description) == description
	// );

	// console.log("food", food);

	let omega3ALA = 0;
	let omega3EPA = 0;
	let omega3DHA = 0;

	let omega6 = 0;

	const nutrientsHaveN6 = food?.foodNutrients.find((nutrient) =>
		nutrient?.nutrientName.includes("n-6")
	);

	food?.foodNutrients.map((nutrient) => {
		// OMEGA 3
		if (
			nutrient?.nutrientName.includes("ALA") ||
			nutrient?.nutrientName.includes("PUFA 18:3")
		) {
			console.log("ALA", nutrient?.value, nutrient?.nutrientName);
			omega3ALA = nutrient?.value || omega3ALA;
		}
		if (
			nutrient?.nutrientName.includes("EPA") ||
			nutrient?.nutrientName.includes("PUFA 20:5")
		) {
			console.log("EPA", nutrient?.value, nutrient?.nutrientName);
			omega3EPA = nutrient?.value || omega3EPA;
		}

		if (
			nutrient?.nutrientName.includes("DHA") ||
			nutrient?.nutrientName.includes("PUFA 22:6")
		) {
			console.log("DHA", nutrient?.value, nutrient?.nutrientName);
			omega3DHA = nutrient?.value || omega3DHA;
		}

		if (nutrientsHaveN6) {
			// OMEGA 6
			if (nutrient?.nutrientName.includes("n-6")) {
				omega6 = omega6 + amount;
			}
		} else {
			if (
				nutrient?.nutrientName.includes("PUFA 18:2") || // LA
				// nutrient?.nutrientName.includes("PUFA 18:3") || // GLA
				nutrient?.nutrientName.includes("PUFA 20:3") || // DGLA
				nutrient?.nutrientName.includes("PUFA 20:4") // AA
			) {
				omega6 = omega6 + nutrient?.value;
			}
		}
	});

	const group = userData?.group || "men 19-30";

	async function getEmoji(foodName) {
		const response = await fetch(API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${OPENAI_API_KEY}`,
			},
			body: JSON.stringify({
				model: "gpt-3.5-turbo",
				max_tokens: 3,
				messages: [
					{
						role: "system",
						content:
							"return only one emoji that represents the food",
					},
					{ role: "user", content: "tomato" },
					{ role: "assistant", content: "🍅" },
					{ role: "user", content: "orange juice" },
					{ role: "assistant", content: "🍊" },
					{ role: "user", content: foodName },
				],
				temperature: 0.2,
			}),
		});
		console.log("response", response);
		const data = await response.json();
		console.log("data", data);
		const emoji = data.choices[0].message.content;
		return emoji;
	}

	async function addFoodToFoundationJson(food) {
		const newFoodEmoji = await getEmoji(food.description);
		console.log(newFoodEmoji);
		const newFood = {
			emoji: newFoodEmoji,
			description: food.description,
			dataType: food.dataType,
			fdcId: food.fdcId,
			foodCategory: food.foodCategory,
			foodPortions: food.foodMeasures.map((portion) => ({
				sequenceNumber: portion.rank,
				gramWeight: portion.gramWeight,
				measureUnit: { name: portion.disseminationText },
			})),
			foodNutrients: food.foodNutrients.map((nutrient) => ({
				amount: nutrient.value,
				nutrient: {
					unitName: nutrient.unitName,
					name: nutrient.nutrientName,
					id: nutrient.foodNutrientId,
					rank: nutrient.rank,
				},
			})),
		};
		console.log("newFood", newFood);
		// food.emoji = newFoodEmoji;

		// newFoodData = [...newFoodData, newFood];
		// navigator.clipboard.writeText(JSON.stringify(newFoodData, null, 2));

		fetch("/api/addFood", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newFood),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Success:", data);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}

	return (
		<>
			<Head>
				<title>{food?.description} - Nutros</title>
			</Head>
			<ion-header translucent>
				<ion-toolbar>
					<ion-buttons slot="start">
						<ion-button onClick={() => router.back()}>
							Back
						</ion-button>
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
							{food.foodMeasures?.map((portion) => (
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
											(portion.disseminationText !=
												"undetermined" &&
												portion.disseminationText) || // PARA CHOCOLATE NO SIRVE, ES "undetermined"
											portion.modifier}{" "}
										({portion.gramWeight} grams)
									</span>
								</ion-select-option>
							))}
							<ion-select-option value="250">
								Portion (250 grams)
							</ion-select-option>
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

				{/* {userData?.email === "joamartico@gmail.com" && ( */}
				{/* localhost && */}
				{process.env.NODE_ENV === "development" && (
					<div
						style={{
							border: "1px solid green",
							width: "fit-content",
							marginLeft: "auto",
							cursor: "pointer",
							borderRadius: 5,
							padding: 5,
						}}
						onClick={() => {
							confirm("Add " + food.description + " to json?")
								? addFoodToFoundationJson(food)
								: console.log("bye");
						}}
					>
						Add to JSON
					</div>
				)}

				<ion-list>
					<ion-list-header>Macronutrients</ion-list-header>

					{macronutients.map((macronutrient) => {
						const nutrient = food?.foodNutrients.find(
							(item) => macronutrient.dbName == item?.nutrientName
						);

						if (!nutrient?.value) return null;

						return (
							<NutrientItem
								dbName={macronutrient.dbName}
								completeName={macronutrient.completeName}
								amount={
									nutrient?.value *
										(portion?.gramWeight / 100) ||
									nutrient?.value
								}
								recommendedAmount={getRecommendedAmount(
									macronutrient.dbName,
									userData
								)}
								unitName={nutrient?.unitName.toLowerCase()}
								url={`/?nutrient=${macronutrient.dbName}`}
							/>
						);
					})}
				</ion-list>

				<ion-list>
					<ion-list-header>Vitamins</ion-list-header>

					{vitamins.map((vitamin) => {
						const nutrient = food?.foodNutrients.find(
							(nutrient) => {
								return vitamin.dbName == nutrient?.nutrientName;
							}
						);

						return (
							<NutrientItem
								dbName={vitamin.dbName}
								completeName={vitamin.completeName}
								amount={
									nutrient?.value *
										(portion?.gramWeight / 100) ||
									nutrient?.value
								}
								recommendedAmount={dv[group][vitamin.dbName]}
								unitName={nutrient?.unitName.toLowerCase()}
								onClick={() => console.log(nutrient)}
								decimals={2}
							/>
						);
					})}

					{/* {food?.foodNutrients
						.filter((nutrient) => {
							return (
								parseInt(nutrient.nutrient?.id) > 1104 &&
								parseInt(nutrient.nutrient?.id) < 1186
							);
						})
						.map((nutrient) => {
							if (dv.vitamins[group][nutrient?.nutrientName]) {
								return (
									<NutrientItem
										name={nutrient?.nutrientName}
										amount={
											nutrient.value *
												(food.foodPortions[0]
													?.gramWeight /
													100) || nutrient.value
										}
										unitName={nutrient?.nutrient.unitName}
									/>
								);
							}
						})} */}
				</ion-list>

				<ion-list>
					<ion-list-header>Minerals</ion-list-header>

					{minerals.map((mineral) => {
						const nutrient = food?.foodNutrients.find(
							(nutrient) =>
								mineral.dbName == nutrient?.nutrientName
						);

						return (
							<NutrientItem
								dbName={mineral.dbName}
								completeName={mineral.completeName}
								amount={
									nutrient?.value *
										(portion?.gramWeight / 100) ||
									nutrient?.value
								}
								recommendedAmount={dv[group][mineral.dbName]}
								unitName={nutrient?.unitName.toLowerCase()}
								onClick={() => console.log(nutrient?.nutrient)}
							/>
						);
					})}

					{/* {food?.foodNutrients
						.filter((nutrient) => {
							return (
								parseInt(nutrient.nutrient?.id) > 1086 &&
								parseInt(nutrient.nutrient?.id) < 1105
							);
						})
						.map((nutrient) => (
							<NutrientItem
								name={nutrient?.nutrientName}
								amount={
									nutrient.value *
										(food.foodPortions[0]?.gramWeight /
											100) || nutrient.value
								}
								unitName={nutrient?.nutrient.unitName}
							/>
						))} */}
				</ion-list>

				<ion-list>
					<ion-list-header>Fatty Acids</ion-list-header>

					{fattyAcids.map((fattyAcid) => {
						return (
							<NutrientItem
								dbName={fattyAcid.dbName}
								completeName={fattyAcid.completeName}
								amount={
									fattyAcid.dbName.includes("ALA")
										? omega3ALA *
												(portion?.gramWeight / 100) ||
										  omega3ALA
										: fattyAcid.dbName.includes("EPA")
										? omega3EPA *
												(portion?.gramWeight / 100) ||
										  omega3EPA
										: fattyAcid.dbName.includes("DHA")
										? omega3DHA *
												(portion?.gramWeight / 100) ||
										  omega3DHA
										: omega6 *
												(portion?.gramWeight / 100) ||
										  omega6
								}
								recommendedAmount={dv[group][fattyAcid.dbName]}
								unitName={"g"}
								url={`/?nutrient=${fattyAcid.dbName}`}
								decimals={2}
							/>
						);
					})}
				</ion-list>

				<ion-list>
					<ion-list-header>General</ion-list-header>
					{food?.foodNutrients
						// .filter((nutrient) => {
						// 	return (
						// 		// parseInt(nutrient.nutrient?.id) > 1086 &&
						// 		parseInt(nutrient?.nutrientId) < 1087
						// 	);
						// })
						.map((nutrient) => (
							<NutrientItem
								completeName={nutrient?.nutrientName}
								dbName={nutrient?.nutrientName}
								amount={
									nutrient.value *
										(portion?.gramWeight / 100) ||
									nutrient.value
								}
								unitName={nutrient?.unitName.toLowerCase()}
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
	const foodDescription = ctx.query.description;
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
	if (userData) {
		userData.email = userCookie || "";
	}

	let realFood;

	await fetch(
		`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${FOOD_API_KEY}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				pageSize: 5,
				query: foodDescription,
			}),
		}
	)
		.then((response) => response.json())
		.then((foods) => {
			// console.log("foods", foods);
			realFood = foods.foods.find((food) => {
				const urlFood =
					food?.description && convertToUrl(food?.description);
				console.log(urlFood);
				return urlFood == foodDescription;
			});
			console.log("real food", realFood);
			// Process the retrieved data here
		})
		.catch((error) => {
			console.log("An error occurred:", error);
		});

	return {
		props: {
			userData,
			food: realFood || null,
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
