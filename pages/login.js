import { useRouter } from "next/router";
import styled from "styled-components";
import { Background, Card } from "../components/_styled";

const Login = () => {
	return (
		<>
			<ion-content class='ion-padding'>
				<Subtitle>Login</Subtitle>
			</ion-content>
		</>
	);
};

export default Login;

const Subtitle = styled.p`
	font-size: 50px;
	color: var(--ion-color-primary);
	font-weight: 500;
	height: 10px;
`;
