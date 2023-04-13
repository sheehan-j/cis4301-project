import Select from "react-select";

const Selector = ({
	label,
	selectOptions,
	value,
	onChange,
	isDisabled,
	isMulti,
}) => {
	return (
		<div style={styles.parameterContainer}>
			<div style={styles.parameterLabel}>{label}</div>
			<div style={styles.selectWrapper}>
				<Select
					options={selectOptions}
					value={value}
					onChange={onChange}
					isDisabled={isDisabled}
					isMulti={isMulti}
				/>
			</div>
		</div>
	);
};

const styles = {
	parameterContainer: {
		flex: 1,
		textAlign: "start",
		backgroundColor: "#f5f5f5",
		boxSizing: "border-box",
		paddingTop: "0.9rem",
		paddingBottom: "0.9rem",
		paddingLeft: "1rem",
		paddingRight: "1rem",
		borderRadius: "10px",
		marginRight: "0.5rem",
		marginLeft: "0.5rem",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
	},
	parameterLabel: {
		fontFamily: "Inter",
		color: "#363636",
		fontWeight: "500",
		fontSize: "0.9rem",
		marginBottom: "0.5rem",
	},
	selectWrapper: {
		fontWeight: "400",
		textAlign: "start",
		fontSize: "0.8rem",
		width: "100%",
		fontFamily: "Inter",
		whiteSpace: "nowrap",
	},
	multiSelect: {
		whiteSpace: "nowrap",
		overflow: "scroll",
	},
};

export default Selector;
