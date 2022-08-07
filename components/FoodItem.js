import styled from "styled-components";

const FoodItem = (props) => {
	const { name, portionName, amount, portions, onClick, onRemove, onAdd } = props;
	return (
		<ion-item>
			<ion-label onClick={onClick}>
				<h2>{name}</h2>
				<p>{portions} {portionName || ""} ({(portions * amount).toFixed(1)} g)</p>
			</ion-label>

			<ion-buttons slot="end">
				<ion-button slot="end" fill="clear" onClick={onRemove}>
					<ion-icon name="remove-circle-outline"></ion-icon>
				</ion-button>

				<ion-button slot="end" fill="clear" onClick={onAdd}>
					<ion-icon name="add-circle-outline"></ion-icon>
				</ion-button>
			</ion-buttons>
		</ion-item>
	);
};

export default FoodItem;

const AmountButtons = styled.div`
	border-radius: 5px;
`;
