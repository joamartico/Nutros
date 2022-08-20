import { useEffect, useRef } from "react";

const IonSelect = ({ onChange, children }) => {
	const ref = useRef();

	useEffect(() => {
		ref?.current?.addEventListener("ionChange", onChange);

		// cleanup this component
		return () => {
			ref?.current?.removeEventListener("ionChange", onChange);
		};
	}, []);

	return (
		<ion-select 
			multiple="true" 
			ref={ref} 
			interface="action-sheet"
		>
			{children}
		</ion-select>
	);
};

export default IonSelect;
