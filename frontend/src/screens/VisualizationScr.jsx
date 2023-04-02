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

import {
	defaultData,
	trendlineGroupingOptions,
	temporalGranularityOptions,
	monthlyDateOptions,
	yearlyDateOptions,
	trendlineColors,
} from "../config/trendlineConfig";

import TotalCountsApi from "../api/TotalCountsApi";
import { ApiCall } from "../util/ApiCall";
import { UpdateNewActiveTrendlines } from "../util/UpdateNewActiveTrendlines";

import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import Selector from "../components/Selector";
import TrendlineSelector from "../components/TrendlineSelector";
import scrollbarStyles from "./Scrollbar.css";

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
	const [groupingOption, setGroupingOption] = useState(null);
	const [granularityOption, setGranularityOption] = useState(null);
	const [currentDateOptions, setCurrentDateOptions] = useState(null);
	const [minDateOption, setMinDateOption] = useState(null);
	const [maxDateOption, setMaxDateOption] = useState(null);
	const [dateSelectIsDisabled, setDateSelectIsDisabled] = useState(true);
	const [activeTrendlines, setActiveTrendlines] = useState(0);
	const [totalTuples, setTotalTuples] = useState("...");

	// Handle width, height, and styling for the chart
	const [width, setWidth] = useState(0);
	useEffect(() => {
		const handleResize = () => {
			const chartDiv = document.getElementById("chart-div");
			const newWidth = chartDiv.offsetWidth;
			setWidth(newWidth);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	const height = width / 2;
	const chartStyle = {
		opacity: isLoading ? 0.25 : 1,
	};

	// Load total tuple counts on render
	useEffect(() => {
		const loadTotalTuples = async () => {
			const result = await TotalCountsApi.getTotalTupleCount();
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

	const handleVisualize = async () => {
		setIsLoading(true);
		setVisualizedData(defaultData);
		setAllData(null);

		const result = await ApiCall(
			groupingOption.value,
			granularityOption.value,
			minDateOption.value,
			maxDateOption.value
		);

		// Add an attribute to track whether
		// each trendline is being visualized
		result.map((item, index) => {
			item.active = index <= 4;
			item.id = index;
			item.color = trendlineColors[index];
			return item;
		});

		const datasets = [];
		result.forEach((item) => {
			if (item.active) {
				const newDataset = {
					label: item.name,
					data: item.values,
					borderColor: item.color,
					backgroundColor: item.color,
				};

				datasets.push(newDataset);
			}
		});

		const data = {
			labels: result[0].labels,
			datasets: datasets,
		};

		setActiveTrendlines(5);
		setVisualizedData(data);
		setAllData(result);
		setIsLoading(false);
	};

	const handleTrendlineSelectorClicked = (id) => {
		const updatedData = UpdateNewActiveTrendlines(
			id,
			allData,
			activeTrendlines
		);
		setAllData(updatedData.newAllData);
		setActiveTrendlines(updatedData.newActiveTrendlines);
		setVisualizedData(updatedData.newVisualizedData);
	};

	return (
		<div style={visStlyes.container}>
			<Navbar active={"Visualizations"} />

			<div style={visStlyes.visualizationArea}>
				<div style={visStlyes.parametersSection}>
					<div
						style={{
							width: "100%",
							display: "flex",
							flexDirection: "row",
						}}
					>
						<Selector
							label={"Trendline Grouping"}
							selectOptions={trendlineGroupingOptions}
							value={groupingOption}
							onChange={setGroupingOption}
							isDisabled={false}
						/>
						<Selector
							label={"Temporal Granularity"}
							selectOptions={temporalGranularityOptions}
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
						<div
							style={visStlyes.visualizeButton}
							onClick={handleVisualize}
						>
							<div style={visStlyes.visualizeText}>Visualize</div>
						</div>
					</div>
				</div>

				<div
					style={{
						display: "flex",
						flex: 1,
						flexDirection: "row",
					}}
				>
					<div
						id="chart-div"
						style={{
							...visStlyes.chart,
							position: "relative",
							height: `${height}px`,
						}}
					>
						{isLoading && <Loading />}
						<Line data={visualizedData} style={chartStyle} />
					</div>
					<div style={visStlyes.sidebar}>
						<div
							style={visStlyes.sidebarInner}
							className={scrollbarStyles["hideScrollbar"]}
						>
							<div
								style={{
									fontFamily: "Inter",
									fontSize: "0.9rem",
									fontWeight: "600",
									textAlign: "start",
									marginBottom: "0.5rem",
									color: "#363636",
								}}
							>
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
							<div
								style={{
									fontFamily: "Inter",
									fontSize: "0.9rem",
									fontWeight: "600",
									textAlign: "start",
									marginTop: "2rem",
									marginBottom: "0.3rem",
									color: "#363636",
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
	);
};

const visStlyes = {
	container: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		paddingTop: "0.5rem",
	},
	visualizationArea: {
		width: "75%",
		display: "flex",
		flexDirection: "column",
		marginTop: "3rem",
	},
	chart: {
		width: "75%",
		padding: "1rem",
		marginRight: "0.5rem",
		backgroundColor: "white",
		borderRadius: "15px",
	},
	sidebar: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
		backgroundColor: "white",
		marginLeft: "0.5rem",
		borderRadius: "15px",
		padding: "1rem",
	},
	sidebarInner: {
		width: "100%",
		flex: "1 1 0",
		overflow: "auto",
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
		cursor: "pointer",
	},
	visualizeText: {
		fontFamily: "Inter",
		color: "white",
		fontWeight: "600",
		fontSize: "1.05rem",
	},
};

export default VisualizationScr;
