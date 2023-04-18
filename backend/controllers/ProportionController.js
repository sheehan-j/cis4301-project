const executeQuery = require("../util/executeQuery");
const translateLabels = require("../util/translateLabels");
const reformatData = require("../util/reformatData");

exports.getProportionDataMonthly = async (req, res) => {
  try {
    const groupParts = req.params.group.split("_");
    const minDateParts = req.params.min.split("_");
    const maxDateParts = req.params.max.split("_");

    // Format the date range WHERE clause based on the years
    let dateRangeClause;
    switch (parseInt(maxDateParts[1]) - parseInt(minDateParts[1])) {
      case 0:
        dateRangeClause = `
          WHERE 
            (s.year = ${minDateParts[1]})
            AND
            (s.month >= ${minDateParts[0]})
            AND
            (s.month <= ${maxDateParts[0]})
        `;
        break;
      case 1:
        dateRangeClause = `
          WHERE 
            (s.year = ${minDateParts[1]} AND s.month >= ${minDateParts[0]})
            OR
            (s.year = ${maxDateParts[1]} AND s.month <= ${maxDateParts[0]})
        `;
        break;
      default:
        dateRangeClause = `
          WHERE 
            (s.year = ${minDateParts[1]} AND s.month >= ${minDateParts[0]})
            OR 
            (s.year > ${minDateParts[1]} AND s.year < ${maxDateParts[1]})
            OR
            (s.year = ${maxDateParts[1]} AND s.month <= ${maxDateParts[0]})
        `;
    }

    const queryResult = await executeQuery(`
      SELECT s.year, s.month, s.name AS groupname, (s.specific_deaths/a.all_deaths) AS ratio
      FROM (
          SELECT d.year, d.month, g.name as name, AVG(deaths) as specific_deaths
          FROM Deaths d
          JOIN ${groupParts[0]} g ON d.${groupParts[0]} = g.id
          GROUP BY d.year, d.month, g.name
          HAVING g.name = '${groupParts[1]}'
      ) s
      JOIN (
          SELECT d.year, d.month, AVG(deaths) as all_deaths
          FROM Deaths d
          JOIN AgeGroup ag ON d.agegroup = ag.id
          WHERE ag.name = 'All Ages'
          GROUP by d.year, d.month
      ) a
      ON (s.year = a.year AND s.month = a.month)
      ${dateRangeClause}
      ORDER by s.year, s.month
    `);

    // Reformat query result and rename its label
    const queryData = await reformatData(
      queryResult,
      [{ GROUPNAME: `${groupParts[1]}` }],
      "GROUPNAME",
      "MONTH",
      "RATIO"
    );
    queryData[0].name = "Ratio";

    const groupResult = await executeQuery(`
      SELECT s.year, s.month, g.name as groupname, AVG(deaths) as deaths
      FROM Deaths s
      JOIN ${groupParts[0]} g ON s.${groupParts[0]} = g.id
      ${dateRangeClause}
      GROUP BY s.year, s.month, g.name
      HAVING g.name = '${groupParts[1]}'
      ORDER BY s.year, s.month
    `);

    // Reformat query result and rename its label
    const groupData = await reformatData(
      groupResult,
      [{ GROUPNAME: `${groupParts[1]}` }],
      "GROUPNAME",
      "MONTH",
      "DEATHS"
    );

    const allResult = await executeQuery(`
      SELECT s.year, s.month, ag.name AS groupname, AVG(deaths) as deaths
      FROM Deaths s
      JOIN AgeGroup ag ON s.agegroup = ag.id
      ${dateRangeClause}
      GROUP by s.year, s.month, ag.name
      HAVING ag.name = 'All Ages'
      ORDER BY s.year, s.month
    `);

    const allData = await reformatData(
      allResult,
      [{ GROUPNAME: "All Ages" }],
      "GROUPNAME",
      "MONTH",
      "DEATHS"
    );

    const result = [queryData[0], groupData[0], allData[0]];
    result.map((item) => {
      item.labels = translateLabels(item.labels);
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: err.message });
  }
};

exports.getProportionDataYearly = async (req, res) => {
  try {
    const groupParts = req.params.group.split("_");

    const queryResult = await executeQuery(`
      SELECT s.year, s.name AS groupname, (s.specific_deaths/a.all_deaths) AS ratio
      FROM (
          SELECT d.year, g.name as name, AVG(deaths) as specific_deaths
          FROM Deaths d
          JOIN ${groupParts[0]} g ON d.${groupParts[0]} = g.id
          GROUP BY d.year, g.name
          HAVING g.name = '${groupParts[1]}'
      ) s
      JOIN (
          SELECT d.year, AVG(deaths) as all_deaths
          FROM Deaths d
          JOIN AgeGroup ag ON d.agegroup = ag.id
          WHERE ag.name = 'All Ages'
          GROUP by d.year
      ) a
      ON s.year = a.year
      WHERE s.year >= ${req.params.min}
      AND s.year <= ${req.params.max}
      ORDER by s.year
    `);

    // Reformat query result and rename its label
    const queryData = await reformatData(
      queryResult,
      [{ GROUPNAME: `${groupParts[1]}` }],
      "GROUPNAME",
      "YEAR",
      "RATIO"
    );
    queryData[0].name = "Ratio";

    const groupResult = await executeQuery(`
      SELECT s.year, g.name as groupname, AVG(deaths) as deaths
      FROM Deaths s
      JOIN ${groupParts[0]} g ON s.${groupParts[0]} = g.id
      WHERE s.year >= ${req.params.min}
      AND s.year <= ${req.params.max}
      GROUP BY s.year, g.name
      HAVING g.name = '${groupParts[1]}'
      ORDER BY s.year
    `);

    // Reformat query result and rename its label
    const groupData = await reformatData(
      groupResult,
      [{ GROUPNAME: `${groupParts[1]}` }],
      "GROUPNAME",
      "YEAR",
      "DEATHS"
    );

    const allResult = await executeQuery(`
      SELECT s.year, ag.name AS groupname, AVG(deaths) as deaths
      FROM Deaths s
      JOIN AgeGroup ag ON s.agegroup = ag.id
      WHERE s.year >= ${req.params.min}
      AND s.year <= ${req.params.max}
      GROUP by s.year, ag.name
      HAVING ag.name = 'All Ages'
      ORDER BY s.year
    `);

    const allData = await reformatData(
      allResult,
      [{ GROUPNAME: "All Ages" }],
      "GROUPNAME",
      "YEAR",
      "DEATHS"
    );

    const result = [queryData[0], groupData[0], allData[0]];
    console.log(JSON.stringify(result));
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: err.messsage });
  }
};
