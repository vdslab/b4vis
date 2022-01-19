import { useState } from "react";
import PrefectureBarGraph from "../components/PrefectureBarGraph";
import YearBarGraph from "../components/YearBarGraph";
import LineGraph from "../components/LineGraph";
import Header from "../components/Header";

import { Grid, Paper, Container } from "@mui/material";

function Home() {
  const [selectedPrefecture, setSelectedPretecture] = useState("神奈川");
  const [selectedSchool, setSelectedSchool] = useState("");

  const changePrefecture = (prefecture) => {
    setSelectedPretecture(prefecture);
  };

  const changeSchool = (school) => {
    setSelectedSchool(school);
  };

  return (
    <div>
      <Header />
      <Container sx={{ mt: 1, mb: 1 }}>
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid item xs={8}>
            <Paper elevation={5}>
              <PrefectureBarGraph
                changePrefecture={changePrefecture}
                selectedPrefecture={selectedPrefecture}
                changeSchool={changeSchool}
                selectedSchool={selectedSchool}
              />
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Grid item xs>
              <Paper elevation={5}>
                <YearBarGraph
                  changePrefecture={changePrefecture}
                  selectedPrefecture={selectedPrefecture}
                  changeSchool={changeSchool}
                  selectedSchool={selectedSchool}
                />
              </Paper>
            </Grid>
            {/* TODO: LineGraphのデータがないときにmarginがでないのをどうにかする */}
            <Grid item xs>
              <Paper elevation={5}>
                <LineGraph
                  changeSchool={changeSchool}
                  selectedSchool={selectedSchool}
                />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default Home;
