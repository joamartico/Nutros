import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { macronutients, minerals, vitamins } from "../nutrients";
import dv from "../dv.json";
import { getRecommendedAmount } from "../utils/functions";
import NutrientItem from "../components/NutrientItem";
const API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

function extractNumber(str) {
	const match = str.match(/-?\d*\.?\d+/);
	return match ? parseFloat(match[0]) : null;
}

const CameraScreen = ({ selectedTab, foodData, userData }) => {
	const [capturedImage, setCapturedImage] = useState(null);
	const [food, setFood] = useState();

	const group = userData?.group || "men 19-30";

	const videoRef = useRef();

	const getVideo = () => {
		navigator.mediaDevices
			?.getUserMedia({
				video: { facingMode: "environment" },
				audio: false,
			})
			.then((stream) => {
				let video = videoRef.current;
				console.log(stream);
				video.srcObject = stream;
				video.play();
			})
			.catch((err) => console.log(err));
	};

	async function askToGpt(base64_image) {
		const response = await fetch(API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${API_KEY}`,
			},
			body: JSON.stringify({
				model: "gpt-4-vision-preview",
				messages: [
					{
						role: "system",
						content:
							"You are a nutrient analizer. The user will provide you a food image and you will return a json with nutritional information of the food. Format: {description, emoji, amount, Calories, Protein, Fat, Carbs, A, B1, B2, B3, B6, B9, B12, C, D, E, K, Choline, Calcium, Copper, Iron, Magnesium, Potassium, Phosphorus, Selenium, Zinc, ALA, DHA, EPA} Respond directly with the JSON, nothing else, no matter what. Use grams instead of oz.",
						// "The user will provide you a food image and you will return a json with nutritional information (vitamins, minerals, macronutrients, calories, etc) of the food. Respond directly with the JSON, nothing else. Use grams instead of oz.",
					},
					{
						role: "user",
						content: [
							{
								type: "text",
								text: "",
							},
							{
								type: "image_url",
								image_url: {
									url: base64_image,
									detail: "low",
								},
							},
						],
					},
				],
				temperature: 0.1,
				// stop: ["\ninfo:"],
				max_tokens: 600,
			}),
		});

		const data = await response.json();
		console.log("data: ", data);
		console.log(data.choices[0].message.content);
		// if data.choices[0].message.content is not a JSON
		if (data.choices[0].message.content[0] != "{") {
			setCapturedImage(null);
			setFood(null);
			alert(data.choices[0].message.content);
			return;
		}
		const foodJson = JSON.parse(data.choices[0].message.content);
		setFood(foodJson);
	}

	useEffect(() => {
		if (selectedTab == "camera") {
			getVideo();
			getVideo();
		}
	}, [selectedTab, capturedImage]);

	return (
		<>
			{/* <ion-header>
				<ion-toolbar>
					<ion-title>Photo your food</ion-title>
				</ion-toolbar>
			</ion-header> */}
			<ion-header translucent>
				<ion-toolbar>
					<ion-buttons slot="start">
						{/* <a href="/"> */}
						<ion-button
							onClick={() => {
								setCapturedImage(null);
								setFood(null);
							}}
						>
							<ion-icon src="/svg/chevron-back.svg" />
						</ion-button>
						{/* </a> */}
					</ion-buttons>
					<ion-title>
						<>
							{food?.emoji}&nbsp;&nbsp;
							{food?.description?.split(", ")[0]}
						</>
					</ion-title>
				</ion-toolbar>
			</ion-header>

			<ion-content fullscreen class="ion-padding">
				{!capturedImage && !food && (
					<>
						<CameraVideo
							ref={videoRef}
							muted
							autoPlay={true}
							playsInline={true}
						/>
						<CaptureButton
							onClick={() => {
								const canvas = document.createElement("canvas");
								canvas.width = videoRef.current.videoWidth;
								canvas.height = videoRef.current.videoHeight;
								canvas
									.getContext("2d")
									.drawImage(
										videoRef.current,
										0,
										0,
										canvas.width,
										canvas.height
									);
								const data = canvas.toDataURL("image/jpeg");
								console.log(data);
								setCapturedImage(data); // Guarda la imagen capturada
								askToGpt(data);
							}}
						>
							<ion-icon src="/svg/camera.svg" size="large" />
						</CaptureButton>
					</>
				)}

				{capturedImage && !food && (
					<>
						<Spinner>
							<ion-spinner
								style={{
									width: 70,
									height: 70,
									display: "flex",
									color: "#7ed445",
								}}
								name="crescent"
							/>
						</Spinner>
						<CapturedImage src={capturedImage} alt="Captured" />
					</>
				)}

				{food && (
					<>
						<ion-header collapse="condense">
							<ion-toolbar>
								<h1>
									<ion-title
										size="large"
										style={{ height: 50 }}
									>
										{food?.emoji}&nbsp;
										{food?.description}
									</ion-title>
								</h1>
							</ion-toolbar>
						</ion-header>

						<ion-list>
							<ion-list-header>Macronutrients</ion-list-header>

							{macronutients.map((macronutrient) => {
								const nutrient =
									food?.[macronutrient.shortName];

								if (!nutrient) return null;

								return (
									<NutrientItem
										dbName={macronutrient.dbName}
										completeName={
											macronutrient.completeName
										}
										amount={extractNumber(nutrient)}
										recommendedAmount={getRecommendedAmount(
											macronutrient.dbName,
											userData
										)}
										// unitName={
										// 	nutrient?.nutrient.unitName
										// }
										onClick={() => console.log(nutrient)}
										url={`/?nutrient=${macronutrient.dbName}`}
									/>
								);
							})}
						</ion-list>

						<ion-list>
							<ion-list-header>Vitamins</ion-list-header>

							{vitamins.map((vitamin) => {
								const nutrient = food?.[vitamin.shortName];
								console.log("vitamin", vitamin);
								console.log("nutrient", nutrient);

								if (!nutrient) return null;

								return (
									<NutrientItem
										dbName={vitamin.dbName}
										completeName={vitamin.completeName}
										amount={extractNumber(nutrient)}
										recommendedAmount={
											dv[group][vitamin.dbName]
										}
										// unitName={
										// 	nutrient?.nutrient.unitName
										// }
										onClick={() => console.log(nutrient)}
										url={`/?nutrient=${vitamin.dbName}`}
									/>
								);
							})}
						</ion-list>

						<ion-list>
							<ion-list-header>Minerals</ion-list-header>

							{minerals.map((mineral) => {
								const nutrient = food?.[mineral.shortName];
								console.log("mineral", mineral);
								console.log("nutrient", nutrient);

								if (!nutrient) return null;

								return (
									<NutrientItem
										dbName={mineral.dbName}
										completeName={mineral.completeName}
										amount={extractNumber(nutrient)}
										recommendedAmount={
											dv[group][mineral.dbName]
										}
										// unitName={
										// 	nutrient?.nutrient.unitName
										// }
										onClick={() => console.log(nutrient)}
										url={`/?nutrient=${mineral.dbName}`}
									/>
								);
							})}
						</ion-list>
					</>
				)}
			</ion-content>
		</>
	);
};

export default CameraScreen;

const CameraVideo = styled.video`
	position: fixed;
	top: 0;
	left: 50%;
	transform: translate(-50%);
	height: 100vh;
	width: auto;
	z-index: 999999998 !important;
`;
const CaptureButton = styled.div`
	z-index: 999999999 !important;
	border-radius: 50%;
	background-color: white;
	height: 80px;
	width: 80px;
	position: fixed;
	bottom: 20px;
	left: 50%;
	transform: translate(-50%);
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	transition: all 0.1s ease-in-out;
	&:active {
		transform: translate(-50%) scale(0.9);
	}

	&:hover {
		transform: translate(-50%) scale(1.1);
	}

	&:hover > ion-icon {
		transform: scale(1.2);
	}
`;
const CapturedImage = styled.img`
	position: fixed;
	top: 0;
	left: 50%;
	transform: translate(-50%);
	height: 100vh;
	width: 100vw;
	/* do not deform the image */
	object-fit: cover;
`;

const Spinner = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin: auto auto;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	height: 70px;
	width: 70px;
	z-index: 99999999999999999999999999999999999 !important;
`;
