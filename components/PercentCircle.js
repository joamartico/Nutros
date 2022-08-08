import styled from "styled-components";

const PercentCircle = ({ num = 0, name }) => {
	return (
		<Center>
			<Svg
				viewBox="0 0 120 120"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
			>
				<Circle
					cx="60"
					cy="60"
					r="18px"
					strokeLinecap="round"
					num={num > 100 ? 100 : num}
				/>
			</Svg>
			<ExtCircle>
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
	/* background-color: ${({ num }) => {
		if (num < 30) {
			return "var(--ion-color-danger)";
		} else if (num < 60) {
			return "var(--ion-color-warning)";
		} else {
			return "var(--ion-color-success)";
		}
	}}}; */
    background: #cacaca99;
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

const Circle = styled.circle`
	fill: none;
	stroke-width: 5px;
	stroke: ${({ num }) => {
		if (num < 30) {
			return "var(--ion-color-danger)";
		} else if (num < 60) {
			return "var(--ion-color-warning)";
		} else {
			return "var(--ion-color-success)";
		}
	}}};
	stroke-dasharray:113;
	stroke-dashoffset: ${({ num }) => {
        return (113 - (num / 100) * 113);
    }};
    transition: all 0.5s ease-in-out;

`;

const Svg = styled.svg`
	position: absolute;
	height: 100%;
	width: 100%;
	top: 11.5px;
`;
