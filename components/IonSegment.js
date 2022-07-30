import React, { useEffect, useRef } from 'react'

const IonSegment = ({ value, onChange, segments, id, style }) => {
  const ref = useRef()

	useEffect(() => {
		ref?.current?.addEventListener("ionChange", onChange);

		// cleanup this component
		return () => {
			ref?.current?.removeEventListener("ionChange", onChange);
		};
	}, []);

	return (
		<ion-segment
			ref={ref}
			value={value}
			style={style}
		>
			{segments.map((segment) => (
				<ion-segment-button value={segment}>
					{segment}
				</ion-segment-button>
			))}
		</ion-segment>
	);
};


export default IonSegment