import { modalController } from "@ionic/core";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const IonModal = (props) => {
	const [currentModal, setCurrentModal] = useState();

	const pageRef = useRef();
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
			presentingElement: pageRef.current,
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
		}
	}

    useEffect(() => {
      props.open && openCardModal()
    }, [props.open])
    
	return (
        <>
        <div pageRef={pageRef} class='ion-page'>
        </div>

		<Modal ref={modalRef} currentModal={currentModal ? true : false} >
			<ion-content fullscreen>cosas</ion-content>
		</Modal>
        </>
	);
};


export default IonModal;

const Modal = styled.div`
	display: ${({ currentModal }) => (currentModal ? "block" : "none")};
`;
