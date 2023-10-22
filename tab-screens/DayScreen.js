import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import FoodItem from "../components/FoodItem";
import IonModal from "../components/IonModal";
import PercentCircle from "../components/PercentCircle";
import SearchFoodList from "../components/SearchFoodList";
import dv from "../dv.json";
import { minerals, vitamins, fattyAcids } from "../nutrients";
import { db } from "../pages";
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	increment,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import ScrollRow from "../components/ScrollRow";
import { convertToUrl } from "../utils/functions";

const days = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

function getPortionName(food) {
	if (!food.portions) return "";
	const name = food.foodPortions[0]?.portionDescription;
	if (name?.startsWith("1 ")) {
		return name.substring(2);
	}
	return name;
}

const DayScreen = ({ foodData, userData }) => {
	const [foods, setFoods] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const modalRef = useRef();
	const router = useRouter();
	const [date, setDate] = useState(new Date());
	const [loading, setLoading] = useState(true);
	const formattedDate = date.toLocaleDateString("sv");

	useEffect(() => {
		if (!userData) return;
		getDocs(
			collection(db, `users/${userData?.email}/`, formattedDate)
		).then((snapshot) => {
			setFoods(snapshot.docs.map((doc) => doc.data()));
			setLoading(false);
		});
	}, [userData, date]);

	function getDVPercent(nutrientDbName) {
		let amountSum = 0;

		if (nutrientDbName == "Omega-6") {
			foods.map((food) => {
				const nutrientsHaveN6 = food?.foodNutrients.find((item) =>
					item?.nutrient?.name.includes("n-6")
				);

				food?.foodNutrients.map((item) => {
					if (nutrientsHaveN6) {
						// OMEGA 6
						if (item?.nutrient?.name.includes("n-6")) {
							amountSum += item.amount * (food.amount / 100);
						}
					} else {
						if (
							item?.nutrient?.name.includes("PUFA 18:2") || // LA
							// item?.nutrient?.name.includes("PUFA 18:3") || // GLA
							item?.nutrient?.name.includes("PUFA 20:3") || // DGLA
							item?.nutrient?.name.includes("PUFA 20:4") // AA
						) {
							amountSum += item.amount * (food.amount / 100);
						}
					}
				});
			});
		} else {
			foods.map((food) => {
				food.foodNutrients.map((item) => {
					if (item.nutrient?.name.includes(nutrientDbName) && item.amount && food.amount) {
						amountSum += item.amount * (food.amount / 100);
					}
				});
			});
		}

		return (
			(amountSum / dv[userData?.group || "men 19-30"][nutrientDbName]) *
			100
		).toFixed(0);
	}

	const getAmount = (foodPortions) => {
		if (!foodPortions || !foodPortions[0]?.gramWeight) {
			return 100;
		}

		return foodPortions[0].gramWeight > 250
			? 250
			: foodPortions[0].gramWeight;
	};

	return (
		<>
			{/* <Head>
				<title>Todays Nutrition - Nutros</title>
			</Head> */}

			<ion-header translucent>
				<ion-toolbar>
					<ion-title>{days[date.getDay()]}</ion-title>
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
								onClick={() =>
									setDate(
										(prev) =>
											new Date(
												prev.getTime() -
													24 * 60 * 60 * 1000
											)
									)
								}
							/>
							<div style={{ height: 34, lineHeight: 1 }}>
								{days[date.getDay()]}
							</div>
							<ion-icon
								name="chevron-forward"
								src="/svg/chevron-forward.svg"
								style={{ marginLeft: 20, cursor: "pointer" }}
								color="primary"
								onClick={() =>
									setDate(
										(prev) =>
											new Date(
												prev.getTime() +
													24 * 60 * 60 * 1000
											)
									)
								}
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
								amount={getAmount(food.foodPortions)}
								portionName={getPortionName(food)}
								onClick={() => {
									router.push(
										"/food/" +
											convertToUrl(food.description)
									);
								}}
								onAdd={() => {
									const newFoods = [...foods];
									newFoods[i].portions += 1;
									newFoods[i].amount =
										getAmount(food.foodPortions) *
										newFoods[i].portions;

									setFoods(newFoods);
									updateDoc(
										doc(
											db,
											`users/${userData?.email}/${formattedDate}/`,
											food.description
										),
										{
											portions: increment(1),
											amount:
												getAmount(food.foodPortions) *
												newFoods[i].portions,
										}
									);
								}}
								onRemove={() => {
									const newFoods = [...foods];
									newFoods[i].portions -= 1;
									newFoods[i].amount =
										getAmount(food.foodPortions) *
										newFoods[i].portions;
									if (newFoods[i].portions === 0) {
										newFoods.splice(i, 1);

										deleteDoc(
											doc(
												db,
												`users/${userData?.email}/${formattedDate}/`,
												food.description
											)
										);
									} else {
										updateDoc(
											doc(
												db,
												`users/${userData?.email}/${formattedDate}/`,
												food.description
											),
											{
												portions: increment(-1),
												amount:
													getAmount(
														food.foodPortions
													) * newFoods[i].portions,
											}
										);
									}
									setFoods(newFoods);
								}}
								portions={food.portions}
							/>
							// </Link>
						);
					})}

					{loading ? (
						<ion-spinner
							style={{
								display: "block",
								margin: "20px auto",
							}}
							name="crescent"
						/>
					) : null}

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

					<ScrollRow>
						{vitamins.map((vitamin, i) => {
							return (
								<PercentCircle
									num={getDVPercent(vitamin.dbName)}
									name={vitamin.shortName}
									url={"/?nutrient=" + vitamin.dbName}
								/>
							);
						})}
					</ScrollRow>
				</ion-list>

				<ion-list style={{ marginTop: -30 }}>
					<ion-list-header>
						<h2>Minerals</h2>
					</ion-list-header>

					<ScrollRow>
						{minerals.map((mineral, i) => {
							return (
								<PercentCircle
									num={getDVPercent(mineral.dbName)}
									name={mineral.shortName}
									url={"/?nutrient=" + mineral.dbName}
								/>
							);
						})}
					</ScrollRow>
				</ion-list>

				<ion-list style={{ marginTop: -30 }}>
					<ion-list-header>
						<h2>Fatty Acids</h2>
					</ion-list-header>

					<ScrollRow>
						{fattyAcids.map((fat, i) => {
							return (
								<PercentCircle
									num={getDVPercent(fat.dbName)}
									name={fat.shortName}
									url={"/?nutrient=" + fat.dbName}
								/>
							);
						})}
					</ScrollRow>
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

				<ion-content style={{ position: "absolute", top: 44 }}>
					<SearchFoodList
						foodData={foodData}
						title={null}
						onClickItem={(food) => {
							setFoods((prev) => [
								...prev,
								{ ...food, portions: 1 },
							]);
							setModalOpen(false);
							setDoc(
								doc(
									db,
									`users/${userData?.email}/${formattedDate}/`,
									food.description
								),
								{
									...food,
									portions: 1,
									amount: getAmount(food.foodPortions),
								}
							);
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
