import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";
import IonSearchbar from "../components/IonSearchbar";

export default function Home({ foodData }) {
	const [search, setSearch] = useState("");


	return (
		<>
			<IonSearchbar
				value={search}
				onChange={(e) => setSearch(e.detail.value)}
				placeholder="Search"
			/>
			<Button
				onClick={() => {
					let foods = foodData.SurveyFoods.filter((food) =>
						food.description.includes(search)
					);
					console.log(foods);
				}}
			>
				Search
			</Button>
		</>
	);
}

const Button = styled.button`
	border-radius: 4px;
	background-color: #61a8e4;
	border: none;
	color: #fff;
	padding: 10px;
	font-size: 16px;
	font-weight: bold;
	margin: 10px;
	cursor: pointer;
`;
