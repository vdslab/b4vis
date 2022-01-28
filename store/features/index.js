import { UpdateSharp } from "@mui/icons-material";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  selectedSchool: "",
  selectedPrefecture: "",
  allSchoolData: null,
  allSchoolCountData: null,
  inputSchoolName: "",
};

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
    updateAllSchoolData(state, action) {
      state.allSchoolData = action.payload;
    },
    updateAllSchoolData(state, action) {
      state.allSchoolCountData = action.payload;
    },
    updateInputSchoolName(state, action) {
      state.inputSchoolName = action.payload;
    },
  },
});
