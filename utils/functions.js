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