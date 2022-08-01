import { useRouter } from "next/router";
import styled from "styled-components";
import useGlobalState from "../../hooks/useGlobalState";
import IonSearchbar from "../../components/IonSearchbar";

import dv from "../../dv.json";
import NutrientItem from "../../components/NutrientItem";

const food = () => {
	const router = useRouter();
	// const {id} = router.query;

	const { food } = useGlobalState();

	console.log("food", food);

	const group = "men 19-30";

	console.log(food?.foodNutrients);

	return (
		<>
			<ion-header>
				<ion-toolbar>
					<ion-title>{food?.description}</ion-title>
				</ion-toolbar>
			</ion-header>

			<ion-content fullscreen>
				<ion-header collapse="condense">
					<ion-toolbar>
						<ion-title size="large">{food?.description}</ion-title>
					</ion-toolbar>
				</ion-header>

				<ion-list>
					<ion-list-header><h2>Minerals</h2></ion-list-header>

					{food?.foodNutrients
						.filter((item) => {
							return (
								parseInt(item.nutrient.id) > 1086 &&
								parseInt(item.nutrient.id) < 1105
							);
						})
						.map((item) => (
							<NutrientItem item={item} group={dv.minerals[group]} />
						))}
				</ion-list>

				<ion-list>
					<ion-list-header><h2>Vitamins</h2></ion-list-header>
					{food?.foodNutrients
						.filter((item) => {
							return (
								parseInt(item.nutrient.id) > 1104 &&
								parseInt(item.nutrient.id) < 1186
							);
						})
						.map((item) => ( 
							<NutrientItem item={item} group={dv.vitamins[group]} /> ))}
						
				</ion-list>
			</ion-content>
		</>
	);
};

export default food;

const Title = styled.h2``;
