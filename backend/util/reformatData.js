const reformatData = async (
  queryResult,
  groups,
  groupName,
  timeUnit,
  yAxis
) => {
  // Create a result object and add empty arrays for labels
  // and values that correspond to each group
  const tempArrays = {};
  groups.map((item) => {
    tempArrays[item[groupName]] = {};
    tempArrays[item[groupName]]["labels"] = [];
    tempArrays[item[groupName]]["values"] = [];
  });

  // Add the labels and values to their respective groups
  queryResult.map((item) => {
    tempArrays[item[groupName]]["labels"].push(item[timeUnit]);
    tempArrays[item[groupName]]["values"].push(item[yAxis]);
  });

  const result = [];
  groups.map((item) => {
    const newObject = {
      name: item[groupName],
      labels: tempArrays[item[groupName]]["labels"],
      values: tempArrays[item[groupName]]["values"],
    };

    result.push(newObject);
  });

  return result;
};

module.exports = reformatData;
