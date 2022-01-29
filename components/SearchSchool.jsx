import { useState, useEffect,useRef } from "react";
import {
  Paper,
  InputBase,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector, useDispatch } from "react-redux";
import { appSlice } from "../store/features";

const SearchSchool = (props) => {
  const dispatch = useDispatch();
  const inputEl = useRef("");
  const inputSchoolName = useSelector((state) => state.app.inputSchoolName);
  const allSchoolData = useSelector((state) => state.app.allSchoolData);

  const [schoolList, setSchoolList] = useState([]);

  const changePrefecture = (prefecture) => {
    dispatch(appSlice.actions.updateSelectedPrefecture(prefecture));
  };
  
  const changeSchool = (school) => {
    dispatch(appSlice.actions.updateSelectedSchool(school));
  };

  const changeSchoolName = () => {
    dispatch(appSlice.actions.updateInputSchoolName(inputEl.current.value));
  };

  useEffect(() => {
    if (inputSchoolName) {
      const { baseballData, brassbandData } = allSchoolData;
      const res = {};
      for (const item of brassbandData) {
        if (item.name.includes(inputSchoolName)) {
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
          if (item.name.includes(inputSchoolName)) {
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
  }, [inputSchoolName, allSchoolData]);
  
  // redux導入後値の保存がきいて、おかしくなる

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
          placeholder="学校名で検索"
          inputProps={{ "aria-label": "SchoolName" }}
          inputRef={inputEl}
          fullWidth={true}
          onChange={(e) => {
            if (e.target.value === "") {
              changeSchoolName("");
            }
          }}
          sx={{ m: 1 }}
        />
        <IconButton
          type="text"
          sx={{ p: "10px" }}
          aria-label="search"
          onClick={changeSchoolName}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
      <List sx={{ overflow: "auto", mt: 1, maxHeight: "700px" }}>
        {inputSchoolName !== "" && Object.entries(schoolList).map((obj, i) => {
          const name = obj[0];
          const prefecture =
            obj[1].slice(1) === "北海道" || obj[1].slice(1) === "東京"
              ? obj[1].slice(1)
              : obj[1].slice(0, -1);
          return (
            <ListItemButton
              key={i}
              onClick={() => {
                changePrefecture(prefecture);
                changeSchool(name);
              }}
            >
              <ListItemText primary={name} />
            </ListItemButton>
          );
        })}

        {Object.keys(schoolList).length === 0 && inputSchoolName !== "" && (
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
