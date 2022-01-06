import { useState } from "react";
import JapanMap from "../components/JapanMap";
import BarGraph from "../components/BarGraph";

function Home() {
  const [selectedPrefecture, setSelectedPretecture] = useState("神奈川");

  const changePrefecture = (prefecture) => {
    setSelectedPretecture(prefecture);
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
      />
    </div>
  );
}

export default Home;
