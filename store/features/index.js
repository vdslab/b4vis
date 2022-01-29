import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  selectedSchool: "",
  selectedPrefecture: "東京",
  allSchoolData: null,
  allSchoolCountData: null,
  inputSchoolName: "",
  nowLoading: false,
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
    return data;
  }
);

export const updateNowLoading = createAsyncThunk(
  "app/updateNowLoading",
  async (isLoading) => {
    return isLoading;
  }
);

export const updateAllSchoolCountData = createAsyncThunk(
  "app/updateAllSchoolCountData",
  async (data) => {
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
    updateInputSchoolName(state, action) {
      state.inputSchoolName = action.payload;
    },
    resetInputSchoolName(state) {
      state.inputSchoolName = "";
    },
  },
  extraReducers: {
    [fetchAllSchoolData.fulfilled]: (state, action) => {
      state.allSchoolData = action.payload;
    },
    [updateNowLoading.fulfilled]: (state, action) => {
      state.nowLoading = action.payload;
    },
    [updateAllSchoolCountData.fulfilled]: (state, action) => {
      state.allSchoolCountData = action.payload;
    },
  },
});
