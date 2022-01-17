const { selectRows } = require("../../../modules/db");

export default async function (req, res) {
  const school = [JSON.parse(req.body)];
  const ballDataReq = `SELECT school.name, pre.name as prefecture, ball.year, ball.nationalbest, ball.regionalbest
     FROM schools school INNER JOIN baseball ball ON school.id = ball.schoolid INNER JOIN prefecture pre ON pre.id = ball.prefectureid where school.name = $1;`;

  const data = await selectRows(ballDataReq, school);

  res.status(200).json({
    data,
  });
}
