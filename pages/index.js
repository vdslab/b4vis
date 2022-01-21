import { useState, useEffect } from "react";
import PrefectureBarGraph from "../components/PrefectureBarGraph";
import YearBarGraph from "../components/YearBarGraph";
import LineGraph from "../components/LineGraph";
import Header from "../components/Header";

import { Grid, Paper, Container } from "@mui/material";

function Home() {
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
      const brassbandData = await fetch("data/barassBand.json").then((res) =>
        res.json()
      );
      const baseballData = await fetch("data/baseball.json").then((res) =>
        res.json()
      );
      setData({ brassbandData, baseballData });
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

export default Home;
