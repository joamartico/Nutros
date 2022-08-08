import styled from "styled-components";

const PercentCircle = ({ num = 0, name }) => {
	return (
		<Center>
			<ExtCircle num={num}>
				<IntCircle>{num}%</IntCircle>
			</ExtCircle>
			{name}
		</Center>
	);
};

export default PercentCircle;

const Center = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-right: 15px;
`;

const ExtCircle = styled.div`
	border-radius: 50%;
	width: 60px;
	height: 60px;
	background-color: ${({ num }) => {
		if (num < 30) {
			return "var(--ion-color-danger)";
		} else if (num < 60) {
			return "var(--ion-color-warning)";
		} else {
			return "var(--ion-color-success)";
		}
	}}};
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5px;
`;

const IntCircle = styled.div`
	border-radius: 50%;
	width: 48px;
	height: 48px;
	background: white;
	display: flex;
	justify-content: center;
	align-items: center;
`;
