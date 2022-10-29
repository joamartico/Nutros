import { useRouter } from "next/router";
import styled from "styled-components";
import { Background, Card, Subtitle, Title } from "../components/_styled";

const Onboarding = () => {
	const router = useRouter();

	return (
		<Background>
			<Card>
				<div>
					<Subtitle>Welcome to</Subtitle>
					<Title>Nutros App</Title>
				</div>

				<Description>Your web app to search and track your food nutrients</Description>

				<ion-button strong onClick={() => router.push("/")}>
					Get Started
				</ion-button>
			</Card>
		</Background>
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