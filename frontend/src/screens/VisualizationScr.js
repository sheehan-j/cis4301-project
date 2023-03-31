import React from "react";
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

const DataScr = () => {
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
		<div id="chart-div" style={{ width: "50vw", height: `${height}px` }}>
			{!isLoading && <Line data={testData} />}
			{isLoading && <Loading />}
		</div>
	);
};

export default DataScr;
