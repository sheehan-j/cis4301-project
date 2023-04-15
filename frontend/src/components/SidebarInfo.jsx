const SidebarInfo = ({ type }) => {
	let title = "";
	let description = "";

	switch (type) {
		case "average":
			title = "Average";
			description =
				"This visualization shows the average deaths by group within the trendline grouping, either by month or by year.";
			break;
		case "difference":
			title = "Difference";
			description =
				"This query computes the difference in average deaths between the two groups and visualizes both the difference in deaths and the individual groups' deaths.";
			break;
		case "maximal":
			title = "Maximal";
			description =
				"This visualization graphs the maximum average deaths by month or year and the group responsible. The left y-axis quantifies deaths and the right y-axis corresponds with the legend to map responsible groups. Ties are represented by combining the tied groups names in the legend.";
			break;
		case "minimal":
			title = "Minimal";
			description =
				"This visualization graphs the minimum average deaths by month or year and the group responsible. The left y-axis quantifies deaths and the right y-axis corresponds with the legend to map responsible groups. Ties are represented by combining the tied groups names in the legend.";
			break;
		case "proportion":
			title = "Proportion";
			description =
				"This query computes the proportion the user-specified group makes up of all average deaths. The visualization displays the proportion as a percentage out of 100 and also graphs the user-specified group's average deaths and all average deaths.";
			break;
		default:
			title = "Missing";
			description = "Information not available";
			break;
	}

	return (
		<div style={styles.infoContainer}>
			<div style={styles.infoTitle}>{title}</div>
			<div style={styles.infoDesc}>{description}</div>
		</div>
	);
};

const styles = {
	infoContainer: {
		width: "100%",
		padding: "1rem",
		backgroundColor: "white",
		borderRadius: "13px",
		marginBottom: "0.5rem",
		textAlign: "start",
		boxSizing: "border-box",
	},
	infoTitle: {
		fontFamily: "Inter",
		fontWeight: "600",
		fontSize: "1.15rem",
		marginBottom: "0.1rem",
	},
	infoDesc: {
		fontFamily: "Inter",
		fontWeight: "400",
		fontSize: "0.85rem",
		lineHeight: "1.2rem",
	},
};

export default SidebarInfo;
