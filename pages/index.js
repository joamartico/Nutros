import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";
import IonSearchbar from "../components/IonSearchbar";

export default function Home({ foodData }) {
	const [search, setSearch] = useState("");

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
					<ion-buttons slot="start">
						<ion-back-button></ion-back-button>
					</ion-buttons>
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
					}).map((food) => (
						<ion-item key={food.id}>
							<ion-label>{food.description}</ion-label>
						</ion-item>
					))}
				</ion-list>
			</ion-content>
		</>
	);
}
