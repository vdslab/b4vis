import { useEffect, useState } from "react";
import { prefectureName } from "../data/prefecture";
import {
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  Box,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import styles from "./css/Common.module.css";
import { useSelector, useDispatch } from "react-redux";
import { appSlice, updateNowLoading } from "../store/features";

const YearBarGraph = (props) => {
  const dispatch = useDispatch();

  const [hoverSchool, setHoverSchool] = useState(null);
  const [showData, setShowData] = useState(null);

  const selectedPrefecture = useSelector(
    (state) => state.app.selectedPrefecture
  );
  const preSelectedSchool = useSelector((state) => state.app.selectedSchool);
  const allSchoolData = useSelector((state) => state.app.allSchoolData);

  const changePrefecture = (prefecture) => {
    dispatch(appSlice.actions.updateSelectedPrefecture(prefecture));
  };

  const changeSchool = (school) => {
    dispatch(appSlice.actions.updateSelectedSchool(school));
  };

  const changeNowLoading = (isLoading) => {
    dispatch(updateNowLoading(isLoading));
  };

  const DOUBLE = 0;
  const BASEBALL = 1;
  const BRASSBAND = 2;

  const color = ["#ba70ff", "#70ffff", "#ff70ff"];

  const margin = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  };
  const contentWidth = 500;
  const contentHeight = 340;

  const svgWidth = margin.left + margin.right + contentWidth;
  const svgHeight = margin.top + margin.bottom + contentHeight;

  const len = svgWidth / 16;

  useEffect(() => {
    if (allSchoolData) {
      const { baseballData, brassbandData } = allSchoolData;
      if (baseballData && brassbandData) {
        const selectedData = {
          2013: [],
          2014: [],
          2015: [],
          2016: [],
          2017: [],
        };

        //吹奏楽
        for (const item of brassbandData) {
          // 地区大会は除外
          if (item["last"] !== "地区") {
            if (item["prefecture"].slice(0, -1) === selectedPrefecture) {
              // 北海道以外
              if (selectedPrefecture !== "東京") {
                // 東京以外
                // 都道府県でも銀賞以下は除外
                if (item["last"] === "都道府県" && item["prize"] !== "金賞")
                  continue;
              } else {
                // 東京
                // 都道府県大会(他でいう地区大会)は除外
                if (item["last"] === "都道府県") continue;
                // 支部でも銀賞以下は除外
                if (item["last"] === "支部" && item["prize"] !== "金賞")
                  continue;
              }
            } else if (
              item["prefecture"].slice(-2) === "地区" &&
              selectedPrefecture === "北海道"
            ) {
              // 北海道
              // 都道府県大会(他でいう地区大会)は除外
              if (item["last"] === "都道府県") continue;
              // 支部でも銀賞以下は除外
              if (item["last"] === "支部" && item["prize"] !== "金賞") continue;
            } else {
              continue;
            }

            const copyItem = {
              last: item["last"],
              name: item["name"],
              prefecture: item["prefecture"],
              prize: item["prize"],
              year: item["year"],
              club: BRASSBAND,
            };

            selectedData[item["year"]].push(copyItem);
          }
        }

        //野球
        for (const item of baseballData) {
          if (
            item["prefecture"].slice(0, -1) === selectedPrefecture ||
            (selectedPrefecture === item["prefecture"].slice(1) &&
              item["regionalbest"] <= 4)
          ) {
            let find = false;
            for (const showItem of selectedData[item["year"]]) {
              //吹奏楽のデータがすでにある場合
              if (showItem["name"] === item["name"]) {
                showItem["club"] = DOUBLE;
                find = true;
                break;
              }
            }
            if (!find) {
              const data = {
                name: item["name"],
                club: BASEBALL,
              };
              selectedData[item["year"]].push(data);
            }
          }
        }

        //並び替え(野球/両方/吹奏楽)
        for (const year of Object.keys(selectedData)) {
          selectedData[year].sort((a, b) => a.club - b.club);
        }

        setShowData(selectedData);
      }
    }
  }, [selectedPrefecture, allSchoolData]);

  if (!showData) {
    return (
      <Box
        className={styles.centering}
        px={{ padding: "0.5rem", height: "245px" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box px={{ padding: "0.5rem", maxWidth: "375px", height: "100%" }}>
      <div className={styles.centering_space_evenly}>
        <div style={{ display: "flex" }}>
          <FormControl variant="outlined" sx={{ m: 1, minWidth: 90 }}>
            <InputLabel id="prefecture-select-label" sx={{ fontSize: 12 }}>
              Prefecture
            </InputLabel>
            <Select
              labelId="prefecture-select-label"
              id="prefecture-select"
              value={selectedPrefecture}
              label="Prefecture"
              onChange={(e) => changePrefecture(e.target.value)}
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
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                fontSize: "1rem",
                fontWeight: "bolder",
                padding: "0 0 0 0.5rem",
              }}
            >
              の2013〜2017年の結果
            </div>
          </div>
        </div>

        <svg
          viewBox={`${-margin.left} ${-margin.top} ${svgWidth} ${svgHeight}`}
        >
          {Object.keys(showData)
            .reverse()
            .map((year, row) => {
              return (
                <g key={year}>
                  <text
                    x={0}
                    y={len * row * 2 + len + row * 5}
                    textAnchor="start"
                    dominantBaseline="central"
                    fontSize="15"
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
                        key={col}
                        disableInteractive
                      >
                        <g>
                          <rect
                            x={50 + len * Math.floor(col / 2)}
                            y={len * row * 2 + (col % 2) * len + row * 5}
                            width={len}
                            height={len}
                            stroke="lightgray"
                            fill={
                              item.name === hoverSchool
                                ? "#ff4f4f"
                                : color[item.club]
                            }
                            onClick={() => {
                              if (preSelectedSchool !== item.name) {
                                changeNowLoading(true);
                                changeSchool(item.name);
                              }
                            }}
                            onMouseOver={() => {
                              setHoverSchool(item.name);
                            }}
                            onMouseOut={() => setHoverSchool(null)}
                          />

                          {/* 枠縁ver */}
                          {item.name === preSelectedSchool && (
                            <rect
                              x={50 + len * Math.floor(col / 2) + 1}
                              y={len * row * 2 + (col % 2) * len + row * 5 + 1}
                              width={len - 2}
                              height={len - 2}
                              strokeWidth={2}
                              stroke="#444444"
                              fill={
                                item.name === hoverSchool
                                  ? "#ff4545"
                                  : color[item.club]
                              }
                              onClick={() => {
                                if (preSelectedSchool !== item.name) {
                                  changeNowLoading(true);
                                  changeSchool(item.name);
                                }
                              }}
                            />
                          )}

                          {/* 色塗りver */}
                          {item.name === preSelectedSchool && (
                            <rect
                              x={50 + len * Math.floor(col / 2)}
                              y={len * row * 2 + (col % 2) * len + row * 5}
                              width={len}
                              height={len}
                              fill={"orange"}
                              fillOpacity={0.75}
                              onClick={() => {
                                if (preSelectedSchool !== item.name) {
                                  changeNowLoading(true);
                                  changeSchool(item.name);
                                }
                              }}
                            />
                          )}
                        </g>
                      </Tooltip>
                    );
                  })}
                </g>
              );
            })}
        </svg>
      </div>
    </Box>
  );
};

export default YearBarGraph;
