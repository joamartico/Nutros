import { modalController } from "@ionic/core";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import FoodItem from "../components/FoodItem";
import PercentCircle from "../components/PercentCircle";
import SearchFoodList from "../components/SearchFoodList";
import dv from "../dv.json";
import { minerals, vitamins } from "../nutrients";

const group = "men 19-30";

function getPortionName(food) {
	if (!food.portions) return "";
	const name = food.foodPortions[0].portionDescription;
	if (name?.startsWith("1 ")) {
		return name.substring(2);
	}
	return name;
}

const MeScreen = ({ foodData }) => {
	const [foods, setFoods] = useState([]);
	const [currentModal, setCurrentModal] = useState();

	const pageRef = useRef();
	const modalRef = useRef();


	async function openModal(opts = {}) {
		window.modalController = await modalController; // necesario?
		const modal = await modalController.create({
			component: modalRef.current,
			...opts,
		});
		modal.present();

		setCurrentModal(modal);
	}

	function openCardModal() {
		openModal({
			swipeToClose: true,
			presentingElement: pageRef.current,
		});
	}

	function openSheetModal() {
		openModal({
			breakpoints: [0, 0.2, 0.5, 1],
			initialBreakpoint: 0.2,
			swipeToClose: true,
		});
	}

	function dismissModal() {
		if (currentModal) {
			currentModal.dismiss().then(() => {
				setCurrentModal(null);
			});
		}
	}

	function getDVPercent(nutrientName, nutrientType) {
		let amountSum = 0;
		foods.map((food) => {
			food.foodNutrients.map((item) => {
				if (item.nutrient?.name === nutrientName) {
					amountSum +=
						item.amount *
						(food.foodPortions[0].gramWeight / 100) *
						food.portions;
				}
			});
		});

		return (
			(amountSum / dv[nutrientType][group][nutrientName]) *
			100
		).toFixed(0);
	}

	return (
		<>
			{/* <Head>
				<title>Your Daily Nutrition - Nutros</title>
			</Head> */}

			<div ref={pageRef} class="ion-page" className="ion-page">
				<ion-header translucent>
					<ion-toolbar>
						<ion-title>Your Daily Nutrition</ion-title>
					</ion-toolbar>
				</ion-header>

				<ion-content fullscreen>
					<ion-header collapse="condense">
						<ion-toolbar>
							<ion-title size="large">
								Your Daily Nutrition
							</ion-title>
						</ion-toolbar>
					</ion-header>

					<br />

					<ion-list>
						<ion-list-header>
							<h2>Today</h2>
						</ion-list-header>

						{foods.map((food, i) => {
							return (
								<Link href={`/food/${food.fdcId}`}>
									<FoodItem
										name={food.description}
										amount={
											food.foodPortions
												? food.foodPortions[0]
														.gramWeight
												: ""
										}
										portionName={getPortionName(food)}
										// onClick={() => {
										// 	router.push("/food/" + food.fdcId);
										// }}
										onAdd={() => {
											const newFoods = [...foods];
											newFoods[i].portions += 1;
											setFoods(newFoods);
										}}
										onRemove={() => {
											const newFoods = [...foods];
											newFoods[i].portions -= 1;
											if (newFoods[i].portions === 0) {
												newFoods.splice(i, 1);
											}
											setFoods(newFoods);
										}}
										portions={food.portions}
									/>
								</Link>
							);
						})}

						<AddButton onClick={openCardModal}>Add Food</AddButton>
					</ion-list>

					<ion-list>
						<ion-list-header>
							<h2>Vitamins</h2>
						</ion-list-header>

						<Row className="ion-padding">
							{vitamins.map((vitamin, i) => {
								return (
									<PercentCircle
										num={getDVPercent(
											vitamin.dbName,
											"vitamins"
										)}
										name={vitamin.shortName}
									/>
								);
							})}
						</Row>
					</ion-list>

					<ion-list>
						<ion-list-header>
							<h2>Minerals</h2>
						</ion-list-header>

						<Row className="ion-padding">
							{minerals.map((mineral, i) => {
								return (
									<PercentCircle
										num={getDVPercent(
											mineral.dbName,
											"minerals"
										)}
										name={mineral.shortName}
									/>
								);
							})}
						</Row>
					</ion-list>
				</ion-content>
			</div>

			<Modal ref={modalRef} currentModal={currentModal ? true : false}>
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
							setFoods((prev) => [
								...prev,
								{ ...food, portions: 1 },
							]);
							dismissModal();
						}}
						noLink={true}
					/>
				</ion-content>
			</Modal>
		</>
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
	font-size: 15px;
	font-weight: bold;
	color: #040;
`;

const Modal = styled.div`
	display: ${({ currentModal }) => (currentModal ? "block" : "none")};
`;

const Row = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
	overflow-x: scroll;
	white-space: nowrap;
	scrollbar-width: none;
	::-webkit-scrollbar {
		display: none;
	}
`;
