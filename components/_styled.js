import styled from "styled-components";

export const Background = styled.div`
	width: 100%;
	height: 100%;
	background: red;
	display: flex;
	background: var(--ion-color-secondary);
`;

export const Card = styled.div`
	background: #fff;
	display: flex;
	width: 100%;
	width: 500px;
	max-width: 95vw;
	height: 85%;
	margin: auto;
	border: 3px solid var(--ion-color-primary);
	border-radius: 20px;
	  padding-left: 4%;
  padding-right: 4%;
	padding-top: 0;
	flex-direction: column;
    /* align-items: center; */
    justify-content: space-around;
    box-shadow: 0 7px 5px #0002;

`;

export const Subtitle = styled.p`
	font-size: 50px;
	color: var(--ion-color-primary);
	font-weight: 500;
	height: 10px;
`;

export const Title = styled.h1`
	font-size: 50px;
	color: var(--ion-color-primary);
	font-weight: 800;
	height: 10px;
`;
