import useAuth from "../hooks/useAuth";
import SearchFoodList from "../components/SearchFoodList";
import foodData_survey from "../public/foodData_survey.json";
import foodData_foundation from "../public/foodData_foundation.json";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

let newFoodData = foodData_foundation;

const surveyFoods = () => {
	const user = useAuth();

	async function getEmoji(foodName) {
		const response = await fetch(API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${OPENAI_API_KEY}`,
			},
			body: JSON.stringify({
				model: "gpt-3.5-turbo",
				max_tokens: 3,
				messages: [
					{
						role: "system",
						content:
							"return only one emoji that represents the food",
					},
					{ role: "user", content: "tomato" },
					{ role: "assistant", content: "🍅" },
					{ role: "user", content: "orange juice" },
					{ role: "assistant", content: "🍊" },
					{ role: "user", content: foodName },
				],
				temperature: 0.2,
			}),
		});

		const data = await response.json();
		const emoji = data.choices[0].message.content;
		return emoji;
	}

	async function addFoodToFoundationJson(food) {
		const newFoodEmoji = await getEmoji(food.description);
		console.log(newFoodEmoji);
		food.emoji = newFoodEmoji;
		newFoodData = [...newFoodData, food];
		console.log(newFoodData);
		navigator.clipboard.writeText(JSON.stringify(newFoodData, null, 2));

		fetch("/api/addFood", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(food),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Success:", data);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}

	return (
		<ion-content fullscreen>
			<SearchFoodList
				title={"Nutros"}
				foodData={foodData_survey}
				noLink
				onClickItem={(food) => {
					if (user.email === "joamartico@gmail.com") {
						confirm("Add " + food.description + " to json?")
							? addFoodToFoundationJson(food)
							: console.log("bye");
					}
				}}
			/>
		</ion-content>
	);
};

export default surveyFoods;
