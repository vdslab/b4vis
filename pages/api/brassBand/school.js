const { selectRows } = require("../../../modules/db");

export default async function (req, res) {
  const school = [JSON.parse(req.body)];
  const brassDataReq = `SELECT school.name, pre.name as prefecture, brass.year, brass.prize, brass.last, brass.representative
  FROM schools school INNER JOIN brassBand brass ON school.id = brass.schoolid INNER JOIN prefecture pre ON pre.id = brass.prefectureid where school.name = $1;`;

  const data = await selectRows(brassDataReq, school);

  res.status(200).json({
    data,
  });
}
