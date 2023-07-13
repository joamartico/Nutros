import { useContext, useEffect, useState } from "react";
import IonSelect from "../components/IonSelect";
import SearchFoodList from "../components/SearchFoodList";
import { minerals, vitamins } from "../nutrients";
import { useRouter } from "next/router";
import { getFoodPortion } from "../utils/functions";
import dv from "../dv.json";
import { Context } from "../Context";

const FoodsScreen = ({ foodData, userData }) => {
	const router = useRouter();
	const [selectedNutrient, setSelectedNutrient] = useState(
		router.query.nutrient || null
	);

	const {setShouldGoBack } = useContext(Context);

	useEffect(() => {
		if (selectedNutrient && router.query.nutrient !== selectedNutrient) {
			router.push(
				{ query: { ...router.query, nutrient: selectedNutrient } },
				undefined,
				{ shallow: true }
			);
		}
		setShouldGoBack(selectedNutrient ? true : false);
	}, [selectedNutrient, router]);

	foodData.sort((a, b) => {
		if (!a.foodPortions || !b.foodPortions) return 1;
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

	const nutrient = allNutrients.find(
		(nutrient) => nutrient.dbName === selectedNutrient
	);

	const unit = nutrient?.unit || "";
	const description = nutrient?.description || "";

	const group = userData?.group || "men 19-30";

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
							multiple="false"
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
					description={
						selectedNutrient &&
						`${description}
						You need ${dv[group][selectedNutrient]} ${unit} per day`
					}
					foodData={foodData}
				/>
			</ion-content>
		</>
	);
};

export default FoodsScreen;
