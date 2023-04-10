const months = [
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
];

const translateLabels = (labels) => {
  const newLabels = [];
  labels.forEach((item) => {
    newLabels.push(months[item - 1]);
  });
  return newLabels;
};

module.exports = translateLabels;
