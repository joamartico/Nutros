import { useEffect, useState } from "react";
import IonSelect from "../components/IonSelect";
import SearchFoodList from "../components/SearchFoodList";
import { minerals, vitamins } from "../nutrients";
import { useRouter } from "next/router";


const FoodsScreen = ({ foodData }) => {
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

		const aGramWeight =
			a.foodPortions[0] && a.foodPortions[0].gramWeight
				? a.foodPortions[0].gramWeight
				: 100;
		const bGramWeight =
			b.foodPortions[0] && b.foodPortions[0].gramWeight
				? b.foodPortions[0].gramWeight
				: 100;

		return bAmount * (bGramWeight / 100) - aAmount * (aGramWeight / 100);
	});

	const allNutrients = [...vitamins, ...minerals];

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
								if(!e.target.value){
									foodData.sort(() => Math.random() - Math.random());
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
				/>
			</ion-content>
		</>
	);
};

export default FoodsScreen;
