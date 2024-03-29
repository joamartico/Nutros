import { modalController } from "@ionic/core";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const IonModal = (props) => {
	const [currentModal, setCurrentModal] = useState();

	const modalRef = useRef();

	async function openModal(opts = {}) {
		window.modalController = await modalController; // necesario?
		const modal = await modalController.create({
			component: modalRef.current,
			...opts,
		});
		modal.present();

		setCurrentModal(modal);
	}

	function openCardModal() {
		openModal({
			swipeToClose: true,
			presentingElement: document.getElementById("tabs"),
		});
	}

	function openSheetModal() {
		openModal({
			breakpoints: [0, 0.2, 0.5, 1],
			initialBreakpoint: 0.2,
			swipeToClose: true,
		});
	}

	function dismissModal() {
		if (currentModal) {
			currentModal.dismiss().then(() => {
				setCurrentModal(null);
			});
			props.setOpen(false); // probar
		}
	}

	useEffect(() => {
		props.open && openCardModal();
		props.open == 0 && dismissModal();
	}, [props.open]);

	return (
		<>
			{/* <div pageRef={pageRef} class='ion-page' className="ion-page">
        </div> */}

			<Modal
				ref={modalRef}
				currentModal={currentModal ? true : false}
				style={props.style}
			>
				{props.children}
			</Modal>
		</>
	);
};

export default IonModal;

const Modal = styled.div`
	display: ${({ currentModal }) => (currentModal ? "flex" : "none")};
	padding-bottom: env(safe-area-inset-bottom);
`;
