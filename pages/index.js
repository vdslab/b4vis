import { useState, useEffect } from "react";
import PrefectureBarGraph from "../components/PrefectureBarGraph";
import YearBarGraph from "../components/YearBarGraph";
import LineGraph from "../components/LineGraph";
import Header from "../components/Header";
// const { Client } = require("pg");

import { Grid, Paper, Container } from "@mui/material";

function Home(props) {
  // const data = {
  //   baseballData: props.baseballData,
  //   brassbandData: props.brassbandData,
  // };
  const [data, setData] = useState(null);
  const [selectedPrefecture, setSelectedPretecture] = useState("神奈川");
  const [selectedSchool, setSelectedSchool] = useState("");

  const changePrefecture = (prefecture) => {
    setSelectedPretecture(prefecture);
  };

  const changeSchool = (school) => {
    setSelectedSchool(school);
  };

  // TODO DBからデータ取ってきてgetStaticProps使う
  useEffect(() => {
    (async () => {
      const brassbandData = await fetch("../api/brassBand/getAllSchool").then(
        (res) => res.json()
      );
      const baseballData = await fetch("../api/baseball/getAllSchool").then(
        (res) => res.json()
      );
      setData({
        brassbandData: brassbandData.data,
        baseballData: baseballData.data,
      });
    })();
  }, []);

  return (
    <div>
      <Header />
      <Container sx={{ mt: 1, mb: 1 }} maxWidth="xl">
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid item xs={12} md={7}>
            <Paper elevation={5}>
              <PrefectureBarGraph
                data={data}
                changePrefecture={changePrefecture}
                selectedPrefecture={selectedPrefecture}
                changeSchool={changeSchool}
                selectedSchool={selectedSchool}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Grid container rowSpacing={2} columnSpacing={2}>
              <Grid item xs={12}>
                <Paper elevation={5}>
                  <YearBarGraph
                    data={data}
                    changePrefecture={changePrefecture}
                    selectedPrefecture={selectedPrefecture}
                    changeSchool={changeSchool}
                    selectedSchool={selectedSchool}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={5}>
                  <LineGraph
                    changeSchool={changeSchool}
                    selectedSchool={selectedSchool}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

// export async function getStaticProps() {
//   const client = new Client({
//     host: process.env.PGHOST,
//     port: 5432,
//     database: process.env.PGDATABASE,
//     user: process.env.PGUSER,
//     password: process.env.PGPASSWORD,
//   });
//   const baseballQuery =
//     "SELECT s.name, p.name as prefecture, b.year, b.regionalbest, b.nationalbest FROM baseball b, schools s, prefecture p WHERE b.schoolid = s.id AND b.prefectureid = p.id";
//   const brassbandQuery =
//     "SELECT s.name, p.name as prefecture, b.year, b.prize, b.last FROM brassband b, schools s, prefecture p WHERE b.schoolid = s.id AND b.prefectureid = p.id";
//   await client.connect();
//   const baseballResult = await client.query(baseballQuery);
//   const brassbandResult = await client.query(brassbandQuery);
//   await client.end();
//   return {
//     props: {
//       baseballData: baseballResult.rows,
//       brassbandData: brassbandResult.rows,
//     },
//   };
// }

export default Home;
