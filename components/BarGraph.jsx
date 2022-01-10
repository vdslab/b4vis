import { useEffect, useState } from "react";
import { prefectureName } from "../data/prefecture";
import Tooltip from "@mui/material/Tooltip";

// function Tooltip({ clientX, clientY, show, info }) {
//   return <div>{show && <div>{JSON.stringify(info)}</div>}</div>;
// }

const BarGraph = (props) => {
  const [showData, setShowData] = useState(null);
  const [popup, setPopup] = useState(false);
  const [clientX, setClientX] = useState(0);
  const [clientY, setClientY] = useState(0);
  const [info, setInfo] = useState();
  const [representative, setRepresentative] = useState("false");
  const [colLen, setColLen] = useState(null);
  const [len, setLen] = useState(null);

  const BASEBALL = 0;
  const DOUBLE = 1;
  const BRASSBAND = 2;

  const color = ["#70ffff", "#ba70ff", "#ff70ff"];

  const margin = {
    top: 20,
    bottom: 20,
    left: 10,
    right: 10,
  };
  const contentWidth = 800;
  const contentHeight = 200;

  const svgWidth = margin.left + margin.right + contentWidth;
  const svgHeight = margin.top + margin.bottom + contentHeight;

  useEffect(() => {
    (async () => {
      const brassbandRequest = await fetch("data/barassBand.json");
      const brassbandData = await brassbandRequest.json();

      const baseballRequest = await fetch("data/baseball.json");
      const baseballData = await baseballRequest.json();

      const selectedData = { 2013: [], 2014: [], 2015: [], 2016: [], 2017: [] };

      //吹奏楽
      for (let item of brassbandData) {
        //都道府県大会以上進出
        if (
          item["prefecture"].substr(0, item["prefecture"].length - 1) ===
            props.selectedPrefecture &&
          item["last"] !== "地区"
        ) {
          if (representative === "false") {
            //都道府県で金賞以外のものは除外
            if (
              item["last"] === "都道府県" &&
              (item["prize"] === "銀賞" || item["prize"] === "銅賞")
            ) {
              continue;
            }
          } else {
            //代表以外のものは除外
            if (
              item["last"] === "都道府県" &&
              item["representative"] === false
            ) {
              continue;
            }
          }
          item["club"] = BRASSBAND;
          selectedData[item["year"]].push(item);
        }
      }

      //野球
      for (let item of baseballData) {
        if (item["prefecture"] === props.selectedPrefecture) {
          let find = false;
          for (let showItem of selectedData[item["year"]]) {
            //吹奏楽のデータがすでにある場合
            if (showItem["name"] === item["fullName"]) {
              showItem["club"] = DOUBLE;
              showItem["nationalBest"] = item["nationalBest"];
              showItem["regionalBest"] = item["regionalBest"];
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
      const l = Math.min(contentHeight / 5, Math.floor(svgWidth / colMax));
      setLen(l);

      setShowData(selectedData);
    })();
  }, [props.selectedPrefecture, representative, svgWidth]);

  function onHover(e) {
    const clientX = e.pageX;
    const clientY = e.pageY;
    setPopup(true);
    setClientX(clientX);
    setClientY(clientY);
  }

  function changeInfo(item) {
    setInfo(item);
  }

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
                    >
                      <rect
                        x={50 + len * col}
                        y={len * row}
                        width={len}
                        height={len}
                        stroke="lightgray"
                        fill={color[item.club]}
                        // onMouseMove={(e) => {
                        //   onHover(e);
                        //   changeInfo(item);
                        // }}
                        // onMouseLeave={() => {
                        //   setPopup(false);
                        // }}
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
      </svg>
      {/* <Tooltip clientX={clientX} clientY={clientY} show={popup} info={info} /> */}
    </>
  );
};

export default BarGraph;
