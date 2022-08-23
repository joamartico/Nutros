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

	const nutrients = foodData[1]?.foodNutrients.map(
		(item, i) => item.nutrient?.name
	);
	// .slice(0, 44);

	async function orderFoodBy(nutrient) {
		await foodData.sort((a, b) => {
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


	function getCoso() {
		// await foodData.map((food, i) => {
		// 	if (foodData[i].split(",") == foodData[i + 1].split(",")) {
		// 		foodData.splice(i + 1);
		// 	}
		// });

		return foodData.filter((food, i) => {
			const splittedFoodA = foodData[i].description.split(", ");
			const splittedFoodB = foodData[i + 1]?.description.split(", ");
			
			if (splittedFoodA.length < 2 || !splittedFoodB) return true;

		

			return (
				splittedFoodA[0] != splittedFoodB[0] ||
				splittedFoodA[1] == "raw" ||
				splittedFoodA[1] == "whole" ||
				splittedFoodA[1] == "NFS"
			);
		});
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
					foodData={getCoso()}
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
