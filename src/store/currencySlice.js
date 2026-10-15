import { createSlice } from "@reduxjs/toolkit";

const currencySlice = createSlice({
  name: "currency",
  initialState: { selected: "SEK", rates: { SEK: 1 } },
  reducers: {
    setCurrency(state, action) {
      state.selected = action.payload;
    },
    setRates(state, action) {
      state.rates = action.payload;
    },
  },
});

export const { setCurrency, setRates } = currencySlice.actions;
export default currencySlice.reducer;
