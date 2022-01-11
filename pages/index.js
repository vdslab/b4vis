import { useState } from "react";
import JapanMap from "../components/JapanMap";
import BarGraph from "../components/BarGraph";
import LineGraph from "../components/LineGraph";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

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
    <Container>
      <Grid container rowSpacing={3} columnSpacing={3}>
        <Grid item xs={3}>
          <Paper elevation={5}>
            <JapanMap
              changePrefecture={changePrefecture}
              selectedPrefecture={selectedPrefecture}
            />
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Paper elevation={5}>
            <BarGraph
              changePrefecture={changePrefecture}
              selectedPrefecture={selectedPrefecture}
              changeSchool={changeSchool}
              selectedSchool={selectedSchool}
            />
          </Paper>
        </Grid>
        <Grid item xs>
          <Paper elevation={5}>
            <LineGraph
              changeSchool={changeSchool}
              selectedSchool={selectedSchool}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
