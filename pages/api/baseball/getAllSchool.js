const { selectRows } = require("../../../modules/db");

export default async function (req, res) {
  const query =
    "SELECT s.name, p.name as prefecture, b.year, b.regionalbest, b.nationalbest FROM baseball b, schools s, prefecture p WHERE b.schoolid = s.id AND b.prefectureid = p.id";
  const data = await selectRows(query);

  res.status(200).json({
    data,
  });
}
