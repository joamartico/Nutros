const NutrientItem = ({ item, group }) => {
	const nutrientPercentage = (
		(item?.amount / group[item?.nutrient.name]) *
		100
	).toFixed(1);

    function getColor(percentage) {
        if (percentage > 10) {
            return "success";
        } else if (percentage > 5) {
            return "warning";
        }
        return "danger";

    }

	return (
		<ion-item>
			<ion-label>
				{item?.nutrient.name} - {item?.amount} {item?.nutrient.unitName}{" "}
			</ion-label>

			{group[item?.nutrient.name] && (
				<ion-note slot="end" color={getColor(nutrientPercentage)}>
					{nutrientPercentage}%
				</ion-note>
			)}
		</ion-item>
	);
};

export default NutrientItem;
