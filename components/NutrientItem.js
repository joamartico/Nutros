const NutrientItem = ({ group, name, amount, unitName }) => {
	const nutrientPercentage = ((amount / group[name]) * 100).toFixed(1);

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
				{name} - {amount.toFixed(1)} {unitName}{" "}
			</ion-label>

			{group[name] && (
				<ion-note slot="end" color={getColor(nutrientPercentage)}>
					{nutrientPercentage}%
				</ion-note>
			)}
		</ion-item>
	);
};

export default NutrientItem;
