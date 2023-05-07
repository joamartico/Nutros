import Head from "next/head";
import { useState } from "react";
import IonSelect from "../components/IonSelect";
import SearchFoodList from "../components/SearchFoodList";
import useGlobalState from "../hooks/useGlobalState";
import { minerals, vitamins } from "../nutrients";

const FoodsScreen = ({ foodData }) => {
	const [selectedNutrient, setSelectedNutrient] = useState();


	const orderedFoods = foodData
		.sort((a, b) => {
			const aNutrientObj = a.foodNutrients.find(
				(item) =>
					item.nutrient && item.nutrient.name === selectedNutrient
			);
			const bNutrientObj = b.foodNutrients.find(
				(item) =>
					item.nutrient && item.nutrient.name === selectedNutrient
			);

			const aAmount = aNutrientObj ? aNutrientObj.amount : 0;
			const bAmount = bNutrientObj ? bNutrientObj.amount : 0;

			const aGramWeight =
				a.foodPortions[0] && a.foodPortions[0].gramWeight
					? a.foodPortions[0].gramWeight
					: 100;
			const bGramWeight =
				b.foodPortions[0] && b.foodPortions[0].gramWeight
					? b.foodPortions[0].gramWeight
					: 100;

			return (
				bAmount * (bGramWeight / 100) - aAmount * (aGramWeight / 100)
			);
		});

	return (
		<>

			<ion-header translucent>
				<ion-toolbar>
					<ion-title>{selectedNutrient || "Nutros"}</ion-title>

					<ion-buttons slot="end">
						<ion-button>Order By</ion-button>

						<IonSelect
							onChange={(e) => {
								setSelectedNutrient(e.target.value[0]);
							}}
							translucent
							multiple="true"
							interface="alert"
							value={selectedNutrient}
						>
							{vitamins.map((vitamin) => (
								<ion-select-option
									key={vitamin.shortName}
									value={vitamin.dbName}
								>
									{vitamin.completeName}
								</ion-select-option>
							))}
							{minerals.map((mineral) => (
								<ion-select-option
									key={mineral.shortName}
									value={mineral.dbName}
								>
									{mineral.completeName}
								</ion-select-option>
							))}
						</IonSelect>
					</ion-buttons>
				</ion-toolbar>
			</ion-header>

			<ion-content fullscreen>
				<SearchFoodList
					title={selectedNutrient || "Nutros"}
					foodData={!selectedNutrient ? foodData : orderedFoods}
				/>
			</ion-content>
		</>
	);
};

export default FoodsScreen;
