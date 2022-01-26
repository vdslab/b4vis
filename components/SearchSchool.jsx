import { useState, useEffect } from "react";
import {
  Paper,
  InputBase,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchSchool = (props) => {
  const [schoolList, setSchoolList] = useState([]);
  const [inputName, setInputName] = useState("");

  useEffect(() => {
    if (props.inputSchoolName) {
      const { baseballData, brassbandData } = props.data;
      const res = {};
      for (const item of brassbandData) {
        if (item.name.includes(props.inputSchoolName)) {
          if (item["last"] !== "地区") {
            if (
              item["prefecture"].slice(-2) !== "地区" &&
              item["prefecture"] !== "東京都"
            ) {
              if (item["last"] === "都道府県" && item["prize"] !== "金賞")
                continue;
              // 重複が無いようにsetで持っておく
            } else if (item["prefecture"].slice(-2) === "地区") {
              //北海道
              if (item["last"] === "都道府県") continue;
              if (item["last"] === "支部" && item["prize"] !== "金賞") continue;
            } else if (item["prefecture"] === "東京都") {
              if (item["last"] === "都道府県") continue;
              if (item["last"] === "支部" && item["prize"] !== "金賞") continue;
            }
            res[item["name"]] = item["prefecture"];
          }
        }
        for (const item of baseballData) {
          if (item.name.includes(props.inputSchoolName)) {
            const prefecture =
              item["prefecture"].slice(1) === "北海道" ||
              item["prefecture"].slice(1) === "東京"
                ? item["prefecture"]
                : item["prefecture"].slice(0, -1);
            if (prefecture === "北北海道" || prefecture === "南北海道") {
              if (Number(item["regionalbest"]) > 4) continue;
            } else if (prefecture === "東東京" || prefecture === "西東京") {
              if (Number(item["regionalbest"]) > 4) continue;
            }
            res[item["name"]] = item["prefecture"];
          }
        }
      }
      setSchoolList(res);
    }
  }, [props]);

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          p: "4px 4px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <InputBase
          placeholder="SchoolName"
          inputProps={{ "aria-label": "SchoolName" }}
          inputRef={props.inputEl}
          onChange={(e) => {
            if (e.target.value === "") {
              props.changeSchoolName("");
            }
          }}
          sx={{ m: 1 }}
        />
        <IconButton
          type="text"
          sx={{ p: "10px" }}
          aria-label="search"
          onClick={props.changeSchoolName}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
      <List sx={{ overflow: "auto", mt: 1, maxHeight: "100%" }}>
        {Object.entries(schoolList).map((obj, i) => {
          const name = obj[0];
          const prefecture =
            obj[1].slice(1) === "北海道" || obj[1].slice(1) === "東京"
              ? obj[1].slice(1)
              : obj[1].slice(0, -1);
          return (
            <ListItemButton
              key={i}
              onClick={() => {
                props.changePrefecture(prefecture);
                props.changeSchool(name);
              }}
            >
              <ListItemText primary={name} />
            </ListItemButton>
          );
        })}

        {Object.keys(schoolList).length === 0 && props.inputSchoolName !== "" && (
          <div>
            <div>検索結果がありません</div>
            <div>その高校はあまり活躍されていないようです...</div>
          </div>
        )}
      </List>
    </>
  );
};

export default SearchSchool;
