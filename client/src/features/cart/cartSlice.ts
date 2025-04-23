import { createSlice } from "@reduxjs/toolkit";
import { Cart } from "../../app/models/cart";



interface CartState {
    cart: Cart | null
}

const initialState: CartState = {
    cart: null
}


export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart: (state, action) => {
            state.cart = action.payload;
        },
        clearCart: (state) => {
            state.cart = null;
            localStorage.removeItem("cart");
            localStorage.removeItem("cart_id");
        }
    }
    
});


export const { setCart } = cartSlice.actions;

export const { clearCart } = cartSlice.actions;
