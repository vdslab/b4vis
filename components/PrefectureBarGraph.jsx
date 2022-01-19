import { useEffect, useState } from "react";
import { prefectureName, hokkaidoChikuName } from "../data/prefecture";
import {
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const PrefectureBarGraph = (props) => {
  const [brassbandData, setBrassbandData] = useState(null);
  const [baseballData, setBaseballData] = useState(null);
  const [showData, setShowData] = useState(null);
  const [representative, setRepresentative] = useState("false"); // 代表かどうか
  const [arrangement, setArrangement] = useState("default");
  const [arrangementPrefecture, setArrangementPrefecture] = useState([]);
  // const [colLen, setColLen] = useState(null);
  // const [len, setLen] = useState(null);

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
    fetch("data/barassBand.json")
      .then((res) => res.json())
      .then((res) => setBrassbandData(res));
    fetch("data/baseball.json")
      .then((res) => res.json())
      .then((res) => setBaseballData(res));
  }, []);

  useEffect(() => {
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
        } else if (
          hokkaidoChikuName.find((name) => name === item["prefecture"]) &&
          item["last"] !== "都道府県"
        ) {
          //北海道
          if (representative === "false") {
            if (item["prize"] !== "金賞") continue;
          } else {
            if (item["representative"] === false) continue;
          }
          selectedData["北海道"][item["name"]] = BRASSBAND;
        } else if (
          item["prefecture"] === "東京都" &&
          item["last"] !== "都道府県"
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
        } else if (
          item["prefecture"] === "北北海道" ||
          item["prefecture"] === "南北海道"
        ) {
          if (Number(item["regionalBest"]) <= 4) {
            if (selectedData["北海道"].hasOwnProperty(item["fullName"])) {
              if (selectedData["北海道"][item["fullName"]] === BRASSBAND)
                selectedData["北海道"][item["fullName"]] = DOUBLE;
            } else {
              selectedData["北海道"][item["fullName"]] = BASEBALL;
            }
          }
        } else if (
          item["prefecture"] === "東東京" ||
          item["prefecture"] === "西東京"
        ) {
          if (Number(item["regionalBest"]) <= 4) {
            if (selectedData["東京"].hasOwnProperty(item["fullName"])) {
              if (selectedData["東京"][item["fullName"]] === BRASSBAND)
                selectedData["東京"][item["fullName"]] = DOUBLE;
            } else {
              selectedData["東京"][item["fullName"]] = BASEBALL;
            }
          }
        }
      }

      // 並べ替え
      if (arrangement === "default") {
        for (const prefecture of Object.keys(selectedData)) {
          const tmp = [];
          for (const name of Object.keys(selectedData[prefecture])) {
            tmp.push({
              name,
              club: selectedData[prefecture][name],
            });
          }
          selectedData[prefecture] = tmp;
          selectedData[prefecture].sort((a, b) => a.club - b.club); // 共通/甲子園/吹奏楽の順に並び替え
        }
        setArrangementPrefecture(prefectureName);
      } else {
        const aaa = [];
        for (const prefecture of Object.keys(selectedData)) {
          const tmp = [];
          let cnt = 0;
          for (const name of Object.keys(selectedData[prefecture])) {
            if (selectedData[prefecture][name] === 0) ++cnt;
            tmp.push({
              name,
              club: selectedData[prefecture][name],
            });
          }
          aaa.push({ prefecture, cnt });
          selectedData[prefecture] = tmp;
          selectedData[prefecture].sort((a, b) => a.club - b.club); // 共通/甲子園/吹奏楽の順に並び替え
        }
        if (arrangement === "昇順") aaa.sort((a, b) => a.cnt - b.cnt);
        else aaa.sort((a, b) => b.cnt - a.cnt);
        const bbb = [];
        aaa.map((a, i) => {
          bbb.push(a.prefecture);
        });
        setArrangementPrefecture(bbb);
      }
      setShowData(selectedData);
    }
  }, [baseballData, brassbandData, arrangement]);

  if (!showData) {
    return <div>loading...</div>;
  }

  return (
    <>
      <FormControl sx={{ m: 1, minWidth: 90 }}>
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
      <svg viewBox={`${-margin.left} ${-margin.top} ${svgWidth} ${svgHeight}`}>
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
      </svg>
    </>
  );
};

export default PrefectureBarGraph;