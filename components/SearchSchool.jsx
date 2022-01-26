import { useEffect } from "react";
import { Paper, InputBase, List, ListItem } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

const SearchSchool = (props) => {
  useEffect(() => {
    if (props.inputSchoolName) {
      const { baseballData, brassbandData } = props.data;
      const res = [];
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
            res.push(item.name);
          }
        }
        for (const item of baseballData) {
          if (item.name.includes(props.inputSchoolName)) {
            res.push(item.name);
          }
        }
      }
      console.log(new Set([res]));
    }
  }, [props.inputSchoolName]);
  return (
    <Paper sx={{ p: "4px 4px", display: "flex", alignItems: "center" }}>
      <InputBase
        placeholder="SchoolName"
        inputProps={{ "aria-label": "SchoolName" }}
        inputRef={props.inputEl}
      />
      <IconButton
        type="text"
        sx={{ p: "10px" }}
        aria-label="search"
        onClick={props.changeSchoolName}
      >
        <SearchIcon />
      </IconButton>

      <List>{}</List>
    </Paper>
  );
};

export default SearchSchool;
