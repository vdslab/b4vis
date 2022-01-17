import { useState, useEffect } from "react";
const YEAR = 5;
const YEAR_LIST = [2013, 2014, 2015, 2016, 2017];
// todo 北海道東京
const brassBandRank = { 地区: 0, 都道府県: 1, 支部: 2, 全国: 3 };
const baseBallRank = { 地区ベスト8位下: 0, 地区ベスト8: 1, " ": 2, 甲子園: 3 };

const LineGraph = (props) => {
  const [brassBandData, setBrasbandData] = useState(null);
  const [baseballData, setBaseballData] = useState(null);
  const margin = {
    top: 10,
    bottom: 10,
    left: 30,
    right: 40,
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

    
      // 吹奏楽
      // データがひとつもないときは何も表示しない
      if (brassBandData.data.length !== 0) {
        for (let year of YEAR_LIST) {
          let find = false;
          for (let item of brassBandData.data) {
            if (item.year===year && item.name === props.selectedSchool) {
              item.rank = brassBandRank[item.last];
              selectedBrassBandData.push(item);
              find = true;
              break;
            }
          }
          if (!find) {
            selectedBrassBandData.push({ year: year, rank: 0, name: "" });
          }
        }
      }


      // 野球
      // データがひとつもないときは何も表示しない
      if (baseballData.data.length!==0) {
        for (let year of YEAR_LIST) {
          let find = false;
          for (let item of baseballData.data) {
            if (item.year === year) {
              if (item.name === props.selectedSchool) {
                if (item.nationalbest !== "") {
                  item.rank = 3;
                } else if (item.regionalbest <= 8) {
                  item.rank = 1;
                } else {
                  item.rank = 0;
                }
                selectedBaseballData.push(item);
                find = true;
                break;
              }
            }
          }
          if (!find) {
            selectedBaseballData.push({ year: year, rank: 0, name: "" });
          }
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

  const wLen = 75; //contentWidth / YEAR;
  const hLen = 20;
  const chartHeight = hLen * 4;
  const p = 20;
  const chartWidth = p * 2 + wLen * (YEAR - 1);
  const r = 5;


  return (
    <div>
      <h1>{props.selectedSchool}</h1>
      <svg viewBox={`${-margin.left} ${-margin.top} ${svgWidth} ${svgHeight}`}>
        <g>
          <g>
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
                    x={-15}
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
                    x1={chartWidth+5}
                    x2={chartWidth}
                    y1={chartHeight - idx * hLen}
                    y2={chartHeight - idx * hLen}
                    strokeWidth={0.5}
                    stroke={"black"}
                  ></line>
                  <text
                    x={chartWidth+20}
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

          <line
            x1={0}
            x2={chartWidth}
            y1={chartHeight}
            y2={chartHeight}
            strokeWidth={0.5}
            stroke={"black"}
          />
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
                  r={r}
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
                  r={r}
                  fill={"blue"}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default LineGraph;
