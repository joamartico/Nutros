import { modalController } from "@ionic/core";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import FoodItem from "../components/FoodItem";
import SearchFoodList from "../components/SearchFoodList";

const vitamins = [
	"Vitamin A",
	"Vitamin B1",
	"Vitamin B2",
	"Vitamin B3",
	"Vitamin B5",
	"Vitamin B6",
	"Vitamin B9",
	"Vitamin B12",
	"Vitamin C",
	"Vitamin D",
	"Vitamin E",
	"Vitamin K"
];

const MeScreen = ({ foodData }) => {
	const [foods, setFoods] = useState([]);
	const [selectedIndex, setSelectedIndex] = useState();
	const [currentModal, setCurrentModal] = useState();

	const pageRef = useRef();
	const modalRef = useRef();

	async function openModal() {
		window.modalController = await modalController; // necesario?
		const modal = await modalController.create({
			component: modalRef.current,
			swipeToClose: true,
			// ...opts,
		});
		modal.present();

		setCurrentModal(modal);

		// modal.onDidDismiss().then(() => {
		// 	setCurrentModal(null);
		// }
		// );
	}

	function openCardModal() {
		openModal({
			swipeToClose: true,
			presentingElement: pageRef.current,
		});
	}

	function dismissModal() {
		if (currentModal) {
			currentModal.dismiss().then(() => {
				setCurrentModal(null);
			});
		} else {
			console.log("no modal to dismiss");
		}
	}

	return (
		<div ref={pageRef} class="ion-page" className="ion-page">
			<ion-header translucent>
				<ion-toolbar>
					<ion-title>Your Daily Nutrition</ion-title>
				</ion-toolbar>
			</ion-header>

			<ion-content fullscreen>
				<ion-header collapse="condense">
					<ion-toolbar>
						<ion-title size="large">Your Daily Nutrition</ion-title>
					</ion-toolbar>
				</ion-header>

				<br />

				<ion-list>
					<ion-list-header>
						<h2>Today</h2>
					</ion-list-header>

					{foods.map((food, i) => {
						return (
							<FoodItem
								name={food.description}
								amount={
									food.foodPortions
										? food.foodPortions[0].gramWeight
										: ""
								}
								onClick={() => {
									openCardModal();
									setSelectedIndex(i);
								}}
							/>
						);
					})}

					<AddButton
						onClick={() =>
							setFoods((prev) => [
								...prev,
								{ description: "Search Food" },
							])
						}
					>
						Add Food
					</AddButton>
				</ion-list>

				<ion-list>
					<ion-list-header>
						<h2>Vitamins</h2>
					</ion-list-header>
				</ion-list>

				<ion-list>
					<ion-list-header>
						<h2>Minerals</h2>
					</ion-list-header>
				</ion-list>
			</ion-content>

			<div ref={modalRef}>
				<ion-header translucent>
					<ion-toolbar>
						<ion-title>Search your Food</ion-title>
						<ion-buttons slot="end">
							<ion-button onClick={dismissModal}>
								Close
							</ion-button>
						</ion-buttons>
					</ion-toolbar>
				</ion-header>

				<ion-content fullscreen>
					<SearchFoodList
						foodData={foodData}
						noTitle
						onClickItem={(food) => {
							console.log("food: ", food);
							setFoods((prev) => {
								prev[selectedIndex] = food;
								return [...prev];
							});
							dismissModal();
						}}
					/>
				</ion-content>
			</div>
		</div>
	);
};

export default MeScreen;

const AddButton = styled.div`
	background-color: var(--ion-color-primary);
	border-radius: 12px;
	padding: 16px;
	width: fit-content;
	height: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: auto;
	margin-right: auto;
	margin-top: 10px;
	margin-bottom: 20px;
	cursor: pointer;
	font-size: 16px;
	font-weight: bold;
`;
