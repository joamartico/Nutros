import { useRouter } from "next/router";
import styled from "styled-components";
import { Background, Card } from "../components/_styled";

const Login = () => {

	return (
		<Background>
			<Card>
				<Subtitle>Login</Subtitle>

				<p>Your app to</p>

				<ion-button strong>Back</ion-button>
			</Card>
		</Background>
	);
};

export default Login;


const Subtitle = styled.p`
	font-size: 50px;
	color: var(--ion-color-primary);
	font-weight: 500;
	height: 10px;
`;