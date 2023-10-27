import { useEffect, useState } from "react";
import styled from "styled-components";
import IonModal from "../components/IonModal";
import useInstallPwa from "../hooks/useInstallPwa";
import { getMessaging, getToken } from "firebase/messaging";
import IonSelect from "../components/IonSelect";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../pages";
import firebaseApp from "../firebase";
import { setCookie } from "nookies";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

const UserScreen = ({ selectedTab, userData }) => {
	// console.log({ userData });
	const [modalOpen, setModalOpen] = useState(false);
	const [promptValue, setPromptValue] = useState("");
	const [response, setResponse] = useState("");
	const [age, setAge] = useState(userData.age);
	const [gender, setGender] = useState(userData.gender);
	const [weight, setWeight] = useState(userData?.weight);
	const [physicalActivity, setPhysicalActivity] = useState(
		userData?.physicalActivity
	);
	const [height, setHeight] = useState(userData?.height);

	const [maternalStatus, setMaternalStatus] = useState(
		userData?.maternalStatus
	);

	// const { installPwa } = useInstallPwa();

	const auth = getAuth(firebaseApp);

	async function signIn() {
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider).then((result) => {
			console.log(result.user.email);
			// document.cookie = `user=${result.user.email}`;
			setCookie(null, "user", result.user.email, {
				path: "/",
			});

			setModalOpen(false);
			window.location.reload();
		});
	}

	useEffect(() => {
		if (selectedTab == "me" && !auth.currentUser) {
			setModalOpen((prev) => prev + 1);
		}
	}, [selectedTab]);

	async function askToGpt() {
		const response = await fetch(API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${OPENAI_API_KEY}`,
			},
			body: JSON.stringify({
				model: "gpt-3.5-turbo",
				messages: [
					{
						role: "system",
						content:
							"you are a nutrition assistant bot. Help the user achieve his goals through nutrition. Be short and concise. Recommend the user some foods and explain why.",
					},
					{ role: "user", content: promptValue },
				],
				stream: true,
				temperature: 0.2,
				// stop: ["\ninfo:"],
			}),
		});

		const reader = response.body.getReader();
		const decoder = new TextDecoder("utf-8");

		while (true) {
			const { value, done } = await reader.read();

			if (done) {
				break;
			}

			const chunk = await decoder.decode(value);

			const data = chunk
				.split("\n")
				.map((line) => line.replace("data: ", ""));

			data.forEach((line) => {
				try {
					const json = JSON.parse(line);
					console.log("json: ", json);
					const token = json.choices[0]?.delta?.content;

					token && setResponse((prev) => prev.concat(token));
				} catch (err) {
					console.log(err);
				}
			});
		}
	}

	function getGroupByGenderAndAge(_gender, _age, _maternalStatus) {
		const cleanAge = _age?.replace(" years", "");
		let ageRange = "";

		if (_age?.includes("months")) {
			ageRange = _age.replace(" months", "");
		} else if (cleanAge) {
			const ageInt = parseInt(cleanAge, 10);
			if (ageInt > 70) ageRange = "+70";
			else if (ageInt > 50) ageRange = "51-70";
			else if (ageInt > 30) ageRange = "31-50";
			else if (ageInt > 18) ageRange = "19-30";
			else if (ageInt > 13) ageRange = "14-18";
			else if (ageInt > 8) ageRange = "9-13";
			else if (ageInt > 3) ageRange = "4-8";
			else if (ageInt > 1) ageRange = "1-3";
			else if (ageInt > 0) ageRange = "7-12";
		}

		const menOrWomen = _gender?.toLowerCase();

		if (!ageRange || !menOrWomen) return "";

		if (_age?.includes("months")) {
			return "infant " + ageRange;
		}
		if (["1-3", "4-8"].includes(ageRange)) {
			return "child " + ageRange;
		}
		if (
			_gender === "Women" &&
			_maternalStatus === "Pregnant" &&
			!["9-13", "14-18"].includes(ageRange)
		) {
			return "pregnant " + ageRange;
		}
		if (
			_gender === "Women" &&
			_maternalStatus === "Lactating" &&
			!["9-13", "14-18"].includes(ageRange)
		) {
			return "nursing mother " + ageRange;
		}

		return menOrWomen + " " + ageRange;
	}

	// useEffect(() => {
	// 	if (!db || !auth.currentUser) return;
	// 	const group = getGroupByGenderAndAge(gender, age, maternalStatus);
	// 	setDoc(
	// 		doc(db, "users", auth.currentUser?.email),
	// 		{
	// 			gender: gender,
	// 			age: age,
	// 			maternalStatus: maternalStatus,
	// 			group: group,
	// 		}
	// 		// { merge: true }
	// 	);
	// 	console.log("group: ", group);
	// }, [gender, age, maternalStatus, db, auth.currentUser, userData]);

	function updateUserData(obj) {
		console.log("updateData obj", obj);
		if (obj.gender || obj.age || obj.maternalStatus) {
			const group = getGroupByGenderAndAge(
				obj.gender,
				obj.age,
				obj.maternalStatus
			);

			updateDoc(doc(db, "users", auth.currentUser?.email), {
				...obj,
				group,
			});
		}
		updateDoc(doc(db, "users", auth.currentUser?.email), { ...obj });
	}

	return (
		<>
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
									onChange={(e) => {
										if (e.detail.value == "signOut") {
											auth?.signOut();
											setCookie(null, "user", "", {
												path: "/",
											});
											window.location.reload();
										}
									}}
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
							options={["Men", "Women"]}
							defaultValue={userData?.gender}
							onChange={(option) => {
								const newGender = option.detail.value;
								setGender(newGender);
								updateUserData({
									gender: newGender,
									age,
									maternalStatus,
								});
							}}
						/>
					</ion-item>
					<ion-item style={{ cursor: "pointer" }}>
						<ion-label>Age</ion-label>
						<IonSelect
							placeholder="Select age"
							interface="picker"
							// options={["Child", "Teenager", "Adult", "Elderly"]}
							// options={[
							// 	"0-6 months",
							// 	"7-12 months",
							// 	"1-3 years",
							// 	"4-8 years",
							// 	"9-13 years",
							// 	"14-18 years",
							// 	"19-30 years",
							// 	"31-50 years",
							// 	"51-70 years",
							// 	"+70 years",
							// ]}
							// from 1 to 100
							options={[
								"0-6 months",
								"7-12 months",
								...Array.from(
									{ length: 100 },
									(_, i) => `${i + 1} years`
								),
							]}
							defaultValue={userData?.age}
							onChange={(option) => {
								const newAge = option.detail.value;
								console.log("setAge ", newAge);
								setAge(newAge);
								updateUserData({
									age: newAge,
									gender,
									maternalStatus,
								});
							}}
						/>
					</ion-item>
					{gender == "Women" && (
						<ion-item style={{ cursor: "pointer" }}>
							<ion-label>Maternal Status</ion-label>
							<IonSelect
								placeholder="Select"
								interface="picker"
								options={["None", "Pregnant", "Lactating"]}
								defaultValue={userData?.maternalStatus}
								onChange={(option) => {
									const newMaternalStatus =
										option.detail.value;
									setMaternalStatus(newMaternalStatus);
									updateUserData({
										maternalStatus: newMaternalStatus,
										age,
										gender,
									});
								}}
							/>
						</ion-item>
					)}
					<ion-item style={{ cursor: "pointer" }}>
						<ion-label>Weight</ion-label>
						<IonSelect
							placeholder="Select weight"
							interface="picker"
							options={Array.from(
								{ length: 200 },
								(_, i) => `${i + 1} kg`
							)}
							defaultValue={userData?.weight}
							onChange={(option) => {
								const newWeight = option.detail.value;
								setWeight(newWeight);
								updateUserData({ weight: newWeight });
							}}
						/>
					</ion-item>
					<ion-item style={{ cursor: "pointer" }}>
						<ion-label>Physical Activity</ion-label>
						<IonSelect
							placeholder="Select activity level"
							interface="picker"
							options={["Sedentary", "Medium", "Athlete"]}
							optionsLabels={[
								"Sedentary (no exercise)",
								"Medium (exercise 3-5 days/week)",
								"Athlete (exercise every day)",
							]}
							defaultValue={userData?.physicalActivity}
							onChange={(option) => {
								const newPhysicalActivity = option.detail.value;
								setPhysicalActivity(newPhysicalActivity);
								updateUserData({
									physicalActivity: newPhysicalActivity,
								});
							}}
						/>
					</ion-item>
					<ion-item style={{ cursor: "pointer" }}>
						<ion-label>Height</ion-label>
						<IonSelect
							placeholder="Select height"
							interface="picker"
							options={Array.from(
								{ length: 111 },
								(_, i) => `${i + 100} cm`
							)}
							defaultValue={userData?.height}
							onChange={(option) => {
								const newHeight = option.detail.value;
								setHeight(newHeight);
								updateUserData({ height: newHeight });
							}}
						/>
					</ion-item>
					<ion-list-header style={{ marginTop: 10 }}>
						<ion-label>Your goal</ion-label>
					</ion-list-header>
					<TextArea
						placeholder="Write what you want to achieve..."
						autoGrow
						value={promptValue}
						onChange={(e) => setPromptValue(e.target.value)}
					/>
					<Button onClick={askToGpt}>Get Recommendation</Button>

					<ion-item lines="none">
						{response && (
							<ion-text>
								<p
									dangerouslySetInnerHTML={{
										__html: response,
									}}
								/>
							</ion-text>
						)}
					</ion-item>
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
