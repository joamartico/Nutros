import React, { useEffect, useState } from 'react'
import { defineCustomElements as ionDefineCustomElements } from '@ionic/core/loader'

/* Core CSS required for Ionic components to work properly */
import '@ionic/core/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/core/css/normalize.css'
import '@ionic/core/css/structure.css'
import '@ionic/core/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/core/css/padding.css'
import '@ionic/core/css/float-elements.css'
import '@ionic/core/css/text-alignment.css'
import '@ionic/core/css/text-transformation.css'
import '@ionic/core/css/flex-utils.css'
import '@ionic/core/css/display.css'

import styled from "styled-components";


import foodData from "../foodData.json";
import IonSearchbar from "../components/IonSearchbar"
console.log(foodData);


function MyApp({ Component, pageProps }) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    ionDefineCustomElements(window)
  })
  return (
    <ion-app>
      <ion-header translucent>
        <ion-toolbar>
          <ion-title>Next.js with Ionic</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content fullscreen>
      <IonSearchbar
				value={search}
				onChange={(e) => setSearch(e.detail.value)}
				placeholder="Search"
			/>
			<Button
				onClick={() => {
					let foods = foodData.SurveyFoods.filter((food) =>
						food.description.includes(search)
					);
					console.log(foods);
				}}
			>
				Search
			</Button>
        <Component {...pageProps} />
      </ion-content>
      <ion-footer>
        <ion-toolbar>
          <ion-title>Footer</ion-title>
        </ion-toolbar>
      </ion-footer>
    </ion-app>
  )
}

export default MyApp



const Button = styled.button`
	border-radius: 4px;
	background-color: #61a8e4;
	border: none;
	color: #fff;
	padding: 10px;
	font-size: 16px;
	font-weight: bold;
	margin: 10px;
	cursor: pointer;
`;


