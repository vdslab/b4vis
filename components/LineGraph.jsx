import { useState, useEffect } from "react";
import { Box } from "@mui/system";
import styles from "./Common.module.css";

const YEAR = 5;
const YEAR_LIST = [2013, 2014, 2015, 2016, 2017];

const brassBandRank = { 地区: 0, 都道府県: 1, 支部: 2, 全国: 3 };
const baseBallRank = { 地区ベスト8位下: 0, 地区ベスト8: 1, " ": 2, 甲子園: 3 };
const prizeColor = {
  金賞: "#e6b422",
  銀賞: "#B2BABA",
  銅賞: "#b59064",
  不明: "#f2d5f2",
};

const LineGraph = (props) => {
  const [brassBandData, setBrasbandData] = useState(null);
  const [baseballData, setBaseballData] = useState(null);
  const [sameRankYear, setSameYear] = useState(null);
  const margin = {
    top: 40,
    bottom: 10,
    left: 40,
    right: 45,
  };

  const contentWidth = 350;
  const contentHeight = 200;
  const svgWidth = contentWidth + margin.left + margin.right;
  const svgHeight = contentHeight + margin.top + margin.bottom;

  useEffect(() => {
    (async () => {
      const brassBandRequest = await fetch(`../api/brassBand/school`, {
        method: "POST",
        body: JSON.stringify(props.selectedSchool),
      });
      const brassBandData = await brassBandRequest.json();

      const baseballRequest = await fetch(`../api/baseball/school`, {
        method: "POST",
        body: JSON.stringify(props.selectedSchool),
      });
      const baseballData = await baseballRequest.json();

      const selectedBrassBandData = [];
      const selectedBaseballData = [];

      const brassBandYear = {};
      const sameYear = [];

      // 吹奏楽
      // データがひとつもないときは何も表示しない
      if (brassBandData.data.length !== 0) {
        for (let year of YEAR_LIST) {
          let find = false;
          for (let item of brassBandData.data) {
            if (item.year === year && item.name === props.selectedSchool) {
              item.rank = brassBandRank[item.last];
              selectedBrassBandData.push(item);
              brassBandYear[item.year] = { rank: item.rank };
              find = true;
              break;
            }
          }
          if (!find) {
            brassBandYear[year] = { rank: 0 };
            selectedBrassBandData.push({ year: year, rank: 0, name: "" });
          }
        }
      }

      // 野球
      // データがひとつもないときは何も表示しない
      if (baseballData.data.length !== 0) {
        for (let year of YEAR_LIST) {
          let find = false;
          for (let item of baseballData.data) {
            if (item.year === year) {
              if (item.name === props.selectedSchool) {
                if (item.nationalbest !== null) {
                  item.rank = 3;
                } else if (item.regionalbest <= 8) {
                  item.rank = 1;
                } else {
                  item.rank = 0;
                }
                selectedBaseballData.push(item);
                find = true;

                if (getHasSameYear(item.year, item.rank)) {
                  sameYear.push(year);
                }
                break;
              }
            }
          }
          if (!find) {
            selectedBaseballData.push({
              year: year,
              rank: 0,
              name: "",
              regionalbest: "-",
            });
            if (getHasSameYear(year, 0)) {
              sameYear.push(year);
            }
          }
        }
      }

      /**
       * 吹奏楽と野球でランクが同じ年があるかどうかを返す
       **/
      function getHasSameYear(itemYear, itemRank) {
        const hasSameYear = Object.keys(brassBandYear).some((year) => {
          if (
            Number(year) === itemYear &&
            brassBandYear[year]["rank"] === itemRank
          ) {
            return true;
          }
          return false;
        });
        return hasSameYear;
      }

      setBrasbandData(selectedBrassBandData);
      setBaseballData(selectedBaseballData);
      setSameYear(sameYear);
      props.changeNowLoading(false);
    })();
  }, [props]);

  // console.log(baseballData);
  // console.log(brassBandData);
  //console.log("year", sameRankYear);

  // if (props.nowLoading) {
  //   return (
  //     <Box px={{ padding: "0.5rem", height: "100%" }}>
  //       <div style={{ fontSize: "0.75rem", heigth:"100%" }}>
  //         <div>now loading...</div>
  //       </div>
  //     </Box>
  //   );
  // }

  if (
    (baseballData === null && brassBandData === null) ||
    (baseballData?.length === 0 && brassBandData?.length === 0)
  ) {
    return (
      <Box px={{ padding: "0.5rem", minHeight: "250px" }}>
        <div style={{ fontSize: "0.75rem" }}></div>
        <div
          style={{
            fontSize: "1rem",
            fontWeight: "bolder",
            padding: "0 0 0 0.5rem",
          }}
        >
          学校詳細
        </div>
        <svg
          viewBox={`${-margin.left} ${-margin.top} ${svgWidth} ${svgHeight}`}
        >
          <text
            x={0}
            y={25}
            stroke="none"
            textAnchor="start"
            dominantBaseline="central"
            fontSize={12.5}
            fill="black"
          >
            データがありません
          </text>
          <text
            x={0}
            y={45}
            stroke="none"
            textAnchor="start"
            dominantBaseline="central"
            fontSize={12.5}
            fill="black"
          >
            グラフのセルをクリックして学校を選択してください
          </text>
        </svg>
      </Box>
    );
  }

  const wLen = 82.5; //contentWidth / YEAR;
  const hLen = 40;
  const chartHeight = hLen * 4;
  const p = 0;
  const chartWidth = p * 2 + wLen * (YEAR - 1);
  const r = 5;

  return (
    <Box px={{ padding: "0.5rem", height: "100%" }}>
      <div
        className={styles.centering_brock}
        style={{ justifyContent: "space-around" }}
      >
        <div
          style={{
            fontSize: "1rem",
            fontWeight: "bolder",
            padding: "0 0 0 0.5rem",
          }}
        >
          {props.selectedSchool}
        </div>
        <div style={{ heigth: "100%" }}>
          {props.nowLoading ? (
            <svg
              viewBox={`${-margin.left} ${-margin.top} ${svgWidth} ${svgHeight}`}
            >
              <text
                x={150}
                y={25}
                stroke="none"
                textAnchor="start"
                dominantBaseline="central"
                fontSize={12.5}
                fill="black"
              >
                loading...
              </text>
            </svg>
          ) : (
            <svg
              viewBox={`${-margin.left} ${-margin.top} ${svgWidth} ${svgHeight}`}
            >
              <g>
                <g>
                  {/**吹奏楽レジェンド */}
                  <text
                    x={-10}
                    y={-22.5}
                    stroke="none"
                    textAnchor="start"
                    dominantBaseline="central"
                    fontSize={9}
                    fill="black"
                  >
                    吹奏楽受賞結果
                  </text>
                  {Object.keys(prizeColor).map((color, idx) => {
                    return (
                      <g key={color}>
                        <circle
                          cx={p + 15 + 30 * idx}
                          cy={-10}
                          r={r}
                          stroke={"black"}
                          strokeWidth={0.5}
                          fill={prizeColor[color]}
                        />
                        <text
                          x={p + 30 * idx}
                          y={-10}
                          stroke="none"
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={7}
                          fill="black"
                        >
                          {color}:
                        </text>
                      </g>
                    );
                  })}
                </g>
              </g>

              <g>
                <text
                  x={chartWidth - 75 + 20}
                  y={-22.5}
                  stroke="none"
                  textAnchor="start"
                  dominantBaseline="central"
                  fontSize={9}
                  fill="black"
                >
                  甲子園ランキング
                </text>

                <g>
                  <text
                    x={chartWidth - 75 + 20}
                    y={-10}
                    stroke="none"
                    textAnchor="start"
                    dominantBaseline="central"
                    fontSize={7}
                    fill="black"
                  >
                    ランキング順位:
                  </text>
                  <circle
                    cx={chartWidth - 17.5 + 20}
                    cy={-10}
                    r={r}
                    stroke={"black"}
                    strokeWidth={0.5}
                    fill={"white"}
                  />
                  <text
                    x={chartWidth - 17.5 + 20}
                    y={-10}
                    stroke="none"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={7}
                    fill="black"
                  >
                    4
                  </text>
                </g>

                <g>
                  <text
                    x={chartWidth - 10 + 20}
                    y={-10}
                    stroke="none"
                    textAnchor="start"
                    dominantBaseline="central"
                    fontSize={7}
                    fill="black"
                  >
                    順位不明:
                  </text>
                  <circle
                    cx={chartWidth + 27 + 20}
                    cy={-10}
                    r={r}
                    stroke={"black"}
                    strokeWidth={0.5}
                    fill={"white"}
                  />
                  <text
                    x={chartWidth + 27 + 20}
                    y={-10}
                    stroke="none"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={7}
                    fill="black"
                  >
                    ー
                  </text>
                </g>
              </g>

              <g>
                <g>
                  {/* 縦軸：吹奏楽 */}
                  <line
                    x1={0}
                    x2={0}
                    y1={0}
                    y2={chartHeight}
                    strokeWidth={0.5}
                    stroke={"black"}
                  />
                  {Object.keys(brassBandRank).map((rank, idx) => {
                    return (
                      <g key={rank}>
                        <line
                          x1={-5}
                          x2={0}
                          y1={chartHeight - idx * hLen}
                          y2={chartHeight - idx * hLen}
                          strokeWidth={0.5}
                          stroke={"black"}
                        ></line>
                        <text
                          x={-22.5}
                          y={chartHeight - idx * hLen}
                          stroke="none"
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={7}
                          fill="black"
                        >
                          {rank}
                        </text>
                      </g>
                    );
                  })}
                </g>

                <g>
                  {/* 縦軸：野球 */}
                  <line
                    x1={chartWidth}
                    x2={chartWidth}
                    y1={0}
                    y2={chartHeight}
                    strokeWidth={0.5}
                    stroke={"black"}
                  />
                  {Object.keys(baseBallRank).map((rank, idx) => {
                    return (
                      <g key={rank}>
                        <line
                          x1={chartWidth + 5}
                          x2={chartWidth}
                          y1={chartHeight - idx * hLen}
                          y2={chartHeight - idx * hLen}
                          strokeWidth={0.5}
                          stroke={"black"}
                        ></line>
                        <text
                          x={chartWidth + 35}
                          y={chartHeight - idx * hLen}
                          stroke="none"
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={7}
                          fill="black"
                        >
                          {rank}
                        </text>
                      </g>
                    );
                  })}
                </g>

                <g>
                  {/* 横軸 */}
                  <line
                    x1={0}
                    x2={chartWidth}
                    y1={chartHeight}
                    y2={chartHeight}
                    strokeWidth={0.5}
                    stroke={"black"}
                  />
                  {YEAR_LIST.map((year, idx) => {
                    return (
                      <g key={year}>
                        <line
                          x1={p + wLen * idx}
                          x2={p + wLen * idx}
                          y1={chartHeight}
                          y2={chartHeight + 5}
                          strokeWidth={0.5}
                          stroke={"black"}
                        ></line>
                        <text
                          x={p + wLen * idx}
                          y={chartHeight + 10}
                          stroke="none"
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={7}
                          fill="black"
                        >
                          {year}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </g>

              <g>
                {brassBandData.map((result, idx) => {
                  return (
                    <g key={result.name + result.year}>
                      {idx !== brassBandData.length - 1 && (
                        <line
                          x1={p + wLen * idx}
                          x2={p + wLen * (idx + 1)}
                          y1={chartHeight - result.rank * hLen}
                          y2={chartHeight - brassBandData[idx + 1].rank * hLen}
                          strokeWidth={1}
                          stroke={"#ff70ff"}
                        />
                      )}
                    </g>
                  );
                })}
              </g>

              <g>
                {baseballData?.map((result, idx) => {
                  return (
                    <g key={result.name + result.year}>
                      {idx !== baseballData.length - 1 && (
                        <line
                          x1={p + wLen * idx}
                          x2={p + wLen * (idx + 1)}
                          y1={chartHeight - result.rank * hLen}
                          y2={chartHeight - baseballData[idx + 1].rank * hLen}
                          strokeWidth={1}
                          strokeOpacity={0.5}
                          stroke={"#0EB9EC"}
                        />
                      )}
                    </g>
                  );
                })}
              </g>

              <g>
                {brassBandData.map((result, idx) => {
                  return (
                    <g key={result.name + result.year}>
                      <circle
                        cx={p + wLen * idx}
                        cy={chartHeight - result.rank * hLen}
                        r={r}
                        stroke={"black"}
                        strokeWidth={0.5}
                        fill={prizeColor[result.prize ? result.prize : "不明"]}
                      />
                    </g>
                  );
                })}
              </g>

              <g>
                {baseballData?.map((result, idx) => {
                  return (
                    <g key={result.name + result.year}>
                      <circle
                        cx={p + wLen * idx}
                        cy={chartHeight - result.rank * hLen}
                        r={r}
                        stroke={"black"}
                        strokeWidth={0.5}
                        fill={
                          sameRankYear.find((year) => year === result.year)
                            ? "none"
                            : "white"
                        }
                      />
                      <text
                        x={p + wLen * idx}
                        y={chartHeight - result.rank * hLen}
                        stroke="none"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={7}
                        fill="black"
                      >
                        {result.nationalbest
                          ? result.nationalbest
                          : result.regionalbest}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          )}
        </div>
      </div>
    </Box>
  );
};

export default LineGraph;
