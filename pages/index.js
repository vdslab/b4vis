import { useState, useEffect } from "react";
import PrefectureBarGraph from "../components/PrefectureBarGraph";
import YearBarGraph from "../components/YearBarGraph";
import LineGraph from "../components/LineGraph";
import Header from "../components/Header";
const { Client } = require("pg");

import { Grid, Paper, Container } from "@mui/material";

function Home(props) {
  // const data = {
  //   baseballData: props.baseballData,
  //   brassbandData: props.brassbandData,
  // };
  const [data, setData] = useState(null);
  const [selectedPrefecture, setSelectedPretecture] = useState("神奈川");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [nowLoading, setNowLoading] = useState(false);

  const changePrefecture = (prefecture) => {
    setSelectedPretecture(prefecture);
  };

  const changeSchool = (school) => {
    setSelectedSchool(school);
  };

  const changeNowLoading = (nowLoading) => {
    setNowLoading(nowLoading);
  };

  // TODO DBからデータ取ってきてgetStaticProps使う
  useEffect(() => {
    (async () => {
      const brassbandData = await fetch("../api/brassBand/getAllSchool").then(
        (res) => res.json()
      );
      const baseballData = await fetch("../api/baseball/getAllSchool").then(
        (res) => res.json()
      );
      setData({
        brassbandData: brassbandData.data,
        baseballData: baseballData.data,
      });
    })();
  }, []);

  return (
    <div>
      <Header />
      <Container sx={{ mt: 1, mb: 1 }} maxWidth="xl">
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid item xs={12} md={7}>
            <Paper elevation={5}>
              <PrefectureBarGraph
                data={data}
                changePrefecture={changePrefecture}
                selectedPrefecture={selectedPrefecture}
                changeSchool={changeSchool}
                selectedSchool={selectedSchool}
                changeNowLoading={changeNowLoading}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Grid
              container
              rowSpacing={2}
              columnSpacing={2}
              sx={{
                height: "calc(100% + 16px)",
              }}
            >
              <Grid item xs={12}>
                <Paper elevation={5} sx={{ height: "100%" }}>
                  <YearBarGraph
                    data={data}
                    changePrefecture={changePrefecture}
                    selectedPrefecture={selectedPrefecture}
                    changeSchool={changeSchool}
                    selectedSchool={selectedSchool}
                    changeNowLoading={changeNowLoading}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={5} sx={{ height: "100%" }}>
                  <LineGraph
                    data={data}
                    changeSchool={changeSchool}
                    selectedSchool={selectedSchool}
                    nowLoading={nowLoading}
                    changeNowLoading={changeNowLoading}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export async function getStaticProps() {
  const client = new Client({
    host: process.env.PGHOST,
    port: 5432,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  });
  const baseballQuery =
    "SELECT s.name, p.name as prefecture, b.year, b.regionalbest, b.nationalbest FROM baseball b, schools s, prefecture p WHERE b.schoolid = s.id AND b.prefectureid = p.id";
  const brassbandQuery =
    "SELECT s.name, p.name as prefecture, b.year, b.prize, b.last FROM brassband b, schools s, prefecture p WHERE b.schoolid = s.id AND b.prefectureid = p.id";
  await client.connect();
  const baseballResult = await client.query(baseballQuery);
  const brassbandResult = await client.query(brassbandQuery);
  await client.end();

  const DOUBLE = 0;
  const BASEBALL = 1;
  const BRASSBAND = 2;
  const DOUBLE_PRIVATE = 3;
  const BASEBALL_PRIVATE = 4;
  const BRASSBAND_PRIVATE = 5;

  const notPrivate = /(県立|市立|府立|都立|北海道|県)/g;

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
  for (const item of brassbandResult.rows) {
    const isPrivateSchool = !item.name.match(notPrivate);
    if (item["last"] !== "地区") {
      if (
        item["prefecture"].slice(-2) !== "地区" &&
        item["prefecture"] !== "東京都"
      ) {
        // 重複が無いようにsetで持っておく
        if (item["last"] === "都道府県" && item["prize"] !== "金賞") continue;
        selectedData[item["prefecture"].slice(0, -1)][item["name"]] =
          isPrivateSchool ? BRASSBAND_PRIVATE : BRASSBAND;
      } else if (item["prefecture"].slice(-2) === "地区") {
        //北海道
        if (item["last"] === "都道府県") continue;
        if (item["last"] === "支部" && item["prize"] !== "金賞") continue;
        selectedData["北海道"][item["name"]] = isPrivateSchool
          ? BRASSBAND_PRIVATE
          : BRASSBAND;
      } else if (item["prefecture"] === "東京都") {
        if (item["last"] === "都道府県") continue;
        if (item["last"] === "支部" && item["prize"] !== "金賞") continue;
        // 重複が無いようにsetで持っておく
        selectedData[item["prefecture"].slice(0, -1)][item["name"]] =
          isPrivateSchool ? BRASSBAND_PRIVATE : BRASSBAND;
      }
    }
  }

  // 甲子園
  for (const item of baseballResult.rows) {
    const isPrivateSchool = !item.name.match(notPrivate);
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
        if (selectedData[prefecture][item["name"]] === BRASSBAND) {
          selectedData[prefecture][item["name"]] = isPrivateSchool
            ? BASEBALL_PRIVATE
            : BASEBALL;
        }
      } else {
        selectedData[prefecture][item["name"]] = isPrivateSchool
          ? BASEBALL_PRIVATE
          : BASEBALL;
      }
    } else if (prefecture === "北北海道" || prefecture === "南北海道") {
      if (Number(item["regionalbest"]) <= 4) {
        if (selectedData["北海道"].hasOwnProperty(item["name"])) {
          if (selectedData["北海道"][item["name"]] === BRASSBAND) {
            selectedData["北海道"][item["name"]] = isPrivateSchool
              ? DOUBLE_PRIVATE
              : DOUBLE;
          }
        } else {
          selectedData["北海道"][item["name"]] = isPrivateSchool
            ? BASEBALL_PRIVATE
            : BASEBALL;
        }
      }
    } else if (prefecture === "東東京" || prefecture === "西東京") {
      if (Number(item["regionalbest"]) <= 4) {
        if (selectedData["東京"].hasOwnProperty(item["name"])) {
          if (selectedData["東京"][item["name"]] === BRASSBAND) {
            selectedData["東京"][item["name"]] = isPrivateSchool
              ? DOUBLE_PRIVATE
              : DOUBLE;
          }
        } else {
          selectedData["東京"][item["name"]] = isPrivateSchool
            ? BASEBALL_PRIVATE
            : BASEBALL;
        }
      }
    }
  }

  console.log(selectedData);

  return {
    props: {
      baseballData: "sample",
      brassbandData: "sample2",
    },
  };
}

export default Home;
