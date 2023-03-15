import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Background, Card } from "../components/_styled";

const Onboarding = () => {
	const router = useRouter();
	const [ev, setEv] = useState();
	const [showPWAPrompt, setShowPWAPrompt] = useState(false);
	const [Prompt, setPrompt] = useState()

	useEffect(() => {
		window.addEventListener("beforeinstallprompt", (event) => {
			event.preventDefault();
			setEv(event);
		});
	}, []);

	function IsSafari() {
		let userAgentString = navigator.userAgent;

		// Detect Chrome
		let chromeAgent = userAgentString.indexOf("Chrome") > -1;

		// Detect Safari
		let safariAgent = userAgentString.indexOf("Safari") > -1;

		// Discard Safari since it also matches Chrome
		if (chromeAgent && safariAgent) safariAgent = false;

		return safariAgent;
	}

	return (
		<>
			<Head>
				<link
					rel="canonical"
					href="https://nutros.vercel.app/onboarding"
				/>
			</Head>

			<Background>
				<Card>
					<TextContainer>
						<Title>Welcome to Nutros !</Title>

						<Description>
							Your web app to search and track your food
							nutrients.
							<br />
							Track your nutrition.
						</Description>
					</TextContainer>

					<ButtonsContainer>
						<ion-button
							strong
							fill="outline"
							onClick={async () => {
								ev?.prompt()
								// const { IOSPwaPrompt } = await import(
								// 	"react-ios-pwa-prompt"
								// );
								// setPrompt(<IOSPwaPrompt />);
							}}
						>
							Install web app
						</ion-button>

						<ion-button strong onClick={() => router.push("/")}>
							Get Started
						</ion-button>
					</ButtonsContainer>
				</Card>
			</Background>

			{Prompt}
		</>
	);
};

export default Onboarding;

const Description = styled.h2`
	font-size: 20px;
	color: var(--ion-color-primary);
	/* margin-bottom: 5px; */
	/* margin-top: 3vh; */
	max-width: 500px;
	font-weight: bold;
`;

const Title = styled.h1`
	font-size: 50px;
	color: var(--ion-color-primary);
	font-weight: 800;
	/* height: 10px; */
`;

const ButtonsContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 135px;
	width: 100%;
	margin-bottom: 60px;
`;

const TextContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 100%;
	margin-top: auto;
	margin-bottom: 80px;
`;
