import { UpdateSharp } from "@mui/icons-material";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  selectedSchool: "",
  selectedPrefecture: "",
  allSchoolData: null,
  allSchoolCountData: null,
  inputSchoolName: "",
};

export const fetchAllSchoolData = createAsyncThunk(
  "app/fetchAllSchoolData",
  async () => {
    const brassbandData = await fetch("../api/brassBand/getAllSchool").then(
      (res) => res.json()
    );
    const baseballData = await fetch("../api/baseball/getAllSchool").then(
      (res) => res.json()
    );
    const data = {
      brassbandData: brassbandData.data,
      baseballData: baseballData.data,
    };
    console.log("getData", data);
    return data;
  }
);

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    updateSelectedSchool(state, action) {
      state.selectedSchool = action.payload;
    },
    updateSelectedPrefecture(state, action) {
      state.selectedPrefecture = action.payload;
    },
    // updateAllSchoolData(state, action) {
    //   state.allSchoolData = action.payload;
    // },
    // updateAllSchoolCountData(state, action) {
    //   state.allSchoolCountData = action.payload;
    // },
    updateInputSchoolName(state, action) {
      state.inputSchoolName = action.payload;
    },
  },
  extraReducers: {
    [fetchAllSchoolData.fulfilled]: (state, action) => {
      state.allSchoolData = action.payload;
    },
  },
});
