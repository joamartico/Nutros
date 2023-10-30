export function convertToUrl(text) {
	return text?.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
}

export function shuffleArray(array) {
	const result = array.slice();
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

export function getFoodPortion(food) {
	if (!food?.foodPortions) return null;
	const portion1 = food?.foodPortions?.find(
		(item) => item?.sequenceNumber == 1
	);

	if (
		(portion1?.gramWeight > 10 ||
			portion1?.measureUnit.name == "teaspoon") &&
		portion1?.gramWeight < 350 &&
		portion1?.modifier != "oz" &&
		!(portion1.portionDescription == "1 slice" && portion1?.gramWeight < 40)
	)
		return portion1;

	const portion2 = food?.foodPortions?.find(
		(item) => item?.sequenceNumber == 2
	);

	if (portion2?.gramWeight > 10 && portion2?.gramWeight < 350)
		return portion2;

	const portion3 = food?.foodPortions?.find(
		(item) => item?.sequenceNumber == 3
	);

	if (portion3?.gramWeight > 10 && portion3?.gramWeight < 350)
		return portion3;

	if (portion1?.gramWeight > 350) {
		return {
			gramWeight: "250",
			sequenceNumber: 1,
			measureUnit: {
				name: "250g",
				abbreviation: "250g",
			},
		};
	}

	return food?.foodPortions[0];
}

function getPortionName(food) {
	if (!food.portions) return "";
	const name = food.foodPortions[0]?.portionDescription;
	if (name?.startsWith("1 ")) {
		return name.substring(2);
	}
	return name;
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
			// splittedFoodA[0] == "plain" ||
			// splittedFoodA[1] == "plain" ||
			// splittedFoodA[2] == "plain" ||
			// splittedFoodA[3] == "plain"
		);
	});
}

export function getProteinDV(userData) {
	if (!userData?.weight || !userData?.physicalActivity) return 75;

	const gPerKg =
		userData?.physicalActivity == "Sedentary"
			? 1
			: userData?.physicalActivity == "Medium"
			? 1.8
			: 2.2;

	return (userData?.weight.replace(" kg", "") * gPerKg).toFixed(0);
}

export function getCaloriesDV(userData) {
	if (
		!userData?.weight ||
		!userData?.physicalActivity ||
		!userData?.age ||
		!userData?.gender
	)
		return 2000;

	const weight = parseFloat(userData.weight.replace(" kg", ""));
	const height = parseFloat(userData.height.replace(" cm", ""));
	const age = parseFloat(userData.age.replace(" years", ""));

	const genderFactor = userData?.gender == "Men" ? 5 : -161;

	const bmr = 10 * weight + 6.25 * height - 5 * age + genderFactor;

	const pal =
		userData?.physicalActivity == "Sedentary"
			? 1.2
			: userData?.physicalActivity == "Medium"
			? 1.55
			: 1.9;
	return (bmr * pal).toFixed(0);
}

export function getFiberDV(userData) {
	if (!userData?.gender || !userData?.age) return 30;

	if (userData.gender == "Men") {
		return userData?.age.replace(" years", "") < 50 ? 38 : 30;
	}

	if (userData.gender == "Women") {
		return userData?.age.replace(" years", "") < 50 ? 25 : 21;
	}
}

export function getCarbsDV(userData) {
	const calories = getCaloriesDV(userData);
	return ((calories * 0.55) / 4).toFixed(0);
}

export function getFatDV(userData) {
	const calories = getCaloriesDV(userData);
	return ((calories * 0.3) / 9).toFixed(0);
}

export function getRecommendedAmount(nutrientDbName, userData) {
	switch (nutrientDbName) {
		case "Protein":
			return getProteinDV(userData);
		case "Energy":
			return getCaloriesDV(userData);
		case "Fiber, total dietary":
			return getFiberDV(userData);
		case "Carbohydrate, by difference":
			return getCarbsDV(userData);
		case "Total lipid (fat)":
			return getFatDV(userData);
		default:
			return 0;
	}
}
