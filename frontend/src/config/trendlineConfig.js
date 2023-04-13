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
	tooltips: {
		callbacks: {
			title: function (tooltipItem, data) {
				return tooltipItem[0].xLabel;
			},
			label: function (tooltipItem, data) {
				const dataset = data.datasets[tooltipItem.datasetIndex];
				const dataItem = dataset.data[tooltipItem.index];
				return `${dataset.label}: ${dataItem.y}, ${dataItem.info}`;
			},
		},
	},
};

export const trendlineColors = [
	"#ff595e",
	"#ffca3a",
	"#8ac926",
	"#1982c4",
	"#6a4c93",
];

export const visTypeOptions = [
	{ value: "average", label: "Average" },
	{ value: "difference", label: "Difference" },
	{ value: "maximal", label: "Maximal" },
	{ value: "minimal", label: "Minimal" },
];

export const trendlineGroupingOptions = [
	{ value: "agegroup", label: "Age Group" },
	{ value: "condition", label: "Condition" },
	{ value: "conditiongroup", label: "Condition Group" },
	{ value: "state", label: "State" },
];

export const diffTrendlineOptions = [
	{
		label: "Age Groups",
		options: [
			{ value: "AgeGroup_All Ages", label: "All Age Groups" },
			{ value: "AgeGroup_0-24", label: "0-24" },
			{ value: "AgeGroup_25-34", label: "25-34" },
			{ value: "AgeGroup_35-44", label: "35-44" },
			{ value: "AgeGroup_45-54", label: "45-54" },
			{ value: "AgeGroup_55-64", label: "55-64" },
			{ value: "AgeGroup_65-74", label: "65-74" },
			{ value: "AgeGroup_75-84", label: "75-84" },
			{ value: "AgeGroup_85+", label: "85+" },
			{ value: "AgeGroup_Not stated", label: "Not stated" },
		],
	},
	{
		label: "Conditions",
		options: [
			{
				value: "Condition_Adult respiratory distress syndrome",
				label: "Adult respiratory distress syndrome",
			},
			{
				value: "Condition_All other conditions and causes (residual)",
				label: "All other conditions and causes (residual)",
			},
			{
				value: "Condition_Alzheimer disease",
				label: "Alzheimer disease",
			},
			{ value: "Condition_COVID-19", label: "COVID-19" },
			{ value: "Condition_Cardiac arrest", label: "Cardiac arrest" },
			{
				value: "Condition_Cardiac arrhythmia",
				label: "Cardiac arrhythmia",
			},
			{
				value: "Condition_Cerebrovascular diseases",
				label: "Cerebrovascular diseases",
			},
			{
				value: "Condition_Chronic lower respiratory diseases",
				label: "Chronic lower respiratory diseases",
			},
			{ value: "Condition_Diabetes", label: "Diabetes" },
			{ value: "Condition_Heart failure", label: "Heart failure" },
			{
				value: "Condition_Hypertensive diseases",
				label: "Hypertensive diseases",
			},
			{
				value: "Condition_Influenza and pneumonia",
				label: "Influenza and pneumonia",
			},
			{
				value: "Condition_Intentional and unintentional injury, poisoning, and other adverse events",
				label: "Intentional and unintentional injury, poisoning, and other adverse events",
			},
			{
				value: "Condition_Ischemic heart disease",
				label: "Ischemic heart disease",
			},
			{
				value: "Condition_Malignant neoplasms",
				label: "Malignant neoplasms",
			},
			{ value: "Condition_Obesity", label: "Obesity" },
			{
				value: "Condition_Other diseases of the circulatory system",
				label: "Other diseases of the circulatory system",
			},
			{
				value: "Condition_Other diseases of the respiratory system",
				label: "Other diseases of the respiratory system",
			},
			{ value: "Condition_Renal failure", label: "Renal failure" },
			{
				value: "Condition_Respiratory arrest",
				label: "Respiratory arrest",
			},
			{
				value: "Condition_Respiratory failure",
				label: "Respiratory failure",
			},
			{ value: "Condition_Sepsis", label: "Sepsis" },
			{
				value: "Condition_Vascular and unspecified dementia",
				label: "Vascular and unspecified dementia",
			},
		],
	},
	{
		label: "Condition Groups",
		options: [
			{
				value: "ConditionGroup_All other conditions and causes (residual)",
				label: "All other conditions and causes (residual)",
			},
			{
				value: "ConditionGroup_Alzheimer disease",
				label: "Alzheimer disease",
			},
			{ value: "ConditionGroup_COVID-19", label: "COVID-19" },
			{
				value: "ConditionGroup_Circulatory diseases",
				label: "Circulatory diseases",
			},
			{ value: "ConditionGroup_Diabetes", label: "Diabetes" },
			{
				value: "ConditionGroup_Intentional and unintentional injury, poisoning, and other adverse events",
				label: "Intentional and unintentional injury, poisoning, and other adverse events",
			},
			{
				value: "ConditionGroup_Malignant neoplasms",
				label: "Malignant neoplasms",
			},
			{ value: "ConditionGroup_Obesity", label: "Obesity" },
			{ value: "ConditionGroup_Renal failure", label: "Renal failure" },
			{
				value: "ConditionGroup_Respiratory diseases",
				label: "Respiratory diseases",
			},
			{ value: "ConditionGroup_Sepsis", label: "Sepsis" },
			{
				value: "ConditionGroup_Vascular and unspecified dementia",
				label: "Vascular and unspecified dementia",
			},
		],
	},
	{
		label: "States",
		options: [
			{ value: "State_Alabama", label: "Alabama" },
			{ value: "State_Alaska", label: "Alaska" },
			{ value: "State_Arizona", label: "Arizona" },
			{ value: "State_Arkansas", label: "Arkansas" },
			{ value: "State_California", label: "California" },
			{ value: "State_Colorado", label: "Colorado" },
			{ value: "State_Connecticut", label: "Connecticut" },
			{ value: "State_Delaware", label: "Delaware" },
			{
				value: "State_District of Columbia",
				label: "District of Columbia",
			},
			{ value: "State_Florida", label: "Florida" },
			{ value: "State_Georgia", label: "Georgia" },
			{ value: "State_Hawaii", label: "Hawaii" },
			{ value: "State_Idaho", label: "Idaho" },
			{ value: "State_Illinois", label: "Illinois" },
			{ value: "State_Indiana", label: "Indiana" },
			{ value: "State_Iowa", label: "Iowa" },
			{ value: "State_Kansas", label: "Kansas" },
			{ value: "State_Kentucky", label: "Kentucky" },
			{ value: "State_Louisiana", label: "Louisiana" },
			{ value: "State_Maine", label: "Maine" },
			{ value: "State_Maryland", label: "Maryland" },
			{ value: "State_Massachusetts", label: "Massachusetts" },
			{ value: "State_Michigan", label: "Michigan" },
			{ value: "State_Minnesota", label: "Minnesota" },
			{ value: "State_Mississippi", label: "Mississippi" },
			{ value: "State_Missouri", label: "Missouri" },
			{ value: "State_Montana", label: "Montana" },
			{ value: "State_Nebraska", label: "Nebraska" },
			{ value: "State_Nevada", label: "Nevada" },
			{ value: "State_New Hampshire", label: "New Hampshire" },
			{ value: "State_New Jersey", label: "New Jersey" },
			{ value: "State_New Mexico", label: "New Mexico" },
			{ value: "State_New York", label: "New York" },
			{ value: "State_New York City", label: "New York City" },
			{ value: "State_North Carolina", label: "North Carolina" },
			{ value: "State_North Dakota", label: "North Dakota" },
			{ value: "State_Ohio", label: "Ohio" },
			{ value: "State_Oklahoma", label: "Oklahoma" },
			{ value: "State_Oregon", label: "Oregon" },
			{ value: "State_Pennsylvania", label: "Pennsylvania" },
			{ value: "State_Puerto Rico", label: "Puerto Rico" },
			{ value: "State_Rhode Island", label: "Rhode Island" },
			{ value: "State_South Carolina", label: "South Carolina" },
			{ value: "State_South Dakota", label: "South Dakota" },
			{ value: "State_Tennessee", label: "Tennessee" },
			{ value: "State_Texas", label: "Texas" },
			{ value: "State_United States", label: "United States" },
			{ value: "State_Utah", label: "Utah" },
			{ value: "State_Vermont", label: "Vermont" },
			{ value: "State_Virginia", label: "Virginia" },
			{ value: "State_Washington", label: "Washington" },
			{ value: "State_West Virginia", label: "West Virginia" },
			{ value: "State_Wisconsin", label: "Wisconsin" },
			{ value: "State_Wyoming", label: "Wyoming" },
		],
	},
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
