import { useEffect, useState } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import Select from "react-select";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

export const defaultData = {
	labels: [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	],
	datasets: [
		{
			label: "",
			data: [],
			borderColor: "rgb(255, 99, 132)",
			backgroundColor: "rgba(255, 99, 132, 0.5)",
		},
	],
};

const VisualizationScr = () => {
	const [testData, setTestData] = useState(defaultData);
	const [isLoading, setIsLoading] = useState(true);

	// Handle enforcing aspect ratio of 2 on chart container div
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

	useEffect(() => {
		const loadData = async () => {
			const TEST_URL = "http://localhost:8089/api/test";

			const response = await fetch(TEST_URL, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const result = await response.json();

			const data = {
				labels: result.labels,
				datasets: [
					{
						label: "Test Data",
						data: result.values,
						fill: false,
						borderColor: "rgb(75, 192, 192)",
						tension: 0.1,
					},
				],
			};

			setTestData(data);
			setIsLoading(false);
		};

		loadData();
	}, []);

	return (
		<div style={styles.container}>
			<Navbar active={"Visualizations"} />

			<div style={styles.visualizationArea}>
				<div style={styles.parametersSection}>
					<div
						style={{
							fontFamily: "Inter",
							color: "#363636",
							fontWeight: "700",
							fontSize: "1.2rem",
						}}
					>
						Customize Visualization Parameters
						<div
							style={{
								fontWeight: "400",
								textAlign: "start",
								fontSize: "0.8rem",
								width: "50%",
							}}
						>
							<Select
								options={options}
								styles={{
									control: (baseStyles, state) => ({
										...baseStyles,
										borderColor: state.isFocused
											? "blue"
											: "grey",
									}),
								}}
							/>
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
							...styles.chart,
							height: `${height}px`,
						}}
					>
						{isLoading && <Loading />}
						{!isLoading && <Line data={testData} />}
					</div>
					<div style={styles.sidebar}>b</div>
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
		backgroundColor: "white",
		marginLeft: "0.5rem",
		borderRadius: "15px",
	},
	parametersSection: {
		display: "flex",
		flex: 1,
		backgroundColor: "white",
		borderRadius: "15px",
		marginBottom: "0.5rem",
		padding: "1.3rem",
	},
};

const options = [
	{ value: "chocolate", label: "Chocolate" },
	{ value: "strawberry", label: "Strawberry" },
	{ value: "vanilla", label: "Vanilla" },
];

export default VisualizationScr;
