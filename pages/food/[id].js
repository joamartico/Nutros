import { useRouter } from "next/router";
import styled from "styled-components";

const food = () => {
	const router = useRouter();
	// const {id} = router.query;
	const food = router.query;

	return (
		<>
			<ion-header>
				<ion-toolbar>
					<ion-title>{food.name}</ion-title>
				</ion-toolbar>
			</ion-header>

			<ion-content fullscreen>
				<ion-header collapse="condense">
					<ion-buttons slot="start">
						<ion-back-button></ion-back-button>
					</ion-buttons>
					{/* <ion-toolbar> */}
						<ion-title size="large">{food.name}</ion-title>
					{/* </ion-toolbar> */}

					
				</ion-header>

                <Title>
                    Vitamins
                </Title>
			</ion-content>
		</>
	);
};

export default food;


const Title = styled.h2`
    
`;