import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const ScrollRow = ({ children }) => {
	const rowRef = useRef();
	const [update, setUpdate] = useState(0);

	useEffect(() => {
		// Ensure the ref is current
		if (rowRef.current) {
			// Get initial width
			setUpdate(rowRef.current.clientWidth);

			// Create a ResizeObserver instance
			let resizeObserver = new ResizeObserver((entries) => {
				entries.forEach((entry) => {
					setUpdate(entry.target.clientWidth);
				});
			});

			// Observe the ref
			resizeObserver.observe(rowRef.current);

			// Cleanup on unmount
			return () => {
				if (resizeObserver && rowRef.current) {
					resizeObserver.unobserve(rowRef.current);
				}
			};
		}
	}, []);

	return (
		<Row
			className="ion-padding"
			ref={rowRef}
			onScroll={(e) =>
				// setScroll((e.target.scrollLeft / e.target.scrollWidth) * 100)
				setUpdate(e.target.scrollLeft)
			}
		>
			{/* {console.log(scroll)} */}
			{children}
			<Scrollbar>
				<ScrollThumb
					style={{
						marginLeft:
							(rowRef.current?.scrollLeft /
								rowRef.current?.scrollWidth) *
								100 +
							"%",
						width:
							(rowRef.current?.clientWidth /
								rowRef.current?.scrollWidth) *
								100 +
							"%",
						opacity: rowRef.current?.clientWidth ? 1 : 0,
					}}
				/>
			</Scrollbar>
		</Row>
	);
};

export default ScrollRow;

const Row = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	/* margin-bottom: 10px; */
	overflow-x: auto;
	white-space: nowrap;
	padding-bottom: 20px;
	/* &::-webkit-scrollbar {
		background-color: #f5f5f5;
		height: 11px;
		border-radius: 30px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: #aaaaaaaa;
		border-radius: 20px;
		border: 2.5px solid #f5f5f5;
	} */

	// remove scrollbar
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* Firefox */
	&::-webkit-scrollbar {
		display: none;
	}
`;

const Scrollbar = styled.div`
	width: calc(100% - 32px);
	background-color: #f5f5f5;
	height: 8px;
	border-radius: 30px;
	margin-top: 10px;
	z-index: 999;
	position: absolute;
	bottom: 0;
	transition: opacity 0.2s ease-in-out;
	overflow: hidden;
`;

const ScrollThumb = styled.div`
	background-color: #aaaa;
	border-radius: 20px;
	border: 1.5px solid #f5f5f5;
	/* width: 100px; */
	height: 8px;
	transition: opacity 0.2s ease-in-out;
`;
