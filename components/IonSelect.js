import { pickerController } from "@ionic/core";
import { useEffect, useRef, useState } from "react";

const IonSelect = (props) => {
	const ref = useRef();
	const [pickerValue, setPickerValue] = useState();

	async function openPicker() {
		const picker = await pickerController.create({
			columns: [
				{
					name: "title",
					options: props.options?.map((option, i) => {
						return {
							text: props.optionsLabels
								? props.optionsLabels[i]
								: option,
							value: option,
						};
					}),
				},
			],
			buttons: [
				{
					text: "Cancel",
					role: "cancel",
				},
				{
					text: "Confirm",
					handler: (value) => {
						setPickerValue(value.title.value);
						if (props.onChange) {
							// I'm assuming here that the structure you want to send is like this:
							props.onChange({
								detail: { value: value.title.value },
							});
						}
					},
				},
			],
		});
		await picker.present();
	}

	useEffect(() => {
		if (props.interface != "picker") {
			ref?.current?.addEventListener("ionChange", props.onChange);
		}

		// cleanup this component
		// return () => {
		// 	ref?.current?.removeEventListener("ionChange", props.onChange);
		// };
	}, []);

	if (props.interface != "picker") {
		return (
			<ion-select
				// multiple="true"
				// interface="action-sheet"
				// {...props}
				multiple={props.multiple}
				interface={props.interface}
				ref={ref}
				style={
					props.translucent
						? {
								backgroundColor: "transparent",
								color: "transparent",
								position: "absolute",
								top: 0,
								width: "100%",
						  }
						: props.style
				}
				placeholder={props.placeholder}
				value={props.value}
			>
				{props.children}
			</ion-select>
		);
	} else {
		return (
			<div
				style={{ display: "flex" }}
				onClick={(e) => {
					openPicker();
				}}
			>
				<ion-select
					ref={ref}
					style={{
						pointerEvents: "none",
						width: "100%",
						minWidth: "fit-content",
						marginLeft: "auto",
					}}
					placeholder={props.placeholder}
					value={pickerValue || props.defaultValue}
				>
					{props.options?.map((option) => (
						<ion-select-option value={option}>
							{option}
						</ion-select-option>
					))}
				</ion-select>
			</div>
		);
	}
};

export default IonSelect;
