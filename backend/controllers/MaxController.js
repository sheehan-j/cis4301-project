const executeQuery = require("../util/executeQuery");
const translateLabels = require("../util/translateLabels");

exports.getMaxDataMonthly = async (req, res) => {
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
      SELECT max1.year, max1.month, g.name, max1.deaths
      FROM (
          SELECT avg.year, avg.month, avg.${req.params.group}, max2.deaths
          FROM avg_deaths avg
          JOIN (
              SELECT year, month, max(deaths) as deaths
              FROM avg_deaths
              GROUP BY year, month
          ) max2 
          ON (avg.year = max2.year
              AND avg.month = max2.month
              AND avg.deaths = max2.deaths)
      ) max1
      JOIN ${req.params.group} g ON max1.${req.params.group} = g.id
      ${dateRangeClause}
      ORDER BY max1.year, max1.month
    `);

    const result = formatMaxDataResult(queryResult, "MONTH");

    result[0]["labels"] = translateLabels(result[0]["labels"]);
    result[1]["labels"] = translateLabels(result[1]["labels"]);

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

exports.getMaxDataYearly = async (req, res) => {
  const queryResult = await executeQuery(`
      WITH avg_deaths AS (
        SELECT DISTINCT year, ${req.params.group}, avg(deaths) as deaths
        FROM JORDANSHEEHAN.Deaths d
        JOIN JORDANSHEEHAN.State s ON d.state = s.id
        JOIN JORDANSHEEHAN.AgeGroup a ON d.agegroup = a.id
        JOIN JORDANSHEEHAN.Condition c ON d.condition = c.id
        JOIN JORDANSHEEHAN.ConditionGroup cg ON d.conditiongroup = cg.id
        WHERE s.name <> 'United States'
        AND a.name <> 'All Ages'
        AND c.name <> 'COVID-19'
        AND cg.name <> 'COVID-19'
        GROUP BY year, ${req.params.group}
      )
      SELECT max1.year, g.name, max1.deaths
      FROM (
          SELECT avg.year, avg.${req.params.group}, max2.deaths
          FROM avg_deaths avg
          JOIN (
              SELECT year, max(deaths) as deaths
              FROM avg_deaths
              GROUP BY year
          ) max2 
          ON (avg.year = max2.year
              AND avg.deaths = max2.deaths)
      ) max1
      JOIN ${req.params.group} g ON max1.${req.params.group} = g.id
      WHERE max1.year >= ${req.params.min}
      AND max1.year <= ${req.params.max}
      ORDER BY max1.year
    `);

  const result = formatMaxDataResult(queryResult, "YEAR");

  return res.status(200).json(result);
};

const formatMaxDataResult = (queryResult, granularity) => {
  // Set up arrays for data
  let labels = [];
  let values = [];
  let group = [];

  queryResult.map((item) => {
    // Check if there is multiple values for a specific month/year, meaning that there are two values that tied for the max for one month/year
    if (labels[labels.length - 1] === item[granularity]) {
      // Get the value of the last item in the group array, which is one of the groups that has tied
      const maxGroup1 = group[group.length - 1];
      // Change the value to a combination of the two tied groups
      group[group.length - 1] = `${maxGroup1}, ${item.NAME}`;
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
