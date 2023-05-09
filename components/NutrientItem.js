import styled from "styled-components";

const NutrientItem = ({ recommendedAmount, completeName, amount, unitName, onClick }) => {
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
		<ion-item onClick={onClick}>
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

