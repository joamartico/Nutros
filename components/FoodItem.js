import styled from "styled-components";

const FoodItem = (props) => {
	const { name, amount } = props;
	return (
		<ion-item {...props}>
			<ion-label>
				<h2>{name}</h2>
				{amount && <p>{amount} g</p>}
			</ion-label>

			<ion-button slot="end" fill="clear">
				<ion-icon name="add-circle-outline"></ion-icon>
			</ion-button>
		</ion-item>
	);
};

export default FoodItem;

const AmountButtons = styled.div`
	border-radius: 5px;
`;
