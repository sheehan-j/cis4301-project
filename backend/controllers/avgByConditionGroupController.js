const executeQuery = require("../util/executeQuery");
const translateLabels = require("../util/translateLabels");
const reformatData = require("../util/reformatData");

exports.getConditionGroupDataMonthly = async (req, res) => {
  try {
    // Monthly dates are formatted like "3_2020", split
    // them apart to get year and month individually
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
      SELECT 
        year, 
        month, 
        cg.name as conditiongroup, 
        AVG(deaths) as deaths
      FROM JORDANSHEEHAN.Deaths d
      JOIN JORDANSHEEHAN.ConditionGroup cg ON d.conditiongroup = cg.id
      ${dateRangeClause}
      GROUP BY year, month, cg.name
      ORDER BY year, month, cg.name
    `);

    const conditionGroups = await executeQuery(`
      SELECT name as conditiongroup
      FROM JORDANSHeehan.ConditionGroup
      ORDER BY name
    `);

    const result = await reformatData(
      queryResult,
      conditionGroups,
      "CONDITIONGROUP",
      "MONTH",
      "DEATHS"
    );

    // Translate month numbers into text labels
    result.map((item) => {
      item.labels = translateLabels(item.labels);
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

exports.getConditionGroupDataYearly = async (req, res) => {
  try {
    const queryResult = await executeQuery(`
      SELECT 
        year,  
        cg.name as conditiongroup, 
        AVG(deaths) as deaths
      FROM JORDANSHEEHAN.Deaths d
      JOIN JORDANSHEEHAN.ConditionGroup cg ON d.conditiongroup = cg.id
      WHERE year >= ${req.params.min}
        AND year <= ${req.params.max}
      GROUP BY year, cg.name
      ORDER BY year, cg.name
    `);

    const conditionGroups = await executeQuery(`
      SELECT name as conditiongroup
      FROM JORDANSHeehan.ConditionGroup
      ORDER BY name
    `);

    const result = await reformatData(
      queryResult,
      conditionGroups,
      "CONDITIONGROUP",
      "YEAR",
      "DEATHS"
    );

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};
