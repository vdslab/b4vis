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
      setSchoolList([...new Set([...res])]);
    }
  }, [props.inputSchoolName]);
  return (
    <>
      <Paper
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
      <List sx={{ height: "635px", overflow: "auto", mt: 1 }}>
        {schoolList.map((name, i) => {
          return (
            <ListItemButton key={i} onClick={() => props.changeSchool(name)}>
              <ListItemText primary={name} />
            </ListItemButton>
          );
        })}
      </List>
    </>
  );
};

export default SearchSchool;
