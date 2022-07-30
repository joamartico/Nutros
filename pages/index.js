import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";
import IonSearchbar from "../components/IonSearchbar";

export default function Home({ foodData }) {
	const [search, setSearch] = useState("");
	const router = useRouter();

	return (
		<>
			<ion-header>
				<ion-toolbar>
					<ion-title>Search food</ion-title>
					<ion-buttons slot="end">
						<ion-button>Order By</ion-button>
					</ion-buttons>
				</ion-toolbar>
			</ion-header>

			<ion-content fullscreen>
				<ion-header collapse="condense">
					<ion-toolbar>
						<ion-title size="large">Search Food</ion-title>
					</ion-toolbar>

					<ion-toolbar>
						<IonSearchbar
							value={search}
							onChange={(e) => setSearch(e.detail.value)}
							placeholder="Search"
						/>
					</ion-toolbar>
				</ion-header>

				<ion-list>
					{foodData.SurveyFoods.filter((food) => {
						search == "" && true;
						return food.description
							.toLowerCase()
							.includes(search.toLowerCase());
					})
						.slice(0, 20)
						.map((food) => (
							<ion-item
								key={food.foodCode}
								onClick={() =>
									router.push({
										pathname: "/food/" + food.foodCode,
										query: {
											name: food.description,
										}
									})
								}
							>
								<ion-label>{food.description}</ion-label>
							</ion-item>
						))}
				</ion-list>
			</ion-content>
		</>
	);
}
