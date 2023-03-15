import { modalController } from "@ionic/core";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import IonModal from "../components/IonModal";
import dv from "../dv.json";

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

	const router = useRouter();

	useEffect(() => {
		if (selectedTab == "me") {
			setModalOpen(true);
			setInterval(() => {
				setModalOpen(false);
			}, 500);
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
							<div
								style={{ height: 34, lineHeight: 1 }}
								onClick={() => setModalOpen(true)}
							>
								Your Nutrition
							</div>
						</Header>
					</ion-toolbar>
				</ion-header>
			</ion-content>

			<IonModal open={modalOpen} />
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
