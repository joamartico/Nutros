import Link from "next/link";
import { useState } from "react";
import IonSearchbar from "./IonSearchbar";
import { convertToUrl } from "../utils/functions";

const SearchFoodList = ({ foodData, onClickItem, noLink, title }) => {
	const [search, setSearch] = useState("");

	const exactlyFoods = foodData?.filter((food) => {
		let [foodName, ...foodDescription] = food.description.split(",");

		return foodName.toLowerCase().includes(search.toLowerCase());
	});

	const otherFoods = foodData?.filter((food) => {
		let [foodName, ...foodDescription] = food.description.split(",");

		return foodDescription
			.join(",")
			.toLowerCase()
			.includes(search.toLowerCase());
	});

	const foods = [...exactlyFoods, ...otherFoods];

	return (
		<>
			<ion-header collapse="condense" translucent>
				{title && (
					<ion-toolbar>
						<h1>
							<ion-title size="large">{title}</ion-title>
						</h1>
					</ion-toolbar>
				)}

				<ion-toolbar display="true">
					<IonSearchbar
						value={search}
						onChange={(e) => setSearch(e.detail.value)}
						placeholder="Search a food"
					/>
				</ion-toolbar>
			</ion-header>

			<ion-list>
				{foods.slice(0, 100).map((food) => (
					<Link
						href={
							noLink
								? ""
								: `/food/${convertToUrl(food.description)}`
						}
					>
						<ion-item
							button
							detail="false"
							key={food.foodCode}
							onClick={() => onClickItem && onClickItem(food)}
						>
							<ion-label>
								{food.emoji}&nbsp;&nbsp;{food.description}
							</ion-label>
						</ion-item>
					</Link>
				))}
			</ion-list>
		</>
	);
};

export default SearchFoodList;
