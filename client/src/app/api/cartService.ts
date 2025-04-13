import axios from "axios";
import { Cart, CartItem, CartTotal } from "../models/cart";
import { Dispatch } from "redux";
import { setCart } from "../../features/cart/cartSlice";
import { getDiscountCodes } from "../layout/DiscountNotification";
import { createId } from "@paralleldrive/cuid2";

class cartSerivce {
  apiUrl: string = "http://localhost:8081/api/cart";

  async getCartFromApi() {
    try {
      const response = await axios.get<Cart>(`${this.apiUrl}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch cart items");
    }
  }

  async getCart() {
    try {
      const cart = localStorage.getItem("cart");
      if (cart) {
        return JSON.parse(cart) as Cart;
      } else {
        throw new Error("No cart found in local storage");
      }
    } catch (error) {
      throw new Error("Failed to fetch cart items");
    }
  }

  async addToCart(item: any, quantity = 1, dispatch: Dispatch) {
    try {
      let cart = this.getCurrentCart();
      if (!cart) {
        cart = await this.createCart();
      }

      const itemToAdd = this.mapItemToCartItem(item);
      cart.cartItems = this.upsertItems(cart.cartItems, itemToAdd, quantity);
      this.setCart(cart, dispatch);

      const totals = this.calculateTotals(cart);

      return { cart, totals };
    } catch (error) {
      throw new Error("Failed to add item to cart");
    }
  }

  private getCurrentCart() {
    const cart = localStorage.getItem("cart");
    return cart ? (JSON.parse(cart) as Cart) : null;
  }

  private async createCart(): Promise<Cart> {
    try {
      const newCart: Cart = {
        cartId: createId(),
        userId: 1, //,
        cartItems: [],
      };
      localStorage.setItem("cart_id", newCart.cartId);
      return newCart;
    } catch (error) {
      throw new Error("Failed to create cart");
    }
  }

  private mapItemToCartItem(item: any): CartItem {
    return {
      cartItemId: item.productId || item.bundleId,
      productId: item.productId || null,
      bundleId: item.bundleId || null,
      price: item.price,
      quantity: 1,
    };
  }

  async removeItemFromCart(cartItemId: number, dispatch: Dispatch) {
    const cart = this.getCurrentCart();
    if (cart) {
      const itemIndex = cart.cartItems.findIndex(
        (item) => item.cartItemId === cartItemId
      );
      if (itemIndex !== -1) {
        cart.cartItems.splice(itemIndex, 1);
        this.setCart(cart, dispatch);
      }
      if(cart.cartItems.length === 0) {
        localStorage.removeItem("cart_id");
        localStorage.removeItem("cart");
      }
    }
  }

  async incrementItemQuantity(cartItemId: number, quantity:number = 1,  dispatch: Dispatch) {
    const cart = this.getCurrentCart();
    if (cart) {
      const item = cart.cartItems.find(
        (item) => item.cartItemId === cartItemId
      );
      if (item) {
        item.quantity += quantity;
        if (item.quantity < 1) {
          item.quantity = 1;
        }
        this.setCart(cart, dispatch);
      }
    }
  }

  async decrementItemQuantity(cartItemId: number, quantity:number = 1, dispatch: Dispatch) {
    const cart = this.getCurrentCart();
    if (cart) {
      const item = cart.cartItems.find(
        (item) => item.cartItemId === cartItemId
      );
      if (item && item.quantity > 1) {
        item.quantity -= quantity;
        if (item.quantity < 1) {
          item.quantity = 1;
        }
        this.setCart(cart, dispatch);
      }
    }
  }

  async deleteCart(cartId:string): Promise<void> {
    
    try {
      await axios.delete(`${this.apiUrl}/${cartId}`);
    } catch (error) {
      throw new Error("Failed to delete cart");
    }

  }

  private upsertItems(
    items: CartItem[],
    itemToAdd: CartItem,
    quantity: number
  ): CartItem[] {
    const existingItem = items.find(
      (item) => item.cartItemId === itemToAdd.cartItemId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    }

    return items;
  }

  async setCart(cart: Cart, dispatch: Dispatch) {
    try {
      await axios.post<Cart>(`${this.apiUrl}`, cart);
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch(setCart(cart));
    } catch (error) {
      throw new Error("Failed to set cart.");
    }
  }

  private calculateTotals(cart: Cart): CartTotal {
    const total = cart.cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const discountRate = getDiscountCodes()?.discountRate || 0;
    const discount = discountRate ? total * discountRate : 0;
    const grandTotal = total - discount;

    return {
      total,
      discount,
      grandTotal,
    };
  }
}




export default new cartSerivce();