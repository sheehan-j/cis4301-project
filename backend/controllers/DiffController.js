const executeQuery = require("../util/executeQuery");
const translateLabels = require("../util/translateLabels");
const reformatData = require("../util/reformatData");

exports.getDiffDataMonthly = async (req, res) => {
  try {
    const group1Parts = req.params.group1.split("_");
    const group2Parts = req.params.group2.split("_");
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

    const diffResult = await executeQuery(`
      SELECT
        g1.year,
        g1.month,
        'Difference' as difference,
        ABS(g1.deaths - g2.deaths) AS deaths
      FROM
        (
          SELECT
            d.year,
            d.month,
            g.name AS ${group1Parts[0]},
            AVG(deaths) as deaths
          FROM JORDANSHEEHAN.Deaths d
          JOIN JORDANSHEEHAN.${group1Parts[0]} g
            ON d.${group1Parts[0]} = g.id
          ${dateRangeClause}
          GROUP BY year, month, g.name
          HAVING g.name = '${group1Parts[1]}'
        ) g1,
        (
          SELECT
            d.year,
            d.month,
            g.name AS ${group2Parts[0]},
            AVG(deaths) as deaths
          FROM JORDANSHEEHAN.Deaths d
          JOIN JORDANSHEEHAN.${group2Parts[0]} g
            ON d.${group2Parts[0]} = g.id
          ${dateRangeClause}
          GROUP BY year, month, g.name
          HAVING g.name = '${group2Parts[1]}'
        ) g2
      WHERE g1.year = g2.year
      AND g1.month = g2.month
      ORDER BY year, month
    `);

    const group1Result = await executeQuery(`
      SELECT
        d.year,
        d.month,
        g.name AS LABEL,
        AVG(deaths) as deaths
      FROM JORDANSHEEHAN.Deaths d
      JOIN JORDANSHEEHAN.${group1Parts[0]} g
        ON d.${group1Parts[0]} = g.id
      ${dateRangeClause}
      GROUP BY year, month, g.name
      HAVING g.name = '${group1Parts[1]}'
      ORDER BY year, month
    `);

    const group2Result = await executeQuery(`
      SELECT
        d.year,
        d.month,
        g.name AS LABEL,
        AVG(deaths) as deaths
      FROM JORDANSHEEHAN.Deaths d
      JOIN JORDANSHEEHAN.${group2Parts[0]} g
        ON d.${group2Parts[0]} = g.id
      ${dateRangeClause}
      GROUP BY year, month, g.name
      HAVING g.name = '${group2Parts[1]}'
      ORDER BY year, month
    `);

    const diffData = await reformatData(
      diffResult,
      [{ DIFFERENCE: "Difference" }],
      "DIFFERENCE",
      "MONTH",
      "DEATHS"
    );

    const group1Data = await reformatData(
      group1Result,
      [{ LABEL: `${group1Parts[1]}` }],
      "LABEL",
      "MONTH",
      "DEATHS"
    );

    const group2Data = await reformatData(
      group2Result,
      [{ LABEL: `${group2Parts[1]}` }],
      "LABEL",
      "MONTH",
      "DEATHS"
    );

    const result = [diffData[0], group1Data[0], group2Data[0]];
    result.map((item) => {
      item.labels = translateLabels(item.labels);
    });
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

exports.getDiffDataYearly = async (req, res) => {
  try {
    const group1Parts = req.params.group1.split("_");
    const group2Parts = req.params.group2.split("_");

    const diffResult = await executeQuery(`
      SELECT 
        g1.year,
        'Difference' as difference,
        ABS(g1.deaths - g2.deaths) AS deaths
      FROM 
        (
          SELECT 
            d.year,
            g.name AS ${group1Parts[0]},
            AVG(deaths) as deaths
          FROM JORDANSHEEHAN.Deaths d
          JOIN JORDANSHEEHAN.${group1Parts[0]} g
            ON d.${group1Parts[0]} = g.id
          WHERE year >= ${req.params.min}
          AND year <= ${req.params.max}
          GROUP BY year, g.name
          HAVING g.name = '${group1Parts[1]}'
        ) g1,
        (
          SELECT 
            d.year,
            g.name AS ${group2Parts[0]},
            AVG(deaths) as deaths
          FROM JORDANSHEEHAN.Deaths d
          JOIN JORDANSHEEHAN.${group2Parts[0]} g
            ON d.${group2Parts[0]} = g.id
          WHERE year >= ${req.params.min}
          AND year <= ${req.params.max}
          GROUP BY year, g.name
          HAVING g.name = '${group2Parts[1]}'
        ) g2
      WHERE g1.year = g2.year
      ORDER BY year
    `);

    const group1Result = await executeQuery(`
      SELECT 
        d.year,
        g.name AS LABEL,
        AVG(deaths) as deaths
      FROM JORDANSHEEHAN.Deaths d
      JOIN JORDANSHEEHAN.${group1Parts[0]} g
        ON d.${group1Parts[0]} = g.id
      WHERE year >= ${req.params.min}
      AND year <= ${req.params.max}
      GROUP BY year, g.name
      HAVING g.name = '${group1Parts[1]}'
      ORDER BY year
    `);

    const group2Result = await executeQuery(`
      SELECT 
        d.year,
        g.name AS LABEL,
        AVG(deaths) as deaths
      FROM JORDANSHEEHAN.Deaths d
      JOIN JORDANSHEEHAN.${group2Parts[0]} g
        ON d.${group2Parts[0]} = g.id
      WHERE year >= ${req.params.min}
      AND year <= ${req.params.max}
      GROUP BY year, g.name
      HAVING g.name = '${group2Parts[1]}'
      ORDER BY year
    `);

    const diffData = await reformatData(
      diffResult,
      [{ DIFFERENCE: "Difference" }],
      "DIFFERENCE",
      "YEAR",
      "DEATHS"
    );

    const group1Data = await reformatData(
      group1Result,
      [{ LABEL: `${group1Parts[1]}` }],
      "LABEL",
      "YEAR",
      "DEATHS"
    );

    const group2Data = await reformatData(
      group2Result,
      [{ LABEL: `${group2Parts[1]}` }],
      "LABEL",
      "YEAR",
      "DEATHS"
    );

    const result = [diffData[0], group1Data[0], group2Data[0]];
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};
