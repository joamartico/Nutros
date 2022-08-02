import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";
import IonSearchbar from "../components/IonSearchbar";
import IonSelect from "../components/IonSelect";
import useGlobalState from "../hooks/useGlobalState";

export default function Home({ foodData }) {
	const { setFood } = useGlobalState();
	const [search, setSearch] = useState("");
	const router = useRouter();
	const [selectedNutrient, setSelectedNutrient] = useState(true)

	const nutrients = foodData.SurveyFoods[0].foodNutrients
		.map((item, i) => item.nutrient.name)
		.slice(0, 44);

	async function orderFoodBy(nutrient) {
		await foodData.SurveyFoods.sort((a, b) => {
			return (
				b.foodNutrients.find(
					(item) => item.nutrient.name === nutrient
				).amount
				-
				a.foodNutrients.find(
					(item) => item.nutrient.name === nutrient
				).amount 
			);
		});
		setSelectedNutrient(nutrient);
	}

	return (
		<>
			<ion-header translucent>
				<ion-toolbar>
					<ion-title>Search food</ion-title>

					<ion-buttons slot="end">
						<ion-button>Order By</ion-button>

						<IonSelect
							onChange={(e) => {
								orderFoodBy(e.target.value[0]);
							}}
							value={selectedNutrient}

						>
							{nutrients.map((nutrient, i) => (
								<ion-select-option
									key={nutrient}
									value={nutrient}
								>
									{nutrient}
								</ion-select-option>
							))}
						</IonSelect>
					</ion-buttons>
				</ion-toolbar>
			</ion-header>

			<ion-content fullscreen>
				<ion-header collapse="condense" translucent>
					<ion-toolbar>
						<ion-title size="large">Search Food</ion-title>
					</ion-toolbar>

					<ion-toolbar>
						<IonSearchbar
							value={search}
							onChange={(e) => setSearch(e.detail.value)}
							placeholder="Search"
						/>
					</ion-toolbar>
				</ion-header>

				<ion-list>
					{foodData.SurveyFoods.filter((food) => {
						search == "" && true;
						return food.description
							.toLowerCase()
							.includes(search.toLowerCase());
					})
						.slice(0, 20)
						.map((food) => (
							<ion-item
								key={food.foodCode}
								onClick={() => {
									setFood(food);
									router.push("/food/" + food.foodCode);
								}}
							>
								<ion-label>{food.description}</ion-label>
							</ion-item>
						))}
				</ion-list>
			</ion-content>
		</>
	);
}

// SSR FETCH A API ORIGINAL (MAXIMO 200 RESULTADOS)
// export async function getServerSideProps(context) {
// 	const params = {
// 		api_key: "X66ugLvvhHYrDgeiwTuSwPZEJAhupK2WSEEcxvaC",
// 		query: "Mango",
// 		dataType: ["Survey (FNDDS)"],
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
