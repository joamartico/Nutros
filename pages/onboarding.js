import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Background, Card, Subtitle, Title } from "../components/_styled";

const Onboarding = () => {
	const router = useRouter();

	return (
		<>
		<Head>
			<link rel="canonical" href="https://nutros.vercel.app/onboarding" />
		</Head>

		<Background>
			<Card>
				<div>
					<Subtitle>Welcome to</Subtitle>
					<Title>Nutros App</Title>
				</div>

				<Description>
					Your web app to search and track your food nutrients.
					<br />
					<br />
					Track your nutrition.
				</Description>

				<Link href="/">
					<ion-button strong>
						Get Started
					</ion-button>
				</Link>
			</Card>
		</Background>
		</>
	);
};

export default Onboarding;

const Description = styled.h2`
	font-size: 20px;
	color: var(--ion-color-primary);
	margin-bottom: 5px;
	margin-top: 3vh;
	max-width: 500px;
	font-weight: bold;
`;
