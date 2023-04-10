const TrendlineSelector = ({
	id,
	label,
	color,
	active,
	disabledIfInactive,
	handleOnClick,
}) => {
	let selectorColor;

	if (active) {
		selectorColor = color;
	} else {
		selectorColor = disabledIfInactive ? "#c5c5c5" : "white";
	}

	return (
		<div
			style={{
				width: "100%",
				display: "flex",
				justifyContent: "start",
				alignItems: "center",
				marginBottom: "0.5rem",
				cursor:
					!active && disabledIfInactive ? "not-allowed" : "pointer",
			}}
			onClick={
				!active && disabledIfInactive ? null : () => handleOnClick(id)
			}
		>
			<div
				style={{
					width: "17px",
					height: "17px",
					backgroundColor: selectorColor,
					borderRadius: "4px",
					border: active ? null : "0.4px #c5c5c5 solid",
					flexShrink: 0,
				}}
			/>
			<div
				style={{
					fontFamily: "Inter",
					fontWeight: "400",
					fontSize: "0.8rem",
					marginLeft: "0.3rem",
					textAlign: "start",
					textDecoration:
						!active && disabledIfInactive ? "line-through" : "none",
				}}
			>
				{label}
			</div>
		</div>
	);
};

export default TrendlineSelector;
