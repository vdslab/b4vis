// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// export default function handler(req, res) {
//   res.status(200).json({ name: "John Doe" });
// }

import { sqlExecuter } from "../../modules/db";

export default async function (req, res) {
  const data = await sqlExecuter.any("select * from schools limit 5;");

  const school = "神奈川県立相模原高等学校";
  const brassData =
    await sqlExecuter.any(`SELECT school.name, pre.name, brass.year, brass.prize, brass.last, brass.representative
  FROM schools school INNER JOIN brassBand brass ON school.id = brass.schoolid INNER JOIN prefecture pre ON pre.id = brass.prefectureid where school.name = '${school}';`);
  const brassBand =
    await sqlExecuter.any(`SELECT school.name, pre.name, ball.year, ball.nationalbest, ball.regionalbest 
     FROM schools school INNER JOIN baseball ball ON school.id = ball.schoolid INNER JOIN prefecture pre ON pre.id = ball.prefectureid where school.name = '${school}';`);

  res.status(200).json({
    data,
  });
}
