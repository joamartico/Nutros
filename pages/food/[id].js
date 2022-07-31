import { useRouter } from "next/router";
import styled from "styled-components";
import useGlobalState from "../../hooks/useGlobalState";

const food = () => {
	const router = useRouter();
	// const {id} = router.query;

	const { food } = useGlobalState();
	console.log(food.foodNutrients);

	const vitamins = food.foodNutrients.filter((item) => {
		return item.nutrient.id == 1105;
	});

	console.log("vitamins: ", vitamins);

	return (
		<>
			<ion-header>
				<ion-toolbar>
					<ion-title>{food.description}</ion-title>
				</ion-toolbar>
			</ion-header>

			<ion-content fullscreen>
				<ion-header collapse="condense">
					<ion-buttons slot="start">
						<ion-back-button></ion-back-button>
					</ion-buttons>
					{/* <ion-toolbar> */}
					<ion-title size="large">{food.description}</ion-title>
					{/* </ion-toolbar> */}
				</ion-header>

				<Title>Minerals</Title>

				{food.foodNutrients
					.filter((item) => {
						return (
							parseInt(item.nutrient.id) > 1086 &&
							parseInt(item.nutrient.id) < 1105
						);
					})
					.map((item) => (
						<p>{item.nutrient.name}  -  {item.amount} {item.nutrient.unitName} </p>
					))}

				<Title>Vitamins</Title>

				{food.foodNutrients
					.filter((item) => {
						return (
							parseInt(item.nutrient.id) > 1105 &&
							parseInt(item.nutrient.id) < 1247
						);
					})
					.map((item) => (
						<p>{item.nutrient.name}  -  {item.amount} {item.nutrient.unitName}</p>
					))}
			</ion-content>
		</>
	);
};

export default food;

const Title = styled.h2``;
