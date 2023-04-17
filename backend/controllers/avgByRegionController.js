const executeQuery = require("../util/executeQuery");
const translateLabels = require("../util/translateLabels");
const reformatData = require("../util/reformatData");

exports.getRegionDataMonthly = async (req, res) => {
  try {
    // Monthly dates are formatted like "3_2020", split
    // them apart to get year and month individually
    const minDateParts = req.params.min.split("_");
    const maxDateParts = req.params.max.split("_");

    // Format the date range WHERE clause based on the years
    let dateRangeClause;
    switch (parseInt(maxDateParts[1]) - parseInt(minDateParts[1])) {
      case 0: // Same year
        dateRangeClause = `
          WHERE 
            (year = ${minDateParts[1]})
            AND
            (month >= ${minDateParts[0]})
            AND
            (month <= ${maxDateParts[0]})
        `;
        break;
      case 1: // 1 Year apart
        dateRangeClause = `
          WHERE 
            (year = ${minDateParts[1]} AND month >= ${minDateParts[0]})
            OR
            (year = ${maxDateParts[1]} AND month <= ${maxDateParts[0]})
        `;
        break;
      default: // 2+ Years apart
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
        s.region as region, 
        AVG(deaths) as deaths
      FROM JORDANSHEEHAN.Deaths d
      JOIN JORDANSHEEHAN.State s ON d.state = s.id
      ${dateRangeClause}
      GROUP BY year, month, s.region
      ORDER BY year, month, s.region
    `);

    const regions = await executeQuery(`
      SELECT region
      FROM JORDANSHeehan.State
      ORDER BY region
    `);

    const result = await reformatData(
      queryResult,
      regions,
      "REGION",
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

exports.getRegionDataYearly = async (req, res) => {
  try {
    const queryResult = await executeQuery(`
      SELECT 
        year, 
        s.region as region, 
        AVG(deaths) as deaths
      FROM JORDANSHEEHAN.Deaths d
      JOIN JORDANSHEEHAN.State s ON d.state = s.id
      WHERE year >= ${req.params.min}
        AND year <= ${req.params.max}
      GROUP BY year, s.region
      ORDER BY year, s.region
    `);

    const states = await executeQuery(`
      SELECT region
      FROM JORDANSHeehan.State
      ORDER BY region
    `);

    const result = await reformatData(
      queryResult,
      states,
      "REGION",
      "YEAR",
      "DEATHS"
    );

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};
  