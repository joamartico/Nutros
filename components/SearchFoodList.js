import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import useGlobalState from "../hooks/useGlobalState";
import IonSearchbar from "./IonSearchbar";

const SearchFoodList = ({ foodData, noTitle, onClickItem, noLink }) => {
	const [search, setSearch] = useState("");
	// const { setFood } = useGlobalState();
	// const router = useRouter();

	return (
		<>
			<ion-header collapse="condense" translucent>
				{!noTitle && (
					<ion-toolbar>
						<ion-title size="large">Search Food</ion-title>
					</ion-toolbar>
				)}

				<ion-toolbar display="true">
					<IonSearchbar
						value={search}
						onChange={(e) => setSearch(e.detail.value)}
						placeholder="Search"
					/>
				</ion-toolbar>
			</ion-header>

			<ion-list>
				{foodData
					?.filter((food) => {
						search == "" && true;
						return food.description
							.toLowerCase()
							.includes(search.toLowerCase());
					})
					.slice(0, 100)
					.map((food) => (
						<Link href={noLink ? '' : `/food/${food.fdcId}`}>
							<ion-item
								key={food.foodCode}
								// onClick={() => {
								// 	setFood(food);
								// 	router.push("/food/" + food.fdcId);
								// }}
								// onClick={onClickItem, link}
								onClick={() => onClickItem(food)}
							>
								<ion-label>{food.description}</ion-label>
							</ion-item>
						</Link>
					))}
			</ion-list>
		</>
	);
};

export default SearchFoodList;
