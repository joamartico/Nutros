import { useRouter } from "next/router";
import dv from "../../dv.json";
import NutrientItem from "../../components/NutrientItem";
import { minerals, vitamins } from "../../nutrients";
import Head from "next/head";
import Link from "next/link";
import { convertToUrl } from "../../utils/functions";

const food = ({ foodData }) => {
	const router = useRouter();
	const { description } = router.query;

	const food = foodData.find((f) => convertToUrl(f.description).includes(description));

	let omega3 = 0;
	let omega6 = 0;

	const nutrientsHaveN3 = food?.foodNutrients.find((item) =>
		item?.nutrient?.name.includes("n-3")
	);

	const nutrientsHaveN6 = food?.foodNutrients.find((item) =>
		item?.nutrient?.name.includes("n-6")
	);

	food?.foodNutrients.map((item) => {
		if (nutrientsHaveN3) {
			// OMEGA 3
			if (item?.nutrient?.name.includes("n-3")) {
				omega3 = omega3 + item?.amount;
			}
		} else {
			if (
				item?.nutrient?.name.includes("PUFA 18:3") || // ALA
				item?.nutrient?.name.includes("PUFA 18:4") || // SDA
				item?.nutrient?.name.includes("PUFA 20:5") || // EPA
				item?.nutrient?.name.includes("PUFA 22:5") || // DPA
				item?.nutrient?.name.includes("PUFA 22:6") // DHA
			) {
				console.log('contains omega3')
				omega3 = omega3 + item.amount;
			}
		}

		if (nutrientsHaveN6) {
			// OMEGA 6
			if (item?.nutrient?.name.includes("n-6")) {
				omega6 = omega6 + item?.amount;
			}
		} else {
			if (
				item?.nutrient?.name.includes("PUFA 18:2") || // LA
				// item?.nutrient?.name.includes("PUFA 18:3") || // GLA
				item?.nutrient?.name.includes("PUFA 20:3") || // DGLA
				item?.nutrient?.name.includes("PUFA 20:4") // AA
			) {
				omega6 = omega6 + item.amount;
			}
		}

		if (item?.nutrient?.name.includes("PUFA")) {
			console.log("   ");
			console.log(
				item?.nutrient?.name +
					",  " +
					item.amount +
					" " +
					item?.nutrient?.unitName
			);
			console.log(item);
		}
	});

	const group = "men 19-30";

	return (
		<>
			<Head>
				<title>{food?.description} - Nutros</title>
			</Head>
			{console.log(food?.foodNutrients)}
			<ion-header translucent>
				<ion-toolbar>
					<ion-buttons slot="start">
						<Link href="/">
							<ion-button>Back</ion-button>
						</Link>
					</ion-buttons>
					<ion-title>
						<>
							{food?.emoji}&nbsp;&nbsp;
							{food?.description.split(", ")[0]}
						</>
					</ion-title>
				</ion-toolbar>
			</ion-header>

			<ion-content fullscreen>
				<ion-header collapse="condense">
					<ion-toolbar>
						<ion-title size="large" style={{ height: 50 }}>
							{food?.emoji}&nbsp;{food?.description}
						</ion-title>
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
						Vitamins
					</ion-list-header>

					{vitamins.map((vitamin) => {
						const nutrient = food?.foodNutrients.find(
							(item) => vitamin.dbName == item?.nutrient?.name
						);

						return (
							<NutrientItem
								dbName={vitamin.dbName}
								completeName={vitamin.completeName}
								amount={
									nutrient?.amount *
										(food?.foodPortions[0]?.gramWeight /
											100) || nutrient?.amount
								}
								recommendedAmount={dv[group][vitamin.dbName]}
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
							if (dv.vitamins[group][item?.nutrient?.name]) {
								return (
									<NutrientItem
										name={item?.nutrient?.name}
										amount={
											item.amount *
												(food.foodPortions[0]
													?.gramWeight /
													100) || item.amount
										}
										unitName={item?.nutrient.unitName}
									/>
								);
							}
						})} */}
				</ion-list>

				<ion-list>
					<ion-list-header>
						Minerals
					</ion-list-header>

					{minerals.map((mineral) => {
						const nutrient = food?.foodNutrients.find(
							(item) => mineral.dbName == item?.nutrient?.name
						);

						return (
							<NutrientItem
								dbName={mineral.dbName}
								completeName={mineral.completeName}
								amount={
									nutrient?.amount *
										(food?.foodPortions[0]?.gramWeight /
											100) || nutrient?.amount
								}
								recommendedAmount={dv[group][mineral.dbName]}
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
								name={item?.nutrient?.name}
								amount={
									item.amount *
										(food.foodPortions[0]?.gramWeight /
											100) || item.amount
								}
								unitName={item?.nutrient.unitName}
							/>
						))} */}
				</ion-list>

				<ion-list>
					<ion-list-header>
						Fats
					</ion-list-header>

					<NutrientItem
						name="Omega-3"
						completeName="Omega-3"
						dbName="Omega-3"
						amount={
							omega3 *
								(food?.foodPortions[0]?.gramWeight / 100) ||
							omega3
						}
						unitName={"g"}
						recommendedAmount={dv[group]["Omega-3"]}
					/>

					<NutrientItem
						name="Omega-6"
						completeName="Omega-6"
						dbName="Omega-6"
						amount={
							omega6 *
								(food?.foodPortions[0]?.gramWeight / 100) ||
							omega6
						}
						recommendedAmount={dv[group]["Omega-6"]}
						unitName={"g"}
					/>
				</ion-list>

				<ion-list>
					<ion-list-header>
						General
					</ion-list-header>

					{food?.foodNutrients
						.filter((item) => {
							// console.log(item?.nutrient?.name, item.amount);

							return (
								// parseInt(item.nutrient?.id) > 1086 &&
								parseInt(item.nutrient?.id) < 1087
							);
						})
						.map((item) => (
							<NutrientItem
								completeName={item?.nutrient?.name}
								dbName={item?.nutrient?.name}
								amount={
									item.amount *
										(food?.foodPortions[0]?.gramWeight /
											100) || item.amount
								}
								unitName={item?.nutrient.unitName}
								// recommendedAmount={100}
							/>
						))}
				</ion-list>
			</ion-content>
		</>
	);
};

export default food;
