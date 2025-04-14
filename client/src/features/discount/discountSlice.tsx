import { createSlice } from "@reduxjs/toolkit";
import { DiscountCode } from "../../app/models/discountCode";

interface DiscountState {
  discountCode: DiscountCode | null;
}

const initialState: DiscountState = {
  discountCode: null,
};

export const discountSlice = createSlice({
  name: "discountCode",
  initialState,
  reducers: {
    setDiscountCode: (state, action) => {
      state.discountCode = action.payload;
    },
    clearDiscountCode(state) {
        state.discountCode =null;
    }
  },
});



export const {setDiscountCode,clearDiscountCode} = discountSlice.actions;
