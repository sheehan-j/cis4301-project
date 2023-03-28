import React from "react";
import { useEffect, useState } from "react";

const DataScr = () => {
	const [testData, setTestData] = useState([]);

	useEffect(() => {
		const getTestData = async () => {
			const TEST_URL = "http://localhost:8089/api/test";

			const response = await fetch(TEST_URL, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const result = await response.json();
			setTestData(result);
		};

		getTestData();
	}, []);

	return <div>{JSON.stringify(testData)}</div>;
};

export default DataScr;
