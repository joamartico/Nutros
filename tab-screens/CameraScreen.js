import { useEffect, useRef } from "react";
import styled from "styled-components";

const CameraScreen = ({ selectedTab, foodData }) => {
	const videoRef = useRef(null);
	const canvasRef = useRef(null);

	useEffect(() => {
		if (selectedTab === "camera") {
			// Solicitar acceso a la cámara
			if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
				navigator.mediaDevices
					.getUserMedia({ video: true })
					.then((stream) => {
						videoRef.current.srcObject = stream;
						videoRef.current.play();
					});
			}
		}
	}, []);

	const captureImage = () => {
		const context = canvasRef.current.getContext("2d");
		context.drawImage(videoRef.current, 0, 0, 640, 480);
	};

	return (
		<>
			<ion-header>
				<ion-toolbar>
					<ion-title>Photo your food</ion-title>
				</ion-toolbar>
			</ion-header>

			<ion-content fullscreen class="ion-padding">
				<ion-header collapse="condense">
					<ion-toolbar>
						<ion-title onClick={() => getVideo()} size="large">
							Photo your food
						</ion-title>
					</ion-toolbar>
				</ion-header>

				<video ref={videoRef} width="640" height="480" />
				<button onClick={captureImage}>Capturar Imagen</button>
				<canvas
					ref={canvasRef}
					width="640"
					height="480"
					style={{ display: "none" }}
				/>
			</ion-content>
		</>
	);
};

export default CameraScreen;

const CameraVideo = styled.video`
	position: fixed;
	top: 0;
	left: 50%;
	transform: translate(-50%);
	height: 100vh;
	width: auto;
`;
