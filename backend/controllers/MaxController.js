const executeQuery = require("../util/executeQuery");
const translateLabels = require("../util/translateLabels");

exports.getMaxDataMonthly = async (req, res) => {
  try {
    const minDateParts = req.params.min.split("_");
    const maxDateParts = req.params.max.split("_");

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
        JOIN JORDANSHEEHAN.State s ON d.state = s.id
        JOIN JORDANSHEEHAN.AgeGroup a ON d.agegroup = a.id
        JOIN JORDANSHEEHAN.Condition c ON d.condition = c.id
        JOIN JORDANSHEEHAN.ConditionGroup cg ON d.conditiongroup = cg.id
        WHERE s.name <> 'United States'
        AND a.name <> 'All Ages'
        AND c.name <> 'COVID-19'
        AND cg.name <> 'COVID-19'
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

    // Set up data object
    const tempData = {};
    tempData["Group With Most Deaths"] = {};
    tempData["Group With Most Deaths"]["labels"] = [];
    tempData["Group With Most Deaths"]["values"] = [];
    tempData["Group With Most Deaths"]["group"] = [];
    tempData["Group With Most Deaths"]["legend"] = {};

    queryResult.map((item) => {
      tempData["Group With Most Deaths"]["labels"].push(item.MONTH);
      tempData["Group With Most Deaths"]["values"].push(item.DEATHS);
      tempData["Group With Most Deaths"]["group"].push(item.NAME);
    });

    const uniqueGroupsUnsorted = [
      ...new Set(tempData["Group With Most Deaths"]["group"]),
    ];
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
    tempData["Group With Most Deaths"]["group"].map((item) => {
      const target = legend.filter((legendItem) => legendItem.value === item);
      item = target.key;
      newGroups.push(target[0].key);
    });
    tempData["Group With Most Deaths"]["group"] = newGroups;

    const result = [
      {
        name: "Deaths",
        labels: tempData["Group With Most Deaths"]["labels"],
        values: tempData["Group With Most Deaths"]["values"],
      },
      {
        name: "Group",
        labels: tempData["Group With Most Deaths"]["labels"],
        values: tempData["Group With Most Deaths"]["group"],
      },
      {
        legend: legend,
      },
    ];

    result[0]["labels"] = translateLabels(result[0]["labels"]);
    result[1]["labels"] = translateLabels(result[1]["labels"]);

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};
