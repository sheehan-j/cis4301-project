const executeQuery = require("../util/executeQuery");
const translateLabels = require("../util/translateLabels");
const reformatData = require("../util/reformatData");

exports.getStateDataMonthly = async (req, res) => {
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
        s.name as state, 
        AVG(deaths) as deaths
      FROM JORDANSHEEHAN.Deaths d
      JOIN JORDANSHEEHAN.State s ON d.state = s.id
      ${dateRangeClause}
      GROUP BY year, month, s.name
      ORDER BY year, month, s.name
    `);

    const states = await executeQuery(`
      SELECT name as state
      FROM JORDANSHeehan.State
      ORDER BY name
    `);

    const result = await reformatData(
      queryResult,
      states,
      "STATE",
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

exports.getStateDataYearly = async (req, res) => {
  try {
    const queryResult = await executeQuery(`
      SELECT 
        year, 
        s.name as state, 
        AVG(deaths) as deaths
      FROM JORDANSHEEHAN.Deaths d
      JOIN JORDANSHEEHAN.State s ON d.state = s.id
      WHERE year >= ${req.params.min}
        AND year <= ${req.params.max}
      GROUP BY year, s.name
      ORDER BY year, s.name
    `);

    const states = await executeQuery(`
      SELECT name as state
      FROM JORDANSHeehan.State
      ORDER BY name
    `);

    const result = await reformatData(
      queryResult,
      states,
      "STATE",
      "YEAR",
      "DEATHS"
    );

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};
