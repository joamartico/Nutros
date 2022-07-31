import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";
import IonSearchbar from "../components/IonSearchbar";
import foodData from "../foodData.json";
import useGlobalState from "../hooks/useGlobalState";

export default function Home() {
	const {setFood} = useGlobalState();
	const [search, setSearch] = useState("");
	const router = useRouter();

	return (
		<>
			<ion-header>
				<ion-toolbar>
					<ion-title>Search food</ion-title>
					<ion-buttons slot="end">
						<ion-button>Order By</ion-button>
					</ion-buttons>
				</ion-toolbar>
			</ion-header>

			<ion-content fullscreen>
				<ion-header collapse="condense">
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
									router.push({
										pathname: "/food/" + food.foodCode,
										query: {
											name: food.description,
											...food.foodNutrients,
										},
									});
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
