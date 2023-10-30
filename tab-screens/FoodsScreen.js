import { useContext, useEffect, useState } from "react";
import IonSelect from "../components/IonSelect";
import SearchFoodList from "../components/SearchFoodList";
import { fattyAcids, minerals, vitamins } from "../nutrients";
import { useRouter } from "next/router";
import {
	getCaloriesDV,
	getCarbsDV,
	getFatDV,
	getFiberDV,
	getFoodPortion,
	getProteinDV,
} from "../utils/functions";
import dv from "../dv.json";
import { Context } from "../Context";

const FoodsScreen = ({ foodData, userData }) => {
	const router = useRouter();
	const [selectedNutrient, setSelectedNutrient] = useState(
		router.query.nutrient || null
	);

	const { setShouldGoBack } = useContext(Context);

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
			(item) =>
				item.nutrient && item.nutrient.name.includes(selectedNutrient)
		);
		const bNutrientObj = b.foodNutrients.find(
			(item) =>
				item.nutrient && item.nutrient.name.includes(selectedNutrient)
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

	const allNutrients = [...vitamins, ...minerals, ...fattyAcids];

	const nutrient = allNutrients.find((nutrient) =>
		nutrient.dbName.includes(selectedNutrient)
	);

	const unit = nutrient?.unit || "";
	const description = nutrient?.description || "";

	const group = userData?.group || "men 19-30";

	function getNutrientTitle(selectedNutrient) {
		if (
			selectedNutrient?.includes("(ALA)") ||
			selectedNutrient?.includes("(EPA)") ||
			selectedNutrient?.includes("(DHA)")
		) {
			return "Omega-3 " + selectedNutrient;
		} else return selectedNutrient;
	}

	function getNutrientDV() {
		if (selectedNutrient?.includes("Protein")) {
			return getProteinDV(userData) + " g";
		}

		if (selectedNutrient?.includes("Energy")) {
			return getCaloriesDV(userData) + " kcal";
		}

		if (selectedNutrient?.includes("Fiber, total dietary")) {
			return getFiberDV(userData) + " g";
		}

		if (selectedNutrient?.includes("Carbohydrate, by difference")) {
			return getCarbsDV(userData) + " g";
		}

		if (selectedNutrient?.includes("Total lipid (fat)")) {
			return getFatDV(userData) + " g";
		}

		return dv[group][selectedNutrient];
	}

	return (
		<>
			<ion-header translucent>
				<ion-toolbar>
					<ion-title>{selectedNutrient || "Nutros"}</ion-title>

					{process.env.NODE_ENV === "development" && (
						<ion-buttons slot="start">
							<ion-button
								onClick={() => router.push("/surveyFoods")}
							>
								Survey
							</ion-button>
						</ion-buttons>
					)}

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
					title={getNutrientTitle(selectedNutrient) || "Nutros"}
					description={
						selectedNutrient &&
						`${description}
						You need ${getNutrientDV()} ${unit} per day`
					}
					foodData={foodData}
				/>
			</ion-content>
		</>
	);
};

export default FoodsScreen;
