import { useEffect, useState } from "react";
import { prefectureName } from "../data/prefecture";
import {
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import styles from "./Common.module.css";
import ZenkokuSunburstGraph from "./ZenkokuSunburstGraph";


const PrefectureBarGraph = (props) => {
  const [brassbandData, setBrassbandData] = useState(null);
  const [baseballData, setBaseballData] = useState(null);
  const [showData, setShowData] = useState(null);
  const [arrangement, setArrangement] = useState("default");
  const [arrangementPrefecture, setArrangementPrefecture] = useState([]);

  const DOUBLE = 0;
  const BASEBALL = 1;
  const BRASSBAND = 2;

  const ARRANGEMENT = ["default", "昇順", "降順"];

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
  }, [props.data]);

  useEffect(() => {
    console.log("here");
    if (baseballData && brassbandData) {
      const selectedData = {
        北海道: {},
        青森: {},
        岩手: {},
        宮城: {},
        秋田: {},
        山形: {},
        福島: {},
        茨城: {},
        栃木: {},
        群馬: {},
        埼玉: {},
        千葉: {},
        東京: {},
        神奈川: {},
        新潟: {},
        富山: {},
        石川: {},
        福井: {},
        山梨: {},
        長野: {},
        岐阜: {},
        静岡: {},
        愛知: {},
        三重: {},
        滋賀: {},
        京都: {},
        大阪: {},
        兵庫: {},
        奈良: {},
        和歌山: {},
        鳥取: {},
        島根: {},
        岡山: {},
        広島: {},
        山口: {},
        徳島: {},
        香川: {},
        愛媛: {},
        高知: {},
        福岡: {},
        佐賀: {},
        長崎: {},
        熊本: {},
        大分: {},
        宮崎: {},
        鹿児島: {},
        沖縄: {},
      };

      // 吹奏楽
      for (const item of brassbandData) {
        if (item["last"] !== "地区") {
          if (
            item["prefecture"].slice(-2) !== "地区" &&
            item["prefecture"] !== "東京都"
          ) {
            if (item["last"] === "都道府県" && item["prize"] !== "金賞")
              continue;
            // 重複が無いようにsetで持っておく
            selectedData[item["prefecture"].slice(0, -1)][item["name"]] =
              BRASSBAND;
          } else if (item["prefecture"].slice(-2) === "地区") {
            //北海道
            if (item["last"] === "都道府県") continue;
            if (item["last"] === "支部" && item["prize"] !== "金賞") continue;
            selectedData["北海道"][item["name"]] = BRASSBAND;
          } else if (item["prefecture"] === "東京都") {
            if (item["last"] === "都道府県") continue;
            if (item["last"] === "支部" && item["prize"] !== "金賞") continue;
            // 重複が無いようにsetで持っておく
            selectedData[item["prefecture"].slice(0, -1)][item["name"]] =
              BRASSBAND;
          }
        }
      }

      // 甲子園
      for (const item of baseballData) {
        const prefecture =
          item["prefecture"].slice(1) === "北海道" ||
          item["prefecture"].slice(1) === "東京"
            ? item["prefecture"]
            : item["prefecture"].slice(0, -1);
        if (
          prefecture !== "北北海道" &&
          prefecture !== "南北海道" &&
          prefecture !== "東東京" &&
          prefecture !== "西東京"
        ) {
          if (selectedData[prefecture].hasOwnProperty(item["name"])) {
            if (selectedData[prefecture][item["name"]] === BRASSBAND)
              selectedData[prefecture][item["name"]] = DOUBLE;
          } else {
            selectedData[prefecture][item["name"]] = BASEBALL;
          }
        } else if (prefecture === "北北海道" || prefecture === "南北海道") {
          if (Number(item["regionalbest"]) <= 4) {
            if (selectedData["北海道"].hasOwnProperty(item["name"])) {
              if (selectedData["北海道"][item["name"]] === BRASSBAND)
                selectedData["北海道"][item["name"]] = DOUBLE;
            } else {
              selectedData["北海道"][item["name"]] = BASEBALL;
            }
          }
        } else if (prefecture === "東東京" || prefecture === "西東京") {
          if (Number(item["regionalbest"]) <= 4) {
            if (selectedData["東京"].hasOwnProperty(item["name"])) {
              if (selectedData["東京"][item["name"]] === BRASSBAND)
                selectedData["東京"][item["name"]] = DOUBLE;
            } else {
              selectedData["東京"][item["name"]] = BASEBALL;
            }
          }
        }
      }

      // 並べ替え
      if (arrangement === "default") {
        for (const [prefecture, data] of Object.entries(selectedData)) {
          const tmp = [];
          for (const [name, club] of Object.entries(data)) {
            tmp.push({
              name,
              club,
            });
          }
          // 共通/甲子園/吹奏楽の順に並び替え
          selectedData[prefecture] = tmp.sort((a, b) => a.club - b.club);
        }
        setArrangementPrefecture(prefectureName);
      } else {
        const aaa = [];
        for (const [prefecture, data] of Object.entries(selectedData)) {
          const tmp = [];
          let doubleCnt = 0;
          let schoolCnt = 0;
          for (const [name, club] of Object.entries(data)) {
            if (club === 0) ++doubleCnt;
            tmp.push({
              name,
              club,
            });
            ++schoolCnt;
          }
          aaa.push({ prefecture, doubleCnt, schoolCnt });
          // 共通/甲子園/吹奏楽の順に並び替え
          selectedData[prefecture] = tmp.sort((a, b) => a.club - b.club);
        }
        if (arrangement === "昇順")
          aaa.sort((a, b) => {
            if (a.doubleCnt > b.doubleCnt) return 1;
            if (a.doubleCnt < b.doubleCnt) return -1;
            if (a.schoolCnt < b.schoolCnt) return 1;
            if (a.schoolCnt > b.schoolCnt) return -1;
          });
        else
          aaa.sort((a, b) => {
            if (a.doubleCnt < b.doubleCnt) return 1;
            if (a.doubleCnt > b.doubleCnt) return -1;
            if (a.schoolCnt > b.schoolCnt) return 1;
            if (a.schoolCnt < b.schoolCnt) return -1;
          });
        const bbb = [];
        aaa.map((a, i) => {
          bbb.push(a.prefecture);
        });
        setArrangementPrefecture(bbb);
      }
      setShowData(selectedData);
    }
  }, [baseballData, brassbandData, arrangement]);

  // useEffect(() => {
  //   if (showData) console.log(showData);
  // }, [arrangement]);

  if (!showData) {
    return (
      <Box px={{ padding: "0.5rem", height: "245px" }}>
        <div style={{ fontSize: "0.75rem" }}>
          <div>loading...</div>
        </div>
      </Box>
    );
  }

  return (
    <Box px={{ padding: "0.5rem", height: "100%" }}>
      <div className={styles.centering_brock}>
        <div style={{ display: "flex" }}>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "bolder",
              padding: "1.5rem 0 0 0.5rem",
              width: "125%",
              display: "flex",
            }}
          >
            <div>
              <div>2013〜2017年に</div>
              <div>吹奏楽コンクール・甲子園</div>
              <div>上位大会に進んだ高校</div>
            </div>
          </div>
          <div style={{ display: "flex", width:"100%", justifyContent:"center" }}>
            <Box>
              <ZenkokuSunburstGraph data={props.allSchoolCountData} />
            </Box>
          </div>
        </div>
        <Box style={{ display: "flex", alignItems: "center" }}>
          <FormControl
            sx={{
              m: 1,
              minWidth: 90,
            }}
          >
            <InputLabel id="prefecture-select-label" sx={{ fontSize: 12 }}>
              Arrangement
            </InputLabel>
            <Select
              labelId="prefecture-select-label"
              id="prefecture-select"
              value={arrangement}
              label="Prefecture"
              onChange={(e) => setArrangement(e.target.value)}
              sx={{ fontSize: 12 }}
            >
              {ARRANGEMENT.map((p, i) => {
                return (
                  <MenuItem key={i} value={p}>
                    {p}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <svg viewBox={`${0} ${-15} ${800} ${110}`}>
            <g>
              <g>
                <rect
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  stroke="lightgray"
                  fill={color[2]}
                />
                <text
                  x={25}
                  y={10}
                  textAnchor="start"
                  dominantBaseline="central"
                  fontSize="20"
                  style={{ userSelect: "none" }}
                >
                  夏の甲子園で地区大会ベスト8以上の結果を出した高校
                </text>
                <text
                  x={530}
                  y={10}
                  textAnchor="start"
                  dominantBaseline="central"
                  fontSize="17.5"
                  style={{ userSelect: "none" }}
                >
                  ※東京・北海道はベスト4以内
                </text>
              </g>
              <g>
                <rect
                  x={0}
                  y={30}
                  width={20}
                  height={20}
                  stroke="lightgray"
                  fill={color[1]}
                />
                <text
                  x={25}
                  y={40}
                  textAnchor="start"
                  dominantBaseline="central"
                  fontSize="20"
                  style={{ userSelect: "none" }}
                >
                  吹奏楽コンクールで「都道府県大会：金賞」以上の結果を出した高校
                </text>
                <text
                  x={440}
                  y={67.5}
                  textAnchor="start"
                  dominantBaseline="central"
                  fontSize="17.5"
                  style={{ userSelect: "none" }}
                >
                  ※東京・北海道は「支部大会：金賞」以上
                </text>
              </g>
              <g>
                <g>
                  <rect
                    x={0}
                    y={0}
                    width={20}
                    height={20}
                    stroke="lightgray"
                    fill={color[1]}
                  />
                  <text
                    x={25}
                    y={10}
                    textAnchor="start"
                    dominantBaseline="central"
                    fontSize="20"
                    style={{ userSelect: "none" }}
                  >
                    夏の甲子園で地区大会ベスト8以上の結果を出した高校
                  </text>
                  <text
                    x={530}
                    y={10}
                    textAnchor="start"
                    dominantBaseline="central"
                    fontSize="17.5"
                    style={{ userSelect: "none" }}
                  >
                    ※東京・北海道はベスト4以内
                  </text>
                </g>
                <g>
                  <rect
                    x={0}
                    y={30}
                    width={20}
                    height={20}
                    stroke="lightgray"
                    fill={color[2]}
                  />
                  <text
                    x={25}
                    y={40}
                    textAnchor="start"
                    dominantBaseline="central"
                    fontSize="20"
                    style={{ userSelect: "none" }}
                  >
                    吹奏楽コンクールで「都道府県大会：金賞」以上の結果を出した高校
                  </text>
                  <text
                    x={440}
                    y={67.5}
                    textAnchor="start"
                    dominantBaseline="central"
                    fontSize="17.5"
                    style={{ userSelect: "none" }}
                  >
                    ※東京・北海道は「支部大会：金賞」以上
                  </text>
                </g>
                <g>
                  <rect
                    x={0}
                    y={60}
                    width={20}
                    height={20}
                    stroke="lightgray"
                    fill={color[0]}
                  />
                  <text
                    x={25}
                    y={70}
                    textAnchor="start"
                    dominantBaseline="central"
                    fontSize="20"
                    style={{ userSelect: "none" }}
                  >
                    上記2つを満たしている高校
                  </text>
                </g>
              </g>
            </g>
          </svg>
        </Box>
        <svg
          viewBox={`${-margin.left} ${-margin.top} ${svgWidth} ${svgHeight}`}
        >
          {arrangementPrefecture.map((prefecture, row) => {
            return (
              <g key={row} onClick={() => props.changePrefecture(prefecture)}>
                <text
                  x={0}
                  y={13 * row * 2 + 1}
                  textAnchor="start"
                  dominantBaseline="central"
                  fontSize="13"
                  style={{ userSelect: "none" }}
                >
                  {prefecture}
                </text>
                {showData[prefecture].map((item, col) => {
                  return (
                    <Tooltip
                      title={item.name}
                      arrow
                      placement="bottom"
                      disableInteractive
                      key={col}
                    >
                      <g>
                        <rect
                          x={50 + 26 * col}
                          y={26 * row - 13}
                          width={26}
                          height={26}
                          stroke="lightgray"
                          fill={color[item.club]}
                          onClick={() => {
                            if (props.selectedSchool !== item.name) {
                              props.changeNowLoading(true);
                              props.changeSchool(item.name);
                            }
                          }}
                        />

                        {/* 枠縁ver */}
                        {item.name === props.selectedSchool && (
                          <rect
                            x={50 + 26 * col + 1}
                            y={26 * row - 13 + 1}
                            width={26 - 2}
                            height={26 - 2}
                            strokeWidth={2}
                            stroke="#333333"
                            fill={color[item.club]}
                            onClick={() => {
                              if (props.selectedSchool !== item.name) {
                                props.changeNowLoading(true);
                                props.changeSchool(item.name);
                              }
                            }}
                          />
                        )}

                        {/*色塗りver*/}
                        {item.name === props.selectedSchool && (
                          <rect
                            x={50 + 26 * col}
                            y={26 * row - 13}
                            width={26}
                            height={26}
                            fill={"orange"}
                            fillOpacity={0.5}
                            onClick={() => {
                              if (props.selectedSchool !== item.name) {
                                props.changeNowLoading(true);
                                props.changeSchool(item.name);
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

export default PrefectureBarGraph;
