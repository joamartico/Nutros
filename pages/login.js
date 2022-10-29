import { useRouter } from "next/router";
import styled from "styled-components";
import { Background, Card, Subtitle, Title } from "../components/_styled";

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

