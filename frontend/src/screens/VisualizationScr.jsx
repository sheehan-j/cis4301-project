// Packages
import { useEffect, useState } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Config
import {
	defaultData,
	trendlineGroupingOptions,
	temporalGranularityOptions,
	monthlyDateOptions,
	yearlyDateOptions,
	visTypeOptions,
	diffTrendlineOptions,
} from "../config/trendlineConfig";

// Util/APIs
import TotalCountsApi from "../api/TotalCountsApi";
import { AverageApiCall } from "../util/ApiCall";
import { VisualizeData } from "../util/VisualizeData";
import VisualizeMultipleDatasets from "../util/VisualizeMultipleDatasets";
import DiffApi from "../api/DiffApi";
import MinMaxApi from "../api/MinMaxApi";
import ProportionApi from "../api/ProportionApi";
import { UpdateActiveTrendlines } from "../util/UpdateActiveTrendlines";
import { verifyDates } from "../util/VerifyDates";

// Components/styling
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import Selector from "../components/Selector";
import Select from "react-select";
import TrendlineSelector from "../components/TrendlineSelector";
import "./VisualizationScr.css";
import SidebarInfo from "../components/SidebarInfo";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip
);

const VisualizationScr = () => {
	const [visualizedData, setVisualizedData] = useState(defaultData);
	const [allData, setAllData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [activeVisType, setActiveVisType] = useState(visTypeOptions[0]);
	const [groupingOption, setGroupingOption] = useState(null);
	const [diffTrendline1Option, setDiffTrendline1Option] = useState(null);
	const [diffTrendline2Option, setDiffTrendline2Option] = useState(null);
	const [excludedOptions, setExcludedOptions] = useState([]);
	const [granularityOption, setGranularityOption] = useState(null);
	const [currentDateOptions, setCurrentDateOptions] = useState(null);
	const [minDateOption, setMinDateOption] = useState(null);
	const [maxDateOption, setMaxDateOption] = useState(null);
	const [dateSelectIsDisabled, setDateSelectIsDisabled] = useState(true);
	const [visualizeButtonIsDisabled, setVisualizeButtonIsDisabled] =
		useState(true);
	const [activeTrendlines, setActiveTrendlines] = useState(0);
	const [legend, setLegend] = useState(null);
	const [totalTuples, setTotalTuples] = useState("...");

	// Configure chart to change to multiaxis when necessary
	const options = {
		responsive: true,
		interaction: {
			mode: activeVisType.value === "maximal" ? "index" : "point",
			intersect: false,
		},
		stacked: false,
		scales: {
			y: {
				type: "linear",
				display: true,
				position: "left",
			},
			y1: {
				type: "linear",
				display:
					activeVisType.value === "maximal" ||
					activeVisType.value === "minimal",
				position: "right",
				grid: {
					drawOnChartArea: false,
				},
				ticks: {
					stepSize: 1,
				},
			},
		},
	};

	// Handle width, height, and styling for the chart
	const [width, setWidth] = useState(0);
	const [navbarHeight, setNavbarHeight] = useState(0);
	useEffect(() => {
		const handleResize = () => {
			setWidth(document.getElementById("chart-div").offsetWidth);
			setNavbarHeight(
				document.getElementById("navbar-container").offsetHeight
			);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	const height = width / 2;
	const chartStyle = {
		opacity: isLoading ? 0.25 : 1,
		// margin: "auto",
	};

	// Load total tuple counts on render
	useEffect(() => {
		const loadTotalTuples = async () => {
			const result = await TotalCountsApi.getTotalTupleCount();
			if (result.error !== undefined) {
				alert(
					"ERROR! Unable to establish connection to DB. You likely need to turn on your VPN."
				);
				return;
			}
			setTotalTuples(result);
		};

		loadTotalTuples();
	}, []);

	// Handle necessary changes for temporal granularity
	useEffect(() => {
		setDateSelectIsDisabled(granularityOption === null ? true : false);
		setMinDateOption(null);
		setMaxDateOption(null);
		if (granularityOption) {
			setCurrentDateOptions(
				granularityOption.value === "monthly"
					? monthlyDateOptions
					: yearlyDateOptions
			);
		} else {
			setCurrentDateOptions(null);
		}
	}, [granularityOption]);

	useEffect(() => {
		switch (activeVisType.value) {
			case "average":
			case "maximal":
			case "minimal":
				setVisualizeButtonIsDisabled(
					!groupingOption ||
						!granularityOption ||
						!minDateOption ||
						!maxDateOption
				);
				break;
			case "difference":
				setVisualizeButtonIsDisabled(
					!diffTrendline1Option ||
						!diffTrendline2Option ||
						!granularityOption ||
						!minDateOption ||
						!maxDateOption
				);
				break;
			case "proportion":
				setVisualizeButtonIsDisabled(
					!diffTrendline1Option ||
						!granularityOption ||
						!minDateOption ||
						!maxDateOption
				);
				break;
			default:
				alert("Error in determining visualization button state.");
				break;
		}
	}, [
		activeVisType,
		groupingOption,
		diffTrendline1Option,
		diffTrendline2Option,
		granularityOption,
		minDateOption,
		maxDateOption,
	]);

	// Clear fields on visualization type change
	useEffect(() => {
		setVisualizedData(defaultData);
		setAllData(null);
		setActiveTrendlines(0);
		setDiffTrendline1Option(null);
		setDiffTrendline2Option(null);
		setGroupingOption(null);
		setGranularityOption(null);
		setMinDateOption(null);
		setMaxDateOption(null);
		setLegend(null);
		setExcludedOptions(null);
		setDiffTrendline1Option(null);
		setDiffTrendline2Option(null);
	}, [activeVisType]);

	const handleVisualize = async () => {
		if (
			verifyDates(
				minDateOption.value,
				maxDateOption.value,
				granularityOption.value
			) === false
		) {
			alert("Please choose valid date range.");
			return;
		}

		setIsLoading(true);
		setVisualizedData(defaultData);
		setAllData(null);
		setLegend(null);
		setActiveTrendlines(0);

		let result;
		let formattedData;
		switch (activeVisType.value) {
			case "average":
				result = await AverageApiCall(
					groupingOption.value,
					granularityOption.value,
					minDateOption.value,
					maxDateOption.value
				);

				formattedData = await VisualizeData("average", result);
				break;
			case "proportion":
				result = await ProportionApi.getProportionData(
					diffTrendline1Option.value,
					granularityOption.value,
					minDateOption.value,
					maxDateOption.value
				);

				formattedData = await VisualizeData("proportion", result);
				break;
			case "difference":
				result = await DiffApi.getDiffData(
					diffTrendline1Option.value,
					diffTrendline2Option.value,
					granularityOption.value,
					minDateOption.value,
					maxDateOption.value
				);

				formattedData = await VisualizeData("difference", result);
				break;
			case "maximal":
			case "minimal":
				// Process the curent excluded options
				const excludedValuesArr = [];
				let excludedValues = "";
				if (excludedOptions) {
					excludedOptions.forEach((item) => {
						excludedValuesArr.push(item.value);
					});
					excludedValues = excludedValuesArr.join(",");
				}

				result = await MinMaxApi.getMinMaxData(
					groupingOption.value,
					activeVisType.value === "maximal" ? "max" : "min",
					granularityOption.value,
					minDateOption.value,
					maxDateOption.value,
					excludedValues
				);

				formattedData = await VisualizeMultipleDatasets(result);
				setLegend(formattedData.legend);
				break;
			default:
				alert("Error in visualization handler.");
				break;
		}

		setActiveTrendlines(formattedData.activeTrendlines);
		setVisualizedData(formattedData.visualizedData);
		setAllData(formattedData.allData);
		setIsLoading(false);
	};

	const handleTrendlineSelectorClicked = (id) => {
		const updatedData = UpdateActiveTrendlines(
			id,
			allData,
			activeTrendlines
		);
		setAllData(updatedData.newAllData);
		setActiveTrendlines(updatedData.newActiveTrendlines);
		setVisualizedData(updatedData.newVisualizedData);
	};

	return (
		<div style={{ ...styles.container, paddingTop: `${navbarHeight}px` }}>
			<Navbar active={"Visualizations"} />

			<div style={styles.visualizationArea} className="visualizationArea">
				<div style={{ display: "flex", flexDirection: "row" }}>
					<div style={styles.visTypeSection}>
						<Selector
							label={"Visualization Type"}
							selectOptions={visTypeOptions}
							value={activeVisType}
							onChange={setActiveVisType}
							isDisabled={false}
						/>
					</div>
					<div style={styles.parametersSection}>
						<div
							style={{
								width: "100%",
								display: "flex",
								flexDirection: "row",
							}}
						>
							{(activeVisType.value === "average" ||
								activeVisType.value === "maximal" ||
								activeVisType.value === "minimal") && (
								<>
									<Selector
										label={"Trendline Grouping"}
										selectOptions={trendlineGroupingOptions}
										value={groupingOption}
										onChange={setGroupingOption}
										isDisabled={false}
									/>
									<Selector
										label={"Temporal Granularity"}
										selectOptions={
											temporalGranularityOptions
										}
										value={granularityOption}
										onChange={setGranularityOption}
										isDisabled={false}
									/>
									<Selector
										label={"Minimum Date"}
										selectOptions={currentDateOptions}
										value={minDateOption}
										onChange={setMinDateOption}
										isDisabled={dateSelectIsDisabled}
									/>
									<Selector
										label={"Maximum Date"}
										selectOptions={currentDateOptions}
										value={maxDateOption}
										onChange={setMaxDateOption}
										isDisabled={dateSelectIsDisabled}
									/>
								</>
							)}
							{activeVisType.value === "difference" && (
								<>
									<Selector
										label={"Group 1"}
										selectOptions={diffTrendlineOptions}
										value={diffTrendline1Option}
										onChange={setDiffTrendline1Option}
										isDisabled={false}
									/>
									<Selector
										label={"Group 2"}
										selectOptions={diffTrendlineOptions}
										value={diffTrendline2Option}
										onChange={setDiffTrendline2Option}
										isDisabled={false}
									/>
									<Selector
										label={"Temporal Granularity"}
										selectOptions={
											temporalGranularityOptions
										}
										value={granularityOption}
										onChange={setGranularityOption}
										isDisabled={false}
									/>
									<Selector
										label={"Minimum Date"}
										selectOptions={currentDateOptions}
										value={minDateOption}
										onChange={setMinDateOption}
										isDisabled={dateSelectIsDisabled}
									/>
									<Selector
										label={"Maximum Date"}
										selectOptions={currentDateOptions}
										value={maxDateOption}
										onChange={setMaxDateOption}
										isDisabled={dateSelectIsDisabled}
									/>
								</>
							)}
							{activeVisType.value === "proportion" && (
								<>
									<Selector
										label={"Group"}
										selectOptions={diffTrendlineOptions}
										value={diffTrendline1Option}
										onChange={setDiffTrendline1Option}
										isDisabled={false}
									/>
									<Selector
										label={"Temporal Granularity"}
										selectOptions={
											temporalGranularityOptions
										}
										value={granularityOption}
										onChange={setGranularityOption}
										isDisabled={false}
									/>
									<Selector
										label={"Minimum Date"}
										selectOptions={currentDateOptions}
										value={minDateOption}
										onChange={setMinDateOption}
										isDisabled={dateSelectIsDisabled}
									/>
									<Selector
										label={"Maximum Date"}
										selectOptions={currentDateOptions}
										value={maxDateOption}
										onChange={setMaxDateOption}
										isDisabled={dateSelectIsDisabled}
									/>
								</>
							)}
							<div
								style={{
									...styles.visualizeButton,
									opacity: visualizeButtonIsDisabled
										? 0.5
										: 1,
									cursor: visualizeButtonIsDisabled
										? "not-allowed"
										: "pointer",
								}}
								onClick={
									visualizeButtonIsDisabled
										? () => {}
										: handleVisualize
								}
								className="buttonScale"
							>
								<div className="hoverFade"></div>
								<div style={styles.visualizeText}>
									Visualize
								</div>
							</div>
						</div>
					</div>
				</div>

				<div
					style={{
						display: "flex",
						flexDirection: "row",
					}}
					id="chart-parent"
				>
					<div
						id="chart-div"
						style={{
							...styles.chart,
							height: `${height}px`,
						}}
					>
						{isLoading && <Loading />}
						<Line
							data={visualizedData}
							style={chartStyle}
							options={options}
						/>
					</div>
					<div
						style={{ ...styles.sidebarArea, height: `${height}px` }}
					>
						<SidebarInfo type={activeVisType.value} />
						<div
							style={{
								...styles.sidebar,
							}}
						>
							<div className="hideScrollbar">
								<div style={styles.sidebarLabel}>
									Active Trendlines
								</div>
								{!allData && (
									<TrendlineSelector
										id={null}
										label={"No Data Loaded"}
										active={false}
										color={null}
										disabledIfInactive={false}
										handleOnClick={() => {}}
									/>
								)}
								{allData &&
									allData.map((item) => (
										<TrendlineSelector
											key={item.id}
											id={item.id}
											label={item.name}
											active={item.active}
											color={item.color}
											disabledIfInactive={
												activeTrendlines >= 5
											}
											handleOnClick={
												handleTrendlineSelectorClicked
											}
										/>
									))}
								{(activeVisType.value === "maximal" ||
									activeVisType.value === "minimal") && (
									<>
										<div
											style={{
												...styles.sidebarLabel,
												marginTop: "2rem",
											}}
										>
											Excluded Groups
										</div>
										<div
											style={{
												fontWeight: "400",
												fontFamily: "Inter",
												fontSize: "0.8rem",
												cursor:
													!groupingOption ||
													!granularityOption ||
													!minDateOption ||
													!maxDateOption
														? "not-allowed"
														: "pointer",
											}}
										>
											<Select
												options={diffTrendlineOptions}
												value={excludedOptions}
												onChange={setExcludedOptions}
												isMulti
												// Check that all other selectors are clicked
												isDisabled={
													!groupingOption ||
													!granularityOption ||
													!minDateOption ||
													!maxDateOption
												}
											/>
										</div>
									</>
								)}
								{legend && (
									<div
										style={{
											...styles.sidebarLabel,
											marginTop: "2rem",
										}}
									>
										Legend
										{legend.map((item, index) => (
											<div
												style={{
													marginTop: "0.3rem",
													marginBottom: "0.3rem",
													fontWeight: "400",
													fontSize: "0.85rem",
												}}
												key={index}
											>
												{item.key} - {item.value}
											</div>
										))}
									</div>
								)}
								<div
									style={{
										...styles.sidebarLabel,
										marginTop: "2rem  ",
									}}
								>
									Total Tuples
								</div>
								<div
									style={{
										fontFamily: "Inter",
										fontSize: "1.3rem",
										fontWeight: "800",
										textAlign: "start",
										marginBottom: "0.5rem",
										color: "#3a5a40 ",
									}}
								>
									{totalTuples}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const styles = {
	container: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		minHeight: "100vh",
	},
	visualizationArea: {
		display: "flex",
		flexDirection: "column",
		marginTop: "3rem",
		paddingBottom: "3rem",
		paddingLeft: "1.25rem",
		paddingRight: "1.25rem",
		boxSizing: "border-box",
	},
	chart: {
		width: "75%",
		padding: "1.2rem",
		marginRight: "0.75rem",
		backgroundColor: "white",
		borderRadius: "15px",
		position: "relative",
		boxSizing: "border-box",
	},
	sidebarArea: {
		flex: 1,
		boxSizing: "border-box",
		display: "flex",
		flexDirection: "column",
	},
	sidebar: {
		flex: 1,
		width: "100%",
		display: "flex",
		flexDirection: "column",
		backgroundColor: "white",
		borderRadius: "15px",
		overflow: "scroll",
		padding: "1rem",
		boxSizing: "border-box",
	},
	sidebarInner: {
		width: "100%",
		flex: "1 1 0",
		overflow: "auto",
	},
	visTypeSection: {
		backgroundColor: "white",
		borderRadius: "15px",
		marginBottom: "1rem",
		paddingLeft: "0.8rem",
		paddingRight: "1.3rem",
		paddingTop: "1.3rem",
		paddingBottom: "1.3rem",
		marginRight: "1rem",
		width: "13%",
	},
	parametersSection: {
		display: "flex",
		flex: 1,
		flexDirection: "column",
		alignItems: "start",
		backgroundColor: "white",
		borderRadius: "15px",
		marginBottom: "1rem",
		paddingLeft: "0.8rem",
		paddingRight: "1.3rem",
		paddingTop: "1.3rem",
		paddingBottom: "1.3rem",
	},
	visualizeButton: {
		flex: 0.75,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#3a5a40",
		boxSizing: "border-box",
		paddingTop: "0.9rem",
		paddingBottom: "0.9rem",
		paddingLeft: "1rem",
		paddingRight: "1rem",
		borderRadius: "10px",
		marginLeft: "0.5rem",
		position: "relative",
		overflow: "hidden",
	},
	visualizeText: {
		fontFamily: "Inter",
		color: "white",
		fontWeight: "600",
		fontSize: "1.05rem",
	},
	sidebarLabel: {
		fontFamily: "Inter",
		fontSize: "0.9rem",
		fontWeight: "600",
		textAlign: "start",
		marginBottom: "0.3rem",
		color: "#363636",
		overflow: "scroll",
	},
};

export default VisualizationScr;
