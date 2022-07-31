import { useRouter } from "next/router";
import styled from "styled-components";
import useGlobalState from "../../hooks/useGlobalState";
import IonSearchbar from "../../components/IonSearchbar";



const food = () => {
	const router = useRouter();
	// const {id} = router.query;

	const { food } = useGlobalState();

		

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

				<Title>Minerals</Title>

				{food?.foodNutrients
					.filter((item) => {
						return (
							parseInt(item.nutrient.id) > 1086 &&
							parseInt(item.nutrient.id) < 1105
						);
					})
					.map((item) => (
						<p>
							{item.nutrient.name} - {item.amount}{" "}
							{item.nutrient.unitName}{" "}
						</p>
					))}

				<Title>Vitamins</Title>

				{food?.foodNutrients
					.filter((item) => {
						return (
							parseInt(item.nutrient.id) > 1105 &&
							parseInt(item.nutrient.id) < 1247
						);
					})
					.map((item) => (
						<p>
							{item.nutrient.name} - {item.amount}{" "}
							{item.nutrient.unitName}
						</p>
					))}
			</ion-content>
		</>
	);
};

export default food;

const Title = styled.h2``;
