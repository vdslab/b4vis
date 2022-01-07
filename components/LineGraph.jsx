import { useState, useEffect } from "react";
const YEAR = 5;
const YEAR_LIST = [2013, 2014, 2015, 2016, 2017];

const LineGraph = (props) => {
  const [brassBandData, setBrasbandData] = useState(null);
  const [baseballData, setBaseballData] = useState(null);
  const margin = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  };

  const contentWidth = 400;
  const contentHeight = 500;
  const svgWidth = contentWidth + margin.left + margin.right;
  const svgHeight = contentHeight + margin.top + margin.bottom;

  useEffect(() => {
    (async () => {
      const brassbandRequest = await fetch("data/barassBand.json");
      const brassbandData = await brassbandRequest.json();

      const baseballRequest = await fetch("data/baseball.json");
      const baseballData = await baseballRequest.json();

      const brassBandRank = { 地区: 0, 都道府県: 1, 支部: 2, 全国: 3 };

      const selectedBrassBandData = [];
      const selectedBaseballData = [];

      //吹奏楽
      for (let item of brassbandData) {
        if (item.name === props.selectedSchool) {
          item.rank = brassBandRank[item.last];
          selectedBrassBandData.push(item);
        }
      }

      //野球
      for (let item of baseballData) {
        if (item.fullName === props.selectedSchool) {
          if (item.nationalBest !== "") {
            item.rank = 3;
          } else if (Number(item.regionalBest) <= 8) {
            item.rank = 1;
          } else {
            item.rank = 0;
          }
          selectedBaseballData.push(item);
        }
      }

      const sortedBrassBandData = selectedBrassBandData.sort(
        (a, b) => Number(a.year) - Number(b.year)
      );
      const sortedBaseballData = selectedBaseballData.sort(
        (a, b) => Number(a.year) - Number(b.year)
      );
      setBrasbandData(sortedBrassBandData);
      setBaseballData(sortedBaseballData);
    })();
  }, [props.selectedSchool]);

  if (
    (baseballData === null && brassBandData === null) ||
    (baseballData?.length === 0 && brassBandData?.length === 0)
  ) {
    return <div>データがありません</div>;
  }

  const wLen = (contentWidth - 50) / YEAR;
  const hLen = 50;
  const chartHeight = hLen * 4;
  const p = 20;
  const chartWidth = p * 2 + wLen * (YEAR - 1);

  return (
    <div>
      {props.selectedSchool}
      <div>
        <svg
          viewBox={`${-margin.left} ${-margin.top} ${svgWidth} ${svgHeight}`}
        >
          <line
            x1={0}
            x2={0}
            y1={0}
            y2={chartHeight}
            strokeWidth={1}
            stroke={"black"}
          />
          <line
            x1={chartWidth}
            x2={chartWidth}
            y1={0}
            y2={chartHeight}
            strokeWidth={1}
            stroke={"black"}
          />
          <line
            x1={0}
            x2={chartWidth}
            y1={chartHeight}
            y2={chartHeight}
            strokeWidth={1}
            stroke={"black"}
          />

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
                      stroke={"red"}
                    />
                  )}
                </g>
              );
            })}
            {brassBandData.map((result, idx) => {
              return (
                <g key={result.name + result.year}>
                  <circle
                    //TODO:完全に被るとわからなくなる
                    cx={p + wLen * idx}
                    cy={chartHeight - result.rank * hLen}
                    r={10}
                    fill={"pink"}
                  />
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
                      stroke={"skyblue"}
                    />
                  )}
                </g>
              );
            })}
            {baseballData?.map((result, idx) => {
              return (
                <g key={result.name + result.year}>
                  <circle
                    cx={p + wLen * idx}
                    cy={chartHeight - result.rank * hLen}
                    r={10}
                    fill={"blue"}
                  />
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default LineGraph;
