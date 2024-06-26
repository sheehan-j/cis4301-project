const executeQuery = require("../util/executeQuery");
const translateLabels = require("../util/translateLabels");

exports.getMinMaxDataMonthly = async (req, res) => {
  try {
    const minDateParts = req.params.min.split("_");
    const maxDateParts = req.params.max.split("_");

    // Process any possible excluded values into a clause for the SQL query
    let excludedValuesClause = ``;
    if (req.query.excludedValues) {
      const splitExcludedValues = req.query.excludedValues.split(",");

      splitExcludedValues.forEach((item, index) => {
        const currValue = item.split("_");

        let currLine = index === 0 ? `WHERE ` : `AND `;
        currLine += `${currValue[0]}.name <> '${currValue[1]}'\n`;

        excludedValuesClause += currLine;
      });
    }

    // Format the date range WHERE clause based on the years
    let dateRangeClause;
    switch (parseInt(maxDateParts[1]) - parseInt(minDateParts[1])) {
      case 0:
        dateRangeClause = `
          WHERE 
            (year = ${minDateParts[1]})
            AND
            (month >= ${minDateParts[0]})
            AND
            (month <= ${maxDateParts[0]})
        `;
        break;
      case 1:
        dateRangeClause = `
          WHERE 
            (year = ${minDateParts[1]} AND month >= ${minDateParts[0]})
            OR
            (year = ${maxDateParts[1]} AND month <= ${maxDateParts[0]})
        `;
        break;
      default:
        dateRangeClause = `
          WHERE 
            (year = ${minDateParts[1]} AND month >= ${minDateParts[0]})
            OR 
            (year > ${minDateParts[1]} AND year < ${maxDateParts[1]})
            OR
            (year = ${maxDateParts[1]} AND month <= ${maxDateParts[0]})
        `;
    }

    const queryResult = await executeQuery(`
      WITH avg_deaths AS (
        SELECT DISTINCT year, month, ${req.params.group}, avg(deaths) as deaths
        FROM JORDANSHEEHAN.Deaths d
        JOIN JORDANSHEEHAN.State ON d.state = State.id
        JOIN JORDANSHEEHAN.AgeGroup ON d.agegroup = AgeGroup.id
        JOIN JORDANSHEEHAN.Condition ON d.condition = Condition.id
        JOIN JORDANSHEEHAN.ConditionGroup ON d.conditiongroup = ConditionGroup.id
        ${excludedValuesClause}
        GROUP BY year, month, ${req.params.group}
      )
      SELECT d1.year, d1.month, g.name, d1.deaths
      FROM (
          SELECT avg.year, avg.month, avg.${req.params.group}, d2.deaths
          FROM avg_deaths avg
          JOIN (
              SELECT year, month, ${req.params.type}(deaths) as deaths
              FROM avg_deaths
              GROUP BY year, month
          ) d2 
          ON (avg.year = d2.year
              AND avg.month = d2.month
              AND avg.deaths = d2.deaths)
      ) d1
      JOIN ${req.params.group} g ON d1.${req.params.group} = g.id
      ${dateRangeClause}
      ORDER BY d1.year, d1.month
    `);

    const result = formatDataResult(queryResult, "MONTH");

    result[0]["labels"] = translateLabels(result[0]["labels"]);
    result[1]["labels"] = translateLabels(result[1]["labels"]);

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

exports.getMinMaxDataYearly = async (req, res) => {
  // Process any possible excluded values into a clause for the SQL query
  let excludedValuesClause = ``;
  if (req.query.excludedValues) {
    const splitExcludedValues = req.query.excludedValues.split(",");

    splitExcludedValues.forEach((item, index) => {
      const currValue = item.split("_");

      let currLine = index === 0 ? `WHERE ` : `AND `;
      currLine += `${currValue[0]}.name <> '${currValue[1]}'\n`;

      excludedValuesClause += currLine;
    });
  }

  const queryResult = await executeQuery(`
      WITH avg_deaths AS (
        SELECT DISTINCT year, ${req.params.group}, avg(deaths) as deaths
        FROM JORDANSHEEHAN.Deaths d
        JOIN JORDANSHEEHAN.State ON d.state = State.id
        JOIN JORDANSHEEHAN.AgeGroup ON d.agegroup = AgeGroup.id
        JOIN JORDANSHEEHAN.Condition ON d.condition = Condition.id
        JOIN JORDANSHEEHAN.ConditionGroup ON d.conditiongroup = ConditionGroup.id
        ${excludedValuesClause}
        GROUP BY year, ${req.params.group}
      )
      SELECT d1.year, g.name, d1.deaths
      FROM (
          SELECT avg.year, avg.${req.params.group}, d2.deaths
          FROM avg_deaths avg
          JOIN (
              SELECT year, ${req.params.type}(deaths) as deaths
              FROM avg_deaths
              GROUP BY year
          ) d2 
          ON (avg.year = d2.year
              AND avg.deaths = d2.deaths)
      ) d1
      JOIN ${req.params.group} g ON d1.${req.params.group} = g.id
      WHERE d1.year >= ${req.params.min}
      AND d1.year <= ${req.params.max}
      ORDER BY d1.year
    `);

  const result = formatDataResult(queryResult, "YEAR");

  return res.status(200).json(result);
};

const formatDataResult = (queryResult, granularity) => {
  // Set up arrays for data
  let labels = [];
  let values = [];
  let group = [];

  queryResult.map((item) => {
    // Check if there is multiple values for a specific month/year, meaning that there are two values that tied for the max for one month/year
    if (labels[labels.length - 1] === item[granularity]) {
      // Get the value of the last item in the group array, which is one of the groups that has tied
      const group1 = group[group.length - 1];
      // Change the value to a combination of the two tied groups
      group[group.length - 1] = `${group1}, ${item.NAME}`;
    } else {
      labels.push(item[granularity]);
      values.push(item.DEATHS);
      group.push(item.NAME);
    }
  });

  const uniqueGroupsUnsorted = [...new Set(group)];
  const uniqueGroups = new Set([...uniqueGroupsUnsorted].sort());

  const legend = [];
  let index = 0;
  for (const str of uniqueGroups) {
    const newLegendObj = {};
    newLegendObj["key"] = index;
    newLegendObj["value"] = str;
    legend.push(newLegendObj);
    index++;
  }

  const newGroups = [];
  group.map((item) => {
    const target = legend.filter((legendItem) => legendItem.value === item);
    item = target.key;
    newGroups.push(target[0].key);
  });
  group = newGroups;

  const result = [
    {
      name: "Deaths",
      labels: labels,
      values: values,
    },
    {
      name: "Group",
      labels: labels,
      values: group,
    },
    {
      legend: legend,
    },
  ];

  return result;
};
