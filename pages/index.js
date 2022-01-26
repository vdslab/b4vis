import { useState, useEffect, useRef } from "react";
import PrefectureBarGraph from "../components/PrefectureBarGraph";
import YearBarGraph from "../components/YearBarGraph";
import LineGraph from "../components/LineGraph";
import Header from "../components/Header";
import SearchSchool from "../components/SearchSchool";

// const { Client } = require("pg");

import { Grid, Paper } from "@mui/material";

function Home(props) {
  const [data, setData] = useState(null);
  const [selectedPrefecture, setSelectedPretecture] = useState("神奈川");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [inputSchoolName, setInputSchoolName] = useState("");
  const [nowLoading, setNowLoading] = useState(false);
  const inputEl = useRef("");

  const changePrefecture = (prefecture) => {
    setSelectedPretecture(prefecture);
  };

  const changeSchool = (school) => {
    setSelectedSchool(school);
  };

  const changeNowLoading = (nowLoading) => {
    setNowLoading(nowLoading);
  };

  const changeSchoolName = () => {
    setInputSchoolName(inputEl.current.value);
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
      <div style={{ margin: 10 }}>
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid item xs={12} md={2}>
            <Paper elevation={5} sx={{ p: 2 }}>
              <SearchSchool
                data={data}
                inputSchoolName={inputSchoolName}
                changeSchoolName={changeSchoolName}
                changeSchool={changeSchool}
                inputEl={inputEl}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={5}>
              <PrefectureBarGraph
                data={data}
                changePrefecture={changePrefecture}
                selectedPrefecture={selectedPrefecture}
                changeSchool={changeSchool}
                selectedSchool={selectedSchool}
                changeNowLoading={changeNowLoading}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Grid
              container
              rowSpacing={2}
              columnSpacing={2}
              sx={{
                height: "calc(100% + 16px)",
              }}
            >
              <Grid item xs={12}>
                <Paper elevation={5} sx={{ height: "100%" }}>
                  <YearBarGraph
                    data={data}
                    changePrefecture={changePrefecture}
                    selectedPrefecture={selectedPrefecture}
                    changeSchool={changeSchool}
                    selectedSchool={selectedSchool}
                    changeNowLoading={changeNowLoading}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={5} sx={{ height: "100%" }}>
                  <LineGraph
                    data={data}
                    changeSchool={changeSchool}
                    selectedSchool={selectedSchool}
                    nowLoading={nowLoading}
                    changeNowLoading={changeNowLoading}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
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
