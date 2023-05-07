export function convertToUrl(text) {
  return text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')
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