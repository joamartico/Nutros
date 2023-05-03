import styled from "styled-components";

const NutrientItem = ({ recommendedAmount, completeName, dbName, amount, unitName }) => {
	const nutrientPercentage = ((amount / recommendedAmount) * 100)?.toFixed(1);

	function getColor(percentage) {
		if (percentage > 10) {
			return "success";
		} else if (percentage > 3) {
			return "warning";
		}
		return "danger";
	}

	return (
		<ion-item>
			<ion-label>
				<h2>{completeName}</h2>

				<p>
					{amount?.toFixed(1) || "Null"} {unitName}{" "}
				</p>
			</ion-label>

			{!amount || !nutrientPercentage || !recommendedAmount ? (
				""
			) : (
				<ion-note slot="end" color={getColor(nutrientPercentage)}>
					{nutrientPercentage}%
				</ion-note>
			)}
		</ion-item>
	);
};

export default NutrientItem;

const AmountText = styled.span`
	font-size: 0.9rem !important;
	color: #999 !important;
	margin-left: 10px;
`;
