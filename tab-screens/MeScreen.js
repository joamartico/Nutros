import { modalController } from "@ionic/core";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import IonModal from "../components/IonModal";
import dv from "../dv.json";
import useInstallPwa from "../hooks/useInstallPwa";

const group = "men 19-30";

function getPortionName(food) {
	if (!food.portions) return "";
	const name = food.foodPortions[0].portionDescription;
	if (name?.startsWith("1 ")) {
		return name.substring(2);
	}
	return name;
}

const MeScreen = ({ foodData, selectedTab }) => {
	const [modalOpen, setModalOpen] = useState(false);
	const { installPwa } = useInstallPwa();

	const router = useRouter();

	useEffect(() => {
		if (selectedTab == "me") {
			setModalOpen((prev) => prev + 1);
		}
	}, [selectedTab]);

	return (
		<>
			<ion-header translucent>
				<ion-toolbar>
					<ion-title>Todays Nutrition</ion-title>
				</ion-toolbar>
			</ion-header>

			<ion-content fullscreen>
				<ion-header collapse="condense">
					<ion-toolbar>
						<Header>
							<div style={{ height: 34, lineHeight: 1 }}>
								Your Nutrition
							</div>
						</Header>
					</ion-toolbar>
				</ion-header>
			</ion-content>

			<IonModal
				open={modalOpen}
				style={{
					// padding: 25,
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					height: "100%",
				}}
			>
				<ion-header translucent>
					<ion-toolbar>
						{/* <ion-title>Search your Food</ion-title> */}
						<ion-buttons slot="end">
							<ion-button onClick={() => setModalOpen(false)}>
								Close
							</ion-button>
						</ion-buttons>
					</ion-toolbar>
				</ion-header>

				<TextContainer>
					<Title>Please sign in to track your nutrition</Title>

					{/* <Description>
						Your web app to search and track your food nutrients.
						<br />
						Track your nutrition.
					</Description> */}
				</TextContainer>

				<ButtonsContainer>
					<ion-button strong fill="outline" onClick={installPwa}>
						Install web app
					</ion-button>

					<ion-button strong onClick={() => router.push("/")}>
						Get Started
					</ion-button>
				</ButtonsContainer>
			</IonModal>
		</>
	);
};

export default MeScreen;

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

const ButtonsContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 135px;
	width: 100%;
	margin-bottom: 80px;
	margin-top: 40px;
	padding: 25px;
`;

const TextContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 100%;
	margin-top: auto;
	margin-bottom: 80px;
	padding: 25px;
`;

const Title = styled.h1`
	font-size: 50px;
	color: var(--ion-color-primary);
	font-weight: 800;
	/* height: 10px; */
`;
