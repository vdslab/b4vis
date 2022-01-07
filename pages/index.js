import { useState } from "react";
import JapanMap from "../components/JapanMap";
import BarGraph from "../components/BarGraph";
import LineGraph from "../components/LineGraph";

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
      <JapanMap
        changePrefecture={changePrefecture}
        selectedPrefecture={selectedPrefecture}
      />
      <BarGraph
        changePrefecture={changePrefecture}
        selectedPrefecture={selectedPrefecture}
        changeSchool={changeSchool}
        selectedSchool={selectedSchool}
      />
      <LineGraph changeSchool={changeSchool} selectedSchool={selectedSchool} />
    </div>
  );
}

export default Home;
