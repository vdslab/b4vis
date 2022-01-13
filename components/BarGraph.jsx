import { useEffect, useState } from "react";
import { prefectureName } from "../data/prefecture";
import Tooltip from "@mui/material/Tooltip";

const BarGraph = (props) => {
  const [showData, setShowData] = useState(null);
  const [representative, setRepresentative] = useState("false"); // 代表かどうか
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
  const contentHeight = 1150;

  const svgWidth = margin.left + margin.right + contentWidth;
  const svgHeight = margin.top + margin.bottom + contentHeight;

  useEffect(() => {
    (async () => {
      const brassbandRequest = await fetch("data/barassBand.json");
      const brassbandData = await brassbandRequest.json();

      const baseballRequest = await fetch("data/baseball.json");
      const baseballData = await baseballRequest.json();

      const selectedData = {
        青森: {},
        岩手: {},
        宮城: {},
        秋田: {},
        山形: {},
        福島: {},
        栃木: {},
        茨城: {},
        千葉: {},
        神奈川: {},
        新潟: {},
        群馬: {},
        山梨: {},
        埼玉: {},
        愛知: {},
        三重: {},
        岐阜: {},
        長野: {},
        静岡: {},
        福井: {},
        石川: {},
        富山: {},
        大阪: {},
        京都: {},
        兵庫: {},
        滋賀: {},
        奈良: {},
        和歌山: {},
        広島: {},
        岡山: {},
        山口: {},
        鳥取: {},
        島根: {},
        香川: {},
        高知: {},
        愛媛: {},
        徳島: {},
        福岡: {},
        佐賀: {},
        長崎: {},
        熊本: {},
        鹿児島: {},
        宮崎: {},
        大分: {},
        沖縄: {},
      };

      // 吹奏楽
      for (const item of brassbandData) {
        if (
          item["prefecture"].slice(-2) !== "地区" &&
          item["prefecture"] !== "東京都" &&
          item["last"] !== "地区"
        ) {
          if (representative === "false") {
            if (item["last"] === "都道府県" && item["prize"] !== "金賞")
              continue;
          } else {
            if (item["last"] === "都道府県" && item["representative"] === false)
              continue;
          }
          // 重複が無いようにsetで持っておく
          selectedData[item["prefecture"].slice(0, -1)][item["name"]] =
            BRASSBAND;
        } else {
          // TODO 北海道と東京
        }
      }

      // 甲子園
      for (const item of baseballData) {
        if (
          item["prefecture"] !== "北北海道" &&
          item["prefecture"] !== "南北海道" &&
          item["prefecture"] !== "東東京" &&
          item["prefecture"] !== "西東京"
        ) {
          if (
            selectedData[item["prefecture"]].hasOwnProperty(item["fullName"])
          ) {
            if (
              selectedData[item["prefecture"]][item["fullName"]] === BRASSBAND
            )
              selectedData[item["prefecture"]][item["fullName"]] = DOUBLE;
          } else {
            selectedData[item["prefecture"]][item["fullName"]] = BASEBALL;
          }
        }
      }

      // 並べ替え
      for (const prefecture of Object.keys(selectedData)) {
        const tmp = [];
        for (const name of Object.keys(selectedData[prefecture])) {
          tmp.push({
            name,
            club: selectedData[prefecture][name],
          });
        }
        selectedData[prefecture] = tmp;
        selectedData[prefecture].sort((a, b) => a.club - b.club);
      }
      setShowData(selectedData);
    })();
  }, [representative]);

  useEffect(() => {
    console.log(showData);
  }, [showData]);

  // useEffect(() => {
  //   (async () => {
  //     const brassbandRequest = await fetch("data/barassBand.json");
  //     const brassbandData = await brassbandRequest.json();

  //     const baseballRequest = await fetch("data/baseball.json");
  //     const baseballData = await baseballRequest.json();

  //     const selectedData = { 2013: [], 2014: [], 2015: [], 2016: [], 2017: [] };

  //     //吹奏楽
  //     for (let item of brassbandData) {
  //       //都道府県大会以上進出
  //       if (
  //         item["prefecture"].substr(0, item["prefecture"].length - 1) ===
  //           props.selectedPrefecture &&
  //         item["last"] !== "地区"
  //       ) {
  //         if (representative === "false") {
  //           //都道府県で金賞以外のものは除外
  //           if (
  //             item["last"] === "都道府県" &&
  //             (item["prize"] === "銀賞" || item["prize"] === "銅賞")
  //           ) {
  //             continue;
  //           }
  //         } else {
  //           //代表以外のものは除外
  //           if (
  //             item["last"] === "都道府県" &&
  //             item["representative"] === false
  //           ) {
  //             continue;
  //           }
  //         }
  //         item["club"] = BRASSBAND;
  //         selectedData[item["year"]].push(item);
  //       }
  //     }

  //     //野球
  //     for (let item of baseballData) {
  //       if (item["prefecture"] === props.selectedPrefecture) {
  //         let find = false;
  //         for (let showItem of selectedData[item["year"]]) {
  //           //吹奏楽のデータがすでにある場合
  //           if (showItem["name"] === item["fullName"]) {
  //             showItem["club"] = DOUBLE;
  //             showItem["nationalBest"] = item["nationalBest"];
  //             showItem["regionalBest"] = item["regionalBest"];
  //             find = true;
  //             break;
  //           }
  //         }
  //         if (!find) {
  //           const data = {
  //             name:
  //               item["fullName"] !== "" ? item["fullName"] : item["shortName"],
  //             nationalBest: item["nationalBest"],
  //             regionalBest: item["regionalBest"],
  //             club: BASEBALL,
  //           };
  //           selectedData[item["year"]].push(data);
  //         }
  //       }
  //     }

  //     //並び替え(野球/両方/吹奏楽)
  //     for (let year of Object.keys(selectedData)) {
  //       selectedData[year].sort((a, b) => a.club - b.club);
  //     }

  //     //セルの数決める
  //     const colMax = Math.max(
  //       ...Object.keys(selectedData).map((key) => selectedData[key].length)
  //     );
  //     setColLen(colMax);

  //     //セルの１辺の長さ
  //     const l = Math.min(contentHeight / 6, Math.floor(svgWidth / colMax));
  //     setLen(l);

  //     setShowData(selectedData);
  //   })();
  // }, [props.selectedPrefecture, representative, svgWidth]);

  if (!showData) {
    return <div>loading...</div>;
  }

  return (
    <>
      <div>
        <label>
          <input
            type="radio"
            value={"true"}
            onChange={(e) => setRepresentative(e.target.value)}
            checked={representative === "true"}
          />
          代表
        </label>
        <label>
          <input
            type="radio"
            value={"false"}
            onChange={(e) => setRepresentative(e.target.value)}
            checked={representative === "false"}
          />
          金賞
        </label>
        <select
          value={props.selectedPrefecture}
          onChange={(e) => props.changePrefecture(e.target.value)}
        >
          {prefectureName.map((p, i) => {
            {
              return (
                <option key={i} value={p.slice(0, -1)}>
                  {p}
                </option>
              );
            }
          })}
        </select>
      </div>
      <svg viewBox={`${-margin.left} ${-margin.top} ${svgWidth} ${svgHeight}`}>
        {Object.keys(showData).map((prefecture, row) => {
          return (
            <g key={row}>
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
                  >
                    <rect
                      x={50 + 26 * col}
                      y={26 * row - 13}
                      width={26}
                      height={26}
                      stroke="lightgray"
                      fill={color[item.club]}
                      onClick={() => {
                        props.changeSchool(item.name);
                      }}
                    />
                  </Tooltip>
                );
              })}
            </g>
          );
        })}
        {/* {Object.keys(showData)
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
                        fill={color[item.club]}
                        onClick={() => {
                          props.changeSchool(item.name);
                        }}
                      />
                    </Tooltip>
                  );
                })}
              </g>
            );
          })} */}
      </svg>
    </>
  );
};

export default BarGraph;
