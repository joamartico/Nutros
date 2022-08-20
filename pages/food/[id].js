import { useRouter } from "next/router";
import styled from "styled-components";
import useGlobalState from "../../hooks/useGlobalState";
import IonSearchbar from "../../components/IonSearchbar";

import dv from "../../dv.json";
import NutrientItem from "../../components/NutrientItem";
import { minerals, vitamins } from "../../nutrients";

const food = ({ foodData }) => {
	const router = useRouter();
	const { id } = router.query;

	const food = foodData.foundationFoods.find((f) => f.fdcId == id);

	console.log(food);

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
					</ion-toolbar>
					<ion-toolbar>
						<ion-text class="ion-padding">
							<span class="ion-text-capitalize">
								{food?.foodPortions[0]?.portionDescription ||
									food?.foodPortions[0]?.measureUnit.name ||
									food?.foodPortions[0]?.modifier ||
									"Portion"}{" "}
							</span>
							({food?.foodPortions[0]?.gramWeight || 100} grams)
						</ion-text>
					</ion-toolbar>
				</ion-header>

				<ion-list>
					<ion-list-header>
						<h2>Vitamins</h2>
					</ion-list-header>

					{vitamins.map((vitamin) => {
						const nutrient = food?.foodNutrients.find(
							(item) => vitamin.dbName == item?.nutrient?.name
						);

						return (
							<NutrientItem
								dbName={vitamin.dbName}
								completeName={vitamin.completeName}
								group={dv.vitamins[group]}
								amount={
									nutrient?.amount *
										(food?.foodPortions[0]?.gramWeight /
											100) || nutrient?.amount
								}
								unitName={nutrient?.nutrient.unitName}
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
							if (dv.vitamins[group][item?.nutrient.name]) {
								return (
									<NutrientItem
										name={item?.nutrient.name}
										amount={
											item.amount *
												(food.foodPortions[0]
													?.gramWeight /
													100) || item.amount
										}
										unitName={item?.nutrient.unitName}
										group={dv.vitamins[group]}
									/>
								);
							}
						})} */}
				</ion-list>

				<ion-list>
					<ion-list-header>
						<h2>Minerals</h2>
					</ion-list-header>

					{minerals.map((mineral) => {
						const nutrient = food?.foodNutrients.find(
							(item) => mineral.dbName == item?.nutrient?.name
						);

						return (
							<NutrientItem
								dbName={mineral.dbName}
								completeName={mineral.completeName}
								group={dv.minerals[group]}
								amount={
									nutrient?.amount *
										(food?.foodPortions[0]?.gramWeight /
											100) || nutrient?.amount
								}
								unitName={nutrient?.nutrient.unitName}
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
								name={item?.nutrient.name}
								amount={
									item.amount *
										(food.foodPortions[0]?.gramWeight /
											100) || item.amount
								}
								unitName={item?.nutrient.unitName}
								group={dv.minerals[group]}
							/>
						))} */}
				</ion-list>

				<ion-list>
					<ion-list-header>
						<h2>General</h2>
					</ion-list-header>

					{food?.foodNutrients
						.filter((item) => {
							console.log(item?.nutrient.name, item.amount);

							return (
								// parseInt(item.nutrient?.id) > 1086 &&
								parseInt(item.nutrient?.id) < 1087
							);
						})
						.map((item) => (
							<NutrientItem
								completeName={item?.nutrient.name}
								dbName={item?.nutrient.name}
								amount={
									item.amount *
										(food?.foodPortions[0]?.gramWeight /
											100) || item.amount
								}
								unitName={item?.nutrient.unitName}
								group={dv.minerals[group]}
							/>
						))}
				</ion-list>
			</ion-content>
		</>
	);
};

export default food;
