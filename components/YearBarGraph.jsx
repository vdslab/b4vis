import { useEffect, useState } from "react";
import { prefectureName } from "../data/prefecture";
import { Tooltip, FormControl, Select, MenuItem } from "@mui/material";

const YearBarGraph = (props) => {
  const [brassbandData, setBrassbandData] = useState(null);
  const [baseballData, setBaseballData] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [showData, setShowData] = useState(null);
  const [colLen, setColLen] = useState(null);
  const [len, setLen] = useState(null);

  const DOUBLE = 0;
  const BASEBALL = 1;
  const BRASSBAND = 2;

  const color = ["#ba70ff", "#70ffff", "#ff70ff"];

  const margin = {
    top: 20,
    bottom: 20,
    left: 10,
    right: 10,
  };
  const contentWidth = 1400;
  const contentHeight = 1200;

  const svgWidth = margin.left + margin.right + contentWidth;
  const svgHeight = margin.top + margin.bottom + contentHeight;

  useEffect(() => {
    setBrassbandData(props.data?.brassbandData);
    setBaseballData(props.data?.baseballData);
  }, [props]);

  useEffect(() => {
    if (baseballData && brassbandData) {
      const selectedData = { 2013: [], 2014: [], 2015: [], 2016: [], 2017: [] };

      //吹奏楽
      for (const item of brassbandData) {
        // 地区大会は除外
        if (item["last"] !== "地区") {
          if (item["prefecture"].slice(0, -1) === props.selectedPrefecture) {
            // 北海道以外
            if (props.selectedPrefecture !== "東京") {
              // 東京以外
              // 都道府県でも銀賞以下は除外
              if (item["last"] === "都道府県" && item["prize"] !== "金賞")
                continue;
            } else {
              // 東京
              // 都道府県大会(他でいう地区大会)は除外
              if (item["last"] === "都道府県") continue;
              // 支部でも銀賞以下は除外
              if (item["last"] === "支部" && item["prize"] !== "金賞") continue;
            }
          } else if (
            item["prefecture"].slice(-2) === "地区" &&
            props.selectedPrefecture === "北海道"
          ) {
            // 北海道
            // 都道府県大会(他でいう地区大会)は除外
            if (item["last"] === "都道府県") continue;
            // 支部でも銀賞以下は除外
            if (item["last"] === "支部" && item["prize"] !== "金賞") continue;
          } else {
            continue;
          }
          item["club"] = BRASSBAND;
          selectedData[item["year"]].push(item);
        }
      }

      //野球
      for (const item of baseballData) {
        if (
          item["prefecture"] === props.selectedPrefecture ||
          (props.selectedPrefecture === item["prefecture"].slice(1) &&
            item["regionalBest"] <= 4)
        ) {
          let find = false;
          for (let showItem of selectedData[item["year"]]) {
            //吹奏楽のデータがすでにある場合
            if (showItem["name"] === item["fullName"]) {
              showItem["club"] = DOUBLE;
              find = true;
              break;
            }
          }
          if (!find) {
            const data = {
              name:
                item["fullName"] !== "" ? item["fullName"] : item["shortName"],
              nationalBest: item["nationalBest"],
              regionalBest: item["regionalBest"],
              club: BASEBALL,
            };
            selectedData[item["year"]].push(data);
          }
        }
      }

      //並び替え(野球/両方/吹奏楽)
      for (let year of Object.keys(selectedData)) {
        selectedData[year].sort((a, b) => a.club - b.club);
      }

      //セルの数決める
      const colMax = Math.max(
        ...Object.keys(selectedData).map((key) => selectedData[key].length)
      );
      setColLen(colMax);

      //セルの１辺の長さ
      const l = Math.min(contentHeight / 8, Math.floor(svgWidth / colMax));
      setLen(l);

      setShowData(selectedData);
    }
  }, [props.selectedPrefecture, baseballData, brassbandData]);

  if (!showData) {
    return <div>loading...</div>;
  }

  return (
    <>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 90 }}>
        <Select
          labelId="prefecture-select-label"
          id="prefecture-select"
          value={props.selectedPrefecture}
          label="Prefecture"
          onChange={(e) => props.changePrefecture(e.target.value)}
          sx={{ fontSize: 12 }}
        >
          {prefectureName.map((p, i) => {
            const name = p;
            return (
              <MenuItem key={i} value={name}>
                {name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <svg viewBox={`${-margin.left} ${-margin.top} ${svgWidth} ${svgHeight}`}>
        {Object.keys(showData)
          .reverse()
          .map((year, row) => {
            return (
              <g key={year}>
                <text
                  x={0}
                  y={len * row + len / 2}
                  textAnchor="start"
                  dominantBaseline="central"
                  fontSize="13"
                  style={{ userSelect: "none" }}
                >
                  {year}
                </text>
                {showData[year].map((item, col) => {
                  return (
                    <Tooltip
                      title={item.name}
                      arrow
                      placement="bottom"
                      key={colLen * row + col}
                      disableInteractive
                    >
                      <rect
                        x={50 + len * col}
                        y={len * row}
                        width={len}
                        height={len}
                        stroke="lightgray"
                        fill={
                          item.name === selectedSchool
                            ? "red"
                            : color[item.club]
                        }
                        onClick={() => {
                          props.changeSchool(item.name);
                        }}
                        onMouseOver={() => setSelectedSchool(item.name)}
                        onMouseOut={() => setSelectedSchool(null)}
                      />
                    </Tooltip>
                  );
                })}
              </g>
            );
          })}
      </svg>
    </>
  );
};

export default YearBarGraph;
