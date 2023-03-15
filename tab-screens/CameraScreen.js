import { useEffect } from "react";

const CameraScreen = ({ selectedTab, foodData }) => {
	useEffect(() => {
	  foodData.forEach(food => {
		console.log(food.description.split(",")[0] + ': ' + food.emoji )
	  })
	}, [])
	
	function generate() {
		const newFoods = [];

		foodData.forEach((food, i) => {
			setTimeout(() => {
				const foodName = food.description.split(",")[0];

				const requestOptions = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer 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`,
					},
					body: JSON.stringify({
						model: "text-davinci-003",
						prompt: `Convert food into food emoji.\n\nSpinach:🥬 \nOrange:🍊 \n${foodName}:`,
						temperature: 0.8,
						max_tokens: 5,
						top_p: 1.0,
						frequency_penalty: 0.0,
						presence_penalty: 0.0,
						stop: ["\n"],
					}),
					// body: JSON.stringify({
					// 	model: "text-davinci-003",
					// 	prompt: `Convert food name into a emoji.\n\nSpinach: 🥬 \nBeans: 🫘 \nSausage: 🌭 \n${foodName}:`,
					// 	temperature: 0.8,
					// 	max_tokens: 30,
					// 	top_p: 1.0,
					// 	frequency_penalty: 0.0,
					// 	presence_penalty: 0.0,
					// 	stop: ["\n"],
					// }),
				};

				fetch("https://api.openai.com/v1/completions", requestOptions)
					.then((response) => response.json())
					.then((data) => {
						console.log(data);
						console.log(foodName + ": " + data.choices[0].text);
						foodData[i].emoji = data.choices[0].text;
					})
					.catch((error) => console.log(error));
			}, 700 * i);
		});
	}

	return (
		<>
			<ion-header translucent>
				<ion-toolbar>
					<ion-title>Photo your food</ion-title>
				</ion-toolbar>
			</ion-header>

			<ion-content fullscreen class="ion-padding">
				<ion-header collapse="condense">
					<ion-toolbar>
						<ion-title size="large">Photo your food</ion-title>
					</ion-toolbar>
				</ion-header>

				<p
					onClick={() => {
						generate();
					}}
				>
					Convert
				</p>

				<br />
				<br />
				<br />

				<p
					onClick={() => {
						console.log(foodData);
					}}
				>
					In development 😉
				</p>
			</ion-content>
		</>
	);
};

export default CameraScreen;
