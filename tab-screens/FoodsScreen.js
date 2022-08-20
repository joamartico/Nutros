import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";
import IonSearchbar from "../components/IonSearchbar";
import IonSelect from "../components/IonSelect";
import SearchFoodList from "../components/SearchFoodList";
import useGlobalState from "../hooks/useGlobalState";
import { minerals, vitamins } from "../nutrients";

const FoodsScreen = ({ foodData }) => {
	const [selectedNutrient, setSelectedNutrient] = useState(true);
	const { setFood } = useGlobalState();
	const router = useRouter();

	const nutrients = foodData.surveyFoods[1]?.foodNutrients.map(
		(item, i) => item.nutrient?.name
	);
	// .slice(0, 44);

	async function orderFoodBy(nutrient) {
		await foodData.surveyFoods.sort((a, b) => {
			return (
				b.foodNutrients.find((item) => item.nutrient?.name === nutrient)
					?.amount *
					(b.foodPortions[0]?.gramWeight / 100) -
				a.foodNutrients.find((item) => item.nutrient?.name === nutrient)
					?.amount *
					(a.foodPortions[0]?.gramWeight / 100)
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
					foodData={foodData}
					onClickItem={(food) => {
						setFood(food);
						router.push("/food/" + food.fdcId);
					}}
				/>
			</ion-content>
		</>
	);
};

export default FoodsScreen;
