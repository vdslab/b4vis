import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box, CircularProgress } from "@mui/material";
import styles from "./css/Common.module.css";
import { useSelector } from "react-redux";

const MyResponsiveSunburst = dynamic(() => import("./MyResponsiveSunburst"), {
  ssr: false,
});

function SunburstGraph() {
  const [schoolCount, setSchoolCount] = useState(null);
  const selectedPrefecture = useSelector(
    (state) => state.app.selectedPrefecture
  );
  const allSchoolCountData = useSelector(
    (state) => state.app.allSchoolCountData
  );

  useEffect(() => {
    if (allSchoolCountData && selectedPrefecture !== "") {
      const dividedData = allSchoolCountData[selectedPrefecture];
      if (dividedData) {
        const data = {
          name: "b4vis",
          color: "hsl(290, 70%, 50%)",
          children: [
            {
              name: "吹奏楽",
              key: "吹奏楽",
              color: "hsl(300, 100%, 72%)",
              children: [
                {
                  key: "吹奏楽公立",
                  name: "公立",
                  loc: dividedData.brassband,
                },
                {
                  key: "吹奏楽私立",
                  name: "私立",
                  loc: dividedData.brassbandPrivate,
                },
              ],
            },
            {
              name: "野球",
              key: "野球",
              color: "hsl(180, 100%, 72%)",
              children: [
                {
                  name: "公立",
                  key: "野球公立",
                  loc: dividedData.baseball,
                },
                {
                  name: "私立",
                  key: "野球私立",
                  loc: dividedData.baseballPrivate,
                },
              ],
            },
            {
              name: "両方",
              key: "両方",
              color: "hsl(271, 100%, 72%)",
              children: [
                {
                  name: "公立",
                  key: "公立",
                  color: "hsl(201, 100%, 72%)",
                  loc: dividedData.double,
                },
                {
                  name: "私立",
                  key: "私立",
                  loc: dividedData.doublePrivate,
                },
              ],
            },
          ],
        };
        setSchoolCount(data);
      }
    }
  }, [selectedPrefecture, allSchoolCountData]);

  return (
    <Box px={{ padding: "0.5rem", height: "100%" }}>
      <div className={styles.centering_space_evenly}>
        <div
          style={{
            fontSize: "1rem",
            fontWeight: "bolder",
            padding: "0 0 0 0.5rem",
          }}
        >
          {selectedPrefecture}の私立・公立校の内訳
        </div>
        <div className={styles.centering}>
          {schoolCount ? (
            <MyResponsiveSunburst data={schoolCount} />
          ) : (
            <div className={styles.centering}>
              <CircularProgress />
            </div>
          )}
        </div>
      </div>
    </Box>
  );
}

export default SunburstGraph;
