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

export const chartOptions = {
	scales: {
		yAxes: [
			{
				scaleLabel: {
					display: true,
					labelString: "My Y-Axis Label",
				},
			},
		],
	},
};

export const trendlineColors = [
	"#ff595e",
	"#ffca3a",
	"#8ac926",
	"#1982c4",
	"#6a4c93",
];

export const trendlineGroupingOptions = [
	{ value: "age", label: "Age Group" },
	{ value: "condition", label: "Condition" },
	{ value: "conditiongroup", label: "Condition Group" },
	{ value: "state", label: "State" },
];

export const temporalGranularityOptions = [
	{ value: "monthly", label: "Monthly" },
	{ value: "yearly", label: "Yearly" },
];

export const monthlyDateOptions = [
	{ value: "1_2020", label: "January 2020" },
	{ value: "2_2020", label: "February 2020" },
	{ value: "3_2020", label: "March 2020" },
	{ value: "4_2020", label: "April 2020" },
	{ value: "5_2020", label: "May 2020" },
	{ value: "6_2020", label: "June 2020" },
	{ value: "7_2020", label: "July 2020" },
	{ value: "8_2020", label: "August 2020" },
	{ value: "9_2020", label: "September 2020" },
	{ value: "10_2020", label: "October 2020" },
	{ value: "11_2020", label: "November 2020" },
	{ value: "12_2020", label: "December 2020" },
	{ value: "1_2021", label: "January 2021" },
	{ value: "2_2021", label: "February 2021" },
	{ value: "3_2021", label: "March 2021" },
	{ value: "4_2021", label: "April 2021" },
	{ value: "5_2021", label: "May 2021" },
	{ value: "6_2021", label: "June 2021" },
	{ value: "7_2021", label: "July 2021" },
	{ value: "8_2021", label: "August 2021" },
	{ value: "9_2021", label: "September 2021" },
	{ value: "10_2021", label: "October 2021" },
	{ value: "11_2021", label: "November 2021" },
	{ value: "12_2021", label: "December 2021" },
	{ value: "1_2022", label: "January 2022" },
	{ value: "2_2022", label: "February 2022" },
	{ value: "3_2022", label: "March 2022" },
	{ value: "4_2022", label: "April 2022" },
	{ value: "5_2022", label: "May 2022" },
	{ value: "6_2022", label: "June 2022" },
	{ value: "7_2022", label: "July 2022" },
	{ value: "8_2022", label: "August 2022" },
	{ value: "9_2022", label: "September 2022" },
	{ value: "10_2022", label: "October 2022" },
	{ value: "11_2022", label: "November 2022" },
	{ value: "12_2022", label: "December 2022" },
	{ value: "1_2023", label: "January 2023" },
	{ value: "2_2023", label: "February 2023" },
];

export const yearlyDateOptions = [
	{ value: "2020", label: "2020" },
	{ value: "2021", label: "2021" },
	{ value: "2022", label: "2022" },
];
