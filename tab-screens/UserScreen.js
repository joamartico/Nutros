import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import IonModal from "../components/IonModal";
import useInstallPwa from "../hooks/useInstallPwa";
import { getMessaging, getToken } from "firebase/messaging";
import IonSelect from "../components/IonSelect";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {
	addDoc,
	collection,
	doc,
	getFirestore,
	setDoc,
	updateDoc,
	getDoc,
} from "firebase/firestore";
import { db } from "../pages";

const group = "men 19-30";

function getPortionName(food) {
	if (!food.portions) return "";
	const name = food.foodPortions[0].portionDescription;
	if (name?.startsWith("1 ")) {
		return name.substring(2);
	}
	return name;
}

const UserScreen = ({ selectedTab, userData }) => {
	const [modalOpen, setModalOpen] = useState(false);

	const { installPwa } = useInstallPwa();

	const auth = getAuth();

	async function signIn() {
		const provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider);
		setModalOpen(false);
	}

	useEffect(() => {
		if (selectedTab == "me" && !auth.currentUser) {
			setModalOpen((prev) => prev + 1);
		}
	}, [selectedTab]);

	return (
		<>
			{/* <ion-header translucent>
				<ion-toolbar>
					<ion-title>Todays Nutrition</ion-title>
				</ion-toolbar>
			</ion-header> */}

			<ion-header>
				<ion-toolbar>
					<ion-buttons slot="start">
						<ion-button>
							<ion-icon name="notifications-outline" />
						</ion-button>
					</ion-buttons>

					<ion-buttons slot="end">
						{auth?.currentUser ? (
							<ion-button>
								{auth?.currentUser?.displayName}
								&nbsp; &nbsp;
								<ProfileImg src={auth?.currentUser?.photoURL} />
								<IonSelect
									interface="action-sheet"
									translucent
									onChange={(e) =>
										e.detail.value == "signOut" &&
										auth.signOut()
									}
								>
									<ion-select-option value={"signOut"}>
										Sign Out
									</ion-select-option>
								</IonSelect>
							</ion-button>
						) : (
							<ion-button
								onClick={() => setModalOpen((prev) => prev + 1)}
							>
								Sign in
							</ion-button>
						)}
					</ion-buttons>
				</ion-toolbar>
			</ion-header>

			<ion-content>
				<ion-list>
					<ion-list-header>
						<ion-label>About you</ion-label>
					</ion-list-header>

					<ion-item style={{ cursor: "pointer" }}>
						<ion-label>Gender</ion-label>

						<IonSelect
							placeholder="Select gender"
							interface="picker"
							options={["Male", "Female"]}
							defaultValue={userData?.gender}
							onChange={(option) => {
								setDoc(
									doc(db, "users", auth.currentUser?.email),
									{
										gender: option.detail.value,
									},
									{ merge: true }
								);
							}}
							// defaultValue='Female'
						/>
					</ion-item>

					<ion-item style={{ cursor: "pointer" }}>
						<ion-label>Age range</ion-label>
						<IonSelect
							placeholder="Select age"
							interface="picker"
							options={["Child", "Teenager", "Adult", "Elderly"]}
							defaultValue={userData?.age}
							onChange={(option) => {
								setDoc(
									doc(db, "users", auth.currentUser?.email),
									{
										age: option.detail.value,
									},
									{ merge: true }
								);
							}}
							// defaultValue='Female'
						/>
					</ion-item>

					<ion-list-header style={{ marginTop: 10 }}>
						<ion-label>Your goal</ion-label>
					</ion-list-header>

					<TextArea
						placeholder="Write what you want to achieve..."
						autoGrow
					/>
					<Button>Get Recommendation</Button>
				</ion-list>
			</ion-content>

			<IonModal
				open={modalOpen}
				setOpen={setModalOpen}
				style={{
					flexDirection: "column",
					justifyContent: "space-between",
					height: "100%",
				}}
			>
				<ion-header translucent>
					<ion-toolbar>
						<ion-buttons slot="end">
							<ion-button onClick={() => setModalOpen(false)}>
								Close
							</ion-button>
						</ion-buttons>
					</ion-toolbar>
				</ion-header>

				<TextContainer>
					<Title>
						Please sign in <br /> to track your nutrition
					</Title>
				</TextContainer>

				<ButtonsContainer>
					<ion-button strong fill="outline" onClick={signIn}>
						<ion-icon name="google" />
						&nbsp;&nbsp;Continue with Google
					</ion-button>
					<br />
					<br />

					{/* <ion-button strong fill="outline" onClick={installPwa}>
						Install web app
					</ion-button>

					<ion-button strong onClick={() => {
						setModalOpen(false)
						router.push("/login")
					}}>
						Get Started
					</ion-button> */}
				</ButtonsContainer>
			</IonModal>
		</>
	);
};

export default UserScreen;

const ProfileImg = styled.img`
	height: 30px;
	width: 30px;
	border-radius: 50%;
`;

const Title = styled.h1`
	font-size: 40px;
	color: var(--ion-color-primary);
	font-weight: 800;
	/* height: 10px; */
`;

const TextContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 100%;
	margin-top: auto;
	margin-bottom: 80px;
	padding: 25px;
	padding-top: 80px;
`;

const ButtonsContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	/* height: 135px; */
	width: 100%;
	/* margin-top: 40px; */
	padding: 25px;
`;

const TextArea = styled.textarea`
	background-color: #f2f2f2;
	width: calc(100% - 40px);
	margin: auto;
	margin-top: 6px;
	margin-bottom: 2px;
	min-height: 90px;
	padding: 5px;
	padding: 12px;
	font-size: 16px;
	border: none;
	border-radius: 8px;
	resize: none;
	&:focus {
		outline: none;
	}
	margin-left: 20px;
`;

const Button = styled.div`
	background-color: var(--ion-color-primary);
	border-radius: 8px;
	padding: 16px;
	width: calc(100% - 40px);
	height: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: auto;
	margin-right: auto;
	margin-top: 10px;
	margin-bottom: 20px;
	cursor: pointer;
	font-size: 16px;
	font-weight: bold;
	color: #040;
`;
