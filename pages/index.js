import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";
import IonSearchbar from "../components/IonSearchbar";

export default function Home({ foodData }) {
	console.log(foodData);
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
					{foodData
						.filter((food) => {
							search == "" && true;
							return food.description
								.toLowerCase()
								.includes(search.toLowerCase());
						})
						.map((food) => (
							<ion-item
								key={food.foodCode}
								onClick={() => {
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

export async function getServerSideProps(context) {
	const res = await fetch(`http://localhost:3000/api/foods`);
	const foodData = await res.json();

	console.log(foodData);
	return { props: { foodData } };
}
