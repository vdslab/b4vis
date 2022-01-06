import { useState, useEffect } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";

const JapanMap = (props) => {
  const [prefectures, setPrefectures] = useState([]);
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

  const projection = geoMercator()
    .center([135, 35])
    .scale(1000)
    .translate([svgWidth / 2, svgHeight / 2]);
  const path = geoPath().projection(projection);

  useEffect(() => {
    fetch("data/japanMap.topojson").then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          setPrefectures(feature(data, data.objects.japanMap).features);
        });
      } else {
        console.error(`${response.status}`);
      }
    });
  }, []);

  return (
    <svg width={svgWidth} height={svgHeight}>
      <g className="prefectures">
        {prefectures.map((prefecture, i) => {
          const prefectureName = prefecture.properties.name_ja.slice(0, -1);
          // 選択されていれば赤，そうでなければ灰
          const color =
            prefectureName === props.selectedPrefecture ? "#FF0000" : "#808080";
          return (
            <path
              key={i}
              className={prefectureName}
              d={path(prefecture)}
              fill={color}
              stroke="#000000"
              strokeWidth={0.5}
              onClick={(e) => {
                props.changePrefecture(e.target.className.baseVal);
              }}
            />
          );
        })}
      </g>
    </svg>
  );
};

export default JapanMap;
