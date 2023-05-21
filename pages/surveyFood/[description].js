import { useRouter } from "next/router";
import dv from "../../dv.json";
import NutrientItem from "../../components/NutrientItem";
import { minerals, vitamins } from "../../nutrients";
import Head from "next/head";
import { convertToUrl } from "../../utils/functions";
// import fs from "fs";
// import path from "path";
// import foodData_survey from "../../public/foodData_survey.json";
// import foodData_foundation from "../../public/foodData_foundation.json";
import { doc, getDoc } from "firebase/firestore";
import { db } from "..";
import useAuth from "../../hooks/useAuth";

// let newFoodData = foodData_foundation;

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const FOOD_API_KEY = process.env.NEXT_PUBLIC_FOOD_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

function getFoodPortion(food) {
	if (!food?.foodMeasures) return null;
	const portion1 = food?.foodMeasures?.find(
		(nutrient) => nutrient?.rank == 1
	);

	if (portion1?.gramWeight > 15 && portion1?.gramWeight < 350)
		return portion1;

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
	const user = useAuth();
	const { description } = router.query;

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

	let omega3 = 0;
	let omega6 = 0;

	const nutrientsHaveN3 = food?.foodNutrients.find((nutrient) =>
		nutrient?.nutrientName.includes("n-3")
	);

	const nutrientsHaveN6 = food?.foodNutrients.find((nutrient) =>
		nutrient?.nutrientName.includes("n-6")
	);

	food?.foodNutrients.map((nutrient) => {
		if (nutrientsHaveN3) {
			// OMEGA 3
			if (nutrient?.nutrientName.includes("n-3")) {
				omega3 = omega3 + nutrient?.value;
			}
		} else {
			if (
				nutrient?.nutrientName.includes("PUFA 18:3") || // ALA
				nutrient?.nutrientName.includes("PUFA 18:4") || // SDA
				nutrient?.nutrientName.includes("PUFA 20:5") || // EPA
				nutrient?.nutrientName.includes("PUFA 22:5") || // DPA
				nutrient?.nutrientName.includes("PUFA 22:6") // DHA
			) {
				console.log("contains omega3");
				omega3 = omega3 + nutrient.value;
			}
		}

		if (nutrientsHaveN6) {
			// OMEGA 6
			if (nutrient?.nutrientName.includes("n-6")) {
				omega6 = omega6 + nutrient?.value;
			}
		} else {
			if (
				nutrient?.nutrientName.includes("PUFA 18:2") || // LA
				// nutrient?.nutrientName.includes("PUFA 18:3") || // GLA
				nutrient?.nutrientName.includes("PUFA 20:3") || // DGLA
				nutrient?.nutrientName.includes("PUFA 20:4") // AA
			) {
				omega6 = omega6 + nutrient.value;
			}
		}
	});

	const group = userData?.group || "men 19-30";

	const foodPortion = getFoodPortion(food);

	console.log("foodPortion", foodPortion);

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

		const data = await response.json();
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
				measureUnit: {name: portion.disseminationText}
			})),
			foodNutrients: food.foodNutrients.map((nutrient) => ({
				amount: nutrient.value,
				nutrient: {
					unitName: nutrient.unitName,
					name: nutrient.nutrientName,
					id: nutrient.foodNutrientId,
					rank: nutrient.rank,
				}
			})),
		};
		console.log('newFood', newFood)
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
			{/* {console.log(food?.foodNutrients)} */}
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
						<ion-text class="ion-padding">
							<span class="ion-text-capitalize">
								{foodPortion?.disseminationText ||
									foodPortion?.portionDescription ||
									foodPortion?.measureUnit?.name ||
									foodPortion?.modifier ||
									"Portion"}{" "}
							</span>
							({foodPortion?.gramWeight || 100} grams)
						</ion-text>
					</ion-toolbar>
				</ion-header>

				<ion-list>
					{user?.email === "joamartico@gmail.com" && (
						<ion-item>
							<ion-button
								// size="small"
								onClick={() => {
									// if (user.email === "joamartico@gmail.com") {
									confirm(
										"Add " + food.description + " to json?"
									)
										? addFoodToFoundationJson(food)
										: console.log("bye");
									// }
								}}
							>
								Add to JSON
							</ion-button>
						</ion-item>
					)}

					<ion-list-header>Vitamins</ion-list-header>

					{vitamins.map((vitamin) => {
						const nutrient = food?.foodNutrients.find(
							(nutrient) => {
								return vitamin.dbName == nutrient?.nutrientName;
							}
						);

						console.log(nutrient);

						return (
							<NutrientItem
								dbName={vitamin.dbName}
								completeName={vitamin.completeName}
								amount={
									nutrient?.value *
										(foodPortion?.gramWeight / 100) ||
									nutrient?.value
								}
								recommendedAmount={dv[group][vitamin.dbName]}
								unitName={nutrient?.unitName.toLowerCase()}
								onClick={() => console.log(nutrient)}
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
										(foodPortion?.gramWeight / 100) ||
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
					<ion-list-header>Fats</ion-list-header>

					<NutrientItem
						name="Omega-3"
						completeName="Omega-3"
						dbName="Omega-3"
						amount={
							omega3 * (foodPortion?.gramWeight / 100) || omega3
						}
						unitName={"g"}
						recommendedAmount={dv[group]["Omega-3"]}
					/>

					<NutrientItem
						name="Omega-6"
						completeName="Omega-6"
						dbName="Omega-6"
						amount={
							omega6 * (foodPortion?.gramWeight / 100) || omega6
						}
						recommendedAmount={dv[group]["Omega-6"]}
						unitName={"g"}
					/>
				</ion-list>

				<ion-list>
					<ion-list-header>General</ion-list-header>

					{food?.foodNutrients
						.filter((nutrient) => {
							// console.log(nutrient?.nutrientName, nutrient.value);

							return (
								// parseInt(nutrient.nutrient?.id) > 1086 &&
								parseInt(nutrient?.nutrientId) < 1087
							);
						})
						.map((nutrient) => (
							<NutrientItem
								completeName={nutrient?.nutrientName}
								dbName={nutrient?.nutrientName}
								amount={
									nutrient.value *
										(foodPortion?.gramWeight / 100) ||
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
