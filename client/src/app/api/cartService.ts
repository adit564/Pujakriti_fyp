import axios from "axios";
import { Cart, CartItem, CartTotal } from "../models/cart";
import { Dispatch } from "redux";
import { clearCart, setCart } from "../../features/cart/cartSlice";
import { createId } from "@paralleldrive/cuid2";
import { toast } from "react-toastify";

class cartService {
  apiUrl: string = "http://localhost:8081/api/cart";

  async getCartFromApi() {
    try {
      const response = await axios.get<Cart>(`${this.apiUrl}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch cart items");
    }
  }

  async getCartById(cartId: string): Promise<Cart> {
    const response = await axios.get(`/api/cart/${cartId}`);
    return response.data;
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

  async addToCart(item: any, quantity = 1, dispatch: Dispatch, discountRate: number = 0, userId: number) {
    try {
      let cart = this.getCurrentCart();
      if (!cart) {
        cart = await this.createCart(userId);
      }

      const itemToAdd = this.mapItemToCartItem(item);
      cart.cartItems = this.upsertItems(cart.cartItems, itemToAdd, quantity);
      this.setCart(cart, dispatch);

      const totals = this.calculateTotals(cart, discountRate);
      return { cart, totals };
    } catch (error) {
      throw new Error("Failed to add item to cart");
    }
  }

  private getCurrentCart() {
    const cart = localStorage.getItem("cart");
    return cart ? (JSON.parse(cart) as Cart) : null;
  }

  private async createCart(userId: number): Promise<Cart> {
    const newCart: Cart = {
      cartId: createId(),
      userId,
      cartItems: [],
    };
    localStorage.setItem("cart_id", newCart.cartId);
    return newCart;
  }

  private mapItemToCartItem(item: any): CartItem {
    const isProduct = item.productId !== undefined && item.productId !== null;

    return {
      cartItemId: isProduct ? parseInt(`1${item.productId}`) : parseInt(`2${item.bundleId}`), // unique ID
      productId: isProduct ? item.productId : 0,
      bundleId: isProduct ? 0 : item.bundleId,
      price: item.price,
      quantity: 1,
      stock:item.stock
    };
  }

  private upsertItems(items: CartItem[], itemToAdd: CartItem, quantity: number): CartItem[] {
    const existingItem = items.find(item =>
      item.productId === itemToAdd.productId &&
      item.bundleId === itemToAdd.bundleId
    );
  
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      existingItem.quantity = newQuantity > existingItem.stock ? existingItem.stock : newQuantity;
    } else {
      itemToAdd.quantity = quantity > itemToAdd.stock ? itemToAdd.stock : quantity;
      items.push(itemToAdd);
    }
  
    return items;
  }
  async removeItemFromCart(cartItemId: number, dispatch: Dispatch) {
    const cart = this.getCurrentCart();
    if (cart) {
      cart.cartItems = cart.cartItems.filter(item => item.cartItemId !== cartItemId);
      this.setCart(cart, dispatch);

      if (cart.cartItems.length === 0) {
        localStorage.removeItem("cart_id");
        localStorage.removeItem("cart");
        dispatch(clearCart());
      }
    }
  }
  async incrementItemQuantity(cartItemId: number, quantity: number = 1, dispatch: Dispatch) {
    const cart = this.getCurrentCart();
    if (cart) {
      const item = cart.cartItems.find(item => item.cartItemId === cartItemId);
      if (item) {
        const newQuantity = item.quantity + quantity;
  
        if (newQuantity > item.stock) {
          toast.warning("Cannot add more than available stock.");
          item.quantity = item.stock;
        } else {
          item.quantity = newQuantity;
        }
  
        if (item.quantity < 1) item.quantity = 1;
  
        this.setCart(cart, dispatch);
      }
    }
  }

  async decrementItemQuantity(cartItemId: number, quantity: number = 1, dispatch: Dispatch) {
    const cart = this.getCurrentCart();
    if (cart) {
      const item = cart.cartItems.find(item => item.cartItemId === cartItemId);
      if (item) {
        item.quantity -= quantity;
        if (item.quantity < 1) item.quantity = 1;
        this.setCart(cart, dispatch);
      }
    }
  }

  async deleteCart(cartId: string): Promise<void> {
    try {
      await axios.delete(`${this.apiUrl}/${cartId}`);
    } catch (error) {
      throw new Error("Failed to delete cart");
    }
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

  private calculateTotals(cart: Cart, discountRate: number = 0): CartTotal {
    const total = cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discount = total * discountRate;
    const grandTotal = total - discount;
    return { total, discount, grandTotal };
  }

  public getCartTotals(cart: Cart, discountRate: number = 0): CartTotal {
    return this.calculateTotals(cart, discountRate);
  }
}

export default new cartService();
