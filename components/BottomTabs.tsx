import React from 'react'

const BottomTabs = () => {
	return (
		<ion-tabs>
			<ion-tab-bar slot="bottom" transluscent={true}>
				<ion-tab-button tab="explore" href="/explore" name="explore">
					<ion-icon name="parthenon" />
					<ion-label>Explore</ion-label>
				</ion-tab-button>

				<ion-tab-button tab="me" name="me" href="/me">
					<ion-icon name={"person"} />
					<ion-label>Me</ion-label>
				</ion-tab-button>

				<ion-tab-button tab="debates" name="debates" href="/debates">
					<ion-icon name={"chatbubbles"} />
					<ion-label>Debates</ion-label>
				</ion-tab-button>
			</ion-tab-bar>

			<ion-tab tab="explore">
				{/* <Explore /> */}
			</ion-tab>

			<ion-tab tab="me">
				{/* <Me /> */}
			</ion-tab>

			<ion-tab tab="debates">
				{/* <Debates /> */}
			</ion-tab>

		</ion-tabs>
	);
};


export default BottomTabs