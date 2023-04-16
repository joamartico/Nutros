import Head from "next/head";
import { useState } from "react";
import IonSelect from "../components/IonSelect";
import SearchFoodList from "../components/SearchFoodList";
import useGlobalState from "../hooks/useGlobalState";
import { minerals, vitamins } from "../nutrients";

const FoodsScreen = ({ foodData }) => {
	const [selectedNutrient, setSelectedNutrient] = useState();
	const { setFood } = useGlobalState();

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

	function getFilteredFoods() {
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
			{/* <Head>
				<title>Foods - Nutros: </title>
			</Head> */}

			<ion-header translucent>
				<ion-toolbar>
					<ion-title>{selectedNutrient || "Nutros"}</ion-title>

					<ion-buttons slot="end">
						<ion-button>Order By</ion-button>

						<IonSelect
							onChange={(e) => {
								// orderFoodBy(e.target.value[0]);
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
					foodData={
						!selectedNutrient
							? foodData
							: foodData
									.filter(
										(item) =>
											item.foodNutrients.find(
												(itemb) =>
													itemb.nutrient?.name ==
													selectedNutrient
											)?.amount
									)
									.sort((a, b) => {
										return (
											b.foodNutrients.find(
												(itemc) =>
													itemc.nutrient?.name ==
													selectedNutrient
											)?.amount *
												b.foodPortions[0]?.gramWeight -
											a.foodNutrients.find(
												(itemc) =>
													itemc.nutrient?.name ==
													selectedNutrient
											)?.amount *
												a.foodPortions[0]?.gramWeight
										);
									})
					}
					onClickItem={(food) => {
						setFood(food);
						// router.push("/food/" + food.fdcId);
					}}
				/>
			</ion-content>
		</>
	);
};

export default FoodsScreen;
