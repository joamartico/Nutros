import { useRouter } from "next/router";
import styled from "styled-components";
import useGlobalState from "../../hooks/useGlobalState";
import IonSearchbar from "../../components/IonSearchbar";

import dv from "../../dv.json";
import NutrientItem from "../../components/NutrientItem";

const food = ({ foodData }) => {
	const router = useRouter();
	const { id } = router.query;

	// const { food, setFood } = useGlobalState();

	// if(!food) {
	// 	const newFood = foodData.SurveyFoods.find(f => f.foodCode === id);
	// 	setFood(newFood);
	// }

	const food = foodData.SurveyFoods.find((f) => f.foodCode === id);

	const group = "men 19-30";

	return (
		<>
			<ion-header translucent>
				<ion-toolbar>
					<ion-buttons slot="start">
						<ion-button onClick={() => router.push("/")}>
							Back
						</ion-button>
					</ion-buttons>
					<ion-title>{food?.description}</ion-title>
				</ion-toolbar>
			</ion-header>

			<ion-content fullscreen>
				<ion-header collapse="condense">
					<ion-toolbar>
						<ion-title size="large">{food?.description}</ion-title>
						<ion-buttons slot="start">
							<ion-back-button defaultHref="/" />
						</ion-buttons>
					</ion-toolbar>
				</ion-header>

				<ion-list>
					<ion-list-header>
						<h2>Minerals</h2>
					</ion-list-header>

					{food?.foodNutrients
						.filter((item) => {
							return (
								parseInt(item.nutrient.id) > 1086 &&
								parseInt(item.nutrient.id) < 1105
							);
						})
						.map((item) => (
							<NutrientItem
								item={item}
								group={dv.minerals[group]}
							/>
						))}
				</ion-list>

				<ion-list>
					<ion-list-header>
						<h2>Vitamins</h2>
					</ion-list-header>
					{food?.foodNutrients
						.filter((item) => {
							return (
								parseInt(item.nutrient.id) > 1104 &&
								parseInt(item.nutrient.id) < 1186
							);
						})
						.map((item) => (
							<NutrientItem
								item={item}
								group={dv.vitamins[group]}
							/>
						))}
				</ion-list>
			</ion-content>
		</>
	);
};

export default food;
