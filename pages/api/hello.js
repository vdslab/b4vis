const { selectRows } = require("../../modules/db");

export default async function (req, res) {
  const sample = "select * from schools limit 5";

  /** LineChart */
  // $1 に schoolが入る(プレースホルダ)
  const school = ["神奈川県立相模原高等学校"];
  const brassData = `SELECT school.name, pre.name, brass.year, brass.prize, brass.last, brass.representative
  FROM schools school INNER JOIN brassBand brass ON school.id = brass.schoolid INNER JOIN prefecture pre ON pre.id = brass.prefectureid where school.name = $1;`;
  const ballData = `SELECT school.name, pre.name, ball.year, ball.nationalbest, ball.regionalbest
     FROM schools school INNER JOIN baseball ball ON school.id = ball.schoolid INNER JOIN prefecture pre ON pre.id = ball.prefectureid where school.name = $1;`;

  const data = await selectRows(ballData, school);

  res.status(200).json({
    data,
  });
}
