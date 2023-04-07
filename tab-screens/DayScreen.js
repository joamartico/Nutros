import { modalController } from "@ionic/core";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import FoodItem from "../components/FoodItem";
import IonModal from "../components/IonModal";
import PercentCircle from "../components/PercentCircle";
import SearchFoodList from "../components/SearchFoodList";
import dv from "../dv.json";
import { minerals, vitamins } from "../nutrients";

const group = "men 19-30";

const realDate = new Date()
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


function getPortionName(food) {
	if (!food.portions) return "";
	const name = food.foodPortions[0].portionDescription;
	if (name?.startsWith("1 ")) {
		return name.substring(2);
	}
	return name;
}

const DayScreen = ({ foodData }) => {
	const [foods, setFoods] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [date	, setDate	] = useState(realDate)
	const newDate = new Date(date)

	const modalRef = useRef();

	const router = useRouter();

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
				<title>Todays Nutrition - Nutros</title>
			</Head> */}

			<ion-header translucent>
				<ion-toolbar>
					<ion-title>{days[newDate.getDay()]}</ion-title>
				</ion-toolbar>
			</ion-header>

			<ion-content fullscreen>
				<ion-header collapse="condense">
					<ion-toolbar>
						<Header>
							<ion-icon
								name="chevron-back"
								src="/svg/chevron-back.svg"
								style={{ marginRight: 20, cursor: "pointer" }}
								color="primary"
								onClick={() => setDate(prev => new Date(date).setHours(-24))}
							/>
							<div style={{ height: 34, lineHeight: 1 }}>
								{days[newDate.getDay()]}
							</div>
							<ion-icon
								name="chevron-forward"
								src="/svg/chevron-forward.svg"
								style={{ marginLeft: 20, cursor: "pointer" }}
								color="primary"
								onClick={() => setDate(prev => new Date(date).setHours(24))}
							/>
						</Header>
					</ion-toolbar>
				</ion-header>

				<br />

				<ion-list>
					<ion-list-header>
						<h2>Ingests</h2>
					</ion-list-header>

					{foods.map((food, i) => {
						return (
							// <Link href={`/food/${food.fdcId}`}>
							<FoodItem
								name={food.description}
								emoji={food.emoji}
								amount={
									food.foodPortions
										? food.foodPortions[0].gramWeight
										: ""
								}
								portionName={getPortionName(food)}
								onClick={() => {
									router.push("/food/" + food.fdcId);
								}}
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
							// </Link>
						);
					})}

					<AddButton
						onClick={() => {
							setModalOpen((prev) => prev + 1);
						}}
					>
						Add Food
					</AddButton>
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

			<IonModal ref={modalRef} open={modalOpen} setOpen={setModalOpen}>
				<ion-header translucent>
					<ion-toolbar>
						<ion-title>Search your Food</ion-title>
						<ion-buttons slot="end">
							<ion-button onClick={() => setModalOpen(false)}>
								Close
							</ion-button>
						</ion-buttons>
					</ion-toolbar>
				</ion-header>

				<ion-content fullscreen>
					<SearchFoodList
						foodData={foodData}
						// noTitle
						title={null}
						onClickItem={(food) => {
							setFoods((prev) => [
								...prev,
								{ ...food, portions: 1 },
							]);
							setModalOpen(false);
						}}
						noLink={true}
					/>
				</ion-content>
			</IonModal>
		</>
	);
};

export default DayScreen;

const Header = styled.div`
	display: flex;
	align-items: center:
	justify-content: center;
	font-size: 34px;
	font-weight: bold;
	margin: auto;
	text-align: center;
	width: fit-content;
	margin-bottom: 20px;
`;

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
