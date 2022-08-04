import React, { useEffect, useState } from "react";
import { defineCustomElements as ionDefineCustomElements } from "@ionic/core/loader";

/* Core CSS required for Ionic components to work properly */
import "@ionic/core/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/core/css/normalize.css";
import "@ionic/core/css/structure.css";
import "@ionic/core/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/core/css/padding.css";
import "@ionic/core/css/float-elements.css";
import "@ionic/core/css/text-alignment.css";
import "@ionic/core/css/text-transformation.css";
import "@ionic/core/css/flex-utils.css";
import "@ionic/core/css/display.css";

import "../index.css";

import Context from "../Context";
import Head from "next/head";

import foodData from "../foodData_foundation.json";

function MyApp({ Component, pageProps }) {
	useEffect(() => {
		ionDefineCustomElements(window);
	});
	return (
		<>
			<Head>
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				{/* SEO  */}
				<title>Nutros</title>
				<meta
					name="description"
					content="Nutros is your web app to search and track your food nutrients."
				/>
				<meta
					name="keywords"
					content="nutrition, food, vitamins, minerals, nutrients"
				/>

				<meta
					name="google-site-verification"
					content="3XoSVdS7QLQWutddbE1sJ60XT3mFR-WXrP80V4AharU"
				/>

				{/*  PWA  */}
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, viewport-fit=cover, user-scalable=no"
				/>
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta
					name="apple-mobile-web-app-status-bar-style"
					content="default"
				/>
			</Head>
			<Context>
				<ion-app mode="ios">
					<Component {...pageProps} foodData={foodData} />
				</ion-app>
			</Context>
		</>
	);
}

export default MyApp;
