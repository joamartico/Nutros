import { useEffect, useState } from "react";
import IonSelect from "../components/IonSelect";
import SearchFoodList from "../components/SearchFoodList";
import { minerals, vitamins } from "../nutrients";
import Router, { useRouter } from "next/router";
import { getFoodPortion } from "../utils/functions";
import foodData from "../public/foodData_survey.json";

const FoodsScreen = () => {
	const router = useRouter();
	const [selectedNutrient, setSelectedNutrient] = useState(
		router.query.nutrient || null
	);

	useEffect(() => {
		if (selectedNutrient && router.query.nutrient !== selectedNutrient) {
			router.push(
				{ query: { ...router.query, nutrient: selectedNutrient } },
				undefined,
				{ shallow: true }
			);
		}
	}, [selectedNutrient, router]);

	foodData.sort((a, b) => {
		const aNutrientObj = a.foodNutrients.find(
			(item) => item.nutrient && item.nutrient.name === selectedNutrient
		);
		const bNutrientObj = b.foodNutrients.find(
			(item) => item.nutrient && item.nutrient.name === selectedNutrient
		);

		const aAmount = aNutrientObj ? aNutrientObj.amount : 0;
		const bAmount = bNutrientObj ? bNutrientObj.amount : 0;

		const aGramWeight = a.foodPortions[0]
			? getFoodPortion(a).gramWeight
			: 100;
		const bGramWeight = b.foodPortions[0]
			? getFoodPortion(b).gramWeight
			: 100;

		return bAmount * (bGramWeight / 100) - aAmount * (aGramWeight / 100);
	});

	const allNutrients = [...vitamins, ...minerals];

	const newfoods = foodData
		// .sort((a, b) => {
		// 	const nameA = a.description.toUpperCase();
		// 	const nameB = b.description.toUpperCase();

		// 	if (nameA < nameB) {
		// 		return -1;
		// 	}
		// 	if (nameA > nameB) {
		// 		return 1;
		// 	}
		// 	return 0;
		// })
		.filter((food, i) => {
			const nameA = food.description.split(",")[0];
			const nameB = foodData[i + 1]?.description.split(",")[0];
			return nameA !== nameB;
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
								setSelectedNutrient(e.target.value);
								if (!e.target.value) {
									foodData.sort(
										() => Math.random() - Math.random()
									);
								}
							}}
							translucent
							multiple="true"
							interface="alert"
							value={selectedNutrient}
						>
							{allNutrients.map((nutrient) => (
								<ion-select-option
									key={nutrient.shortName}
									value={nutrient.dbName}
								>
									{nutrient.completeName}
								</ion-select-option>
							))}
						</IonSelect>
					</ion-buttons>
				</ion-toolbar>
			</ion-header>

			<ion-content fullscreen>
				<SearchFoodList
					title={selectedNutrient || "Nutros"}
					foodData={foodData}
					survey={true}
				/>
			</ion-content>
		</>
	);
};

export default FoodsScreen;
