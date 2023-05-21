export function convertToUrl(text) {
	return text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
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
	if(!food?.foodPortions) return null
	const portion1 = food?.foodPortions?.find(
		(item) => item?.sequenceNumber == 1
	);

  if (portion1?.gramWeight > 10 && portion1?.gramWeight < 350)
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
