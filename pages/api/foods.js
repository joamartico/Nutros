import foodData from "../../foodData.json";

export default function handler(req, res) {
	res.status(200).json(foodData.SurveyFoods);
}
