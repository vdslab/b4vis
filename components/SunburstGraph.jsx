import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import styles from "./css/Common.module.css";

const MyResponsiveSunburst = dynamic(() => import("./MyResponsiveSunburst"), {
  ssr: false,
});

function SunburstGraph(props) {
  const [schoolCount, setSchoolCount] = useState(null);

  useEffect(() => {
    const dividedData = props.data[props.selectedPrefecture];
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
  }, [props]);

  return (
    <Box px={{ padding: "0.5rem", height: "100%" }}>
      <div className={styles.centering_brock}>
      <div
        style={{
          fontSize: "1rem",
          fontWeight: "bolder",
          padding: "0 0 0 0.5rem",
        }}
      >
        {props.selectedPrefecture}の私立・公立校の内訳
      </div>
      <div>
        <MyResponsiveSunburst data={schoolCount} />
        </div>
        </div>
    </Box>
  );
}

export default SunburstGraph;
