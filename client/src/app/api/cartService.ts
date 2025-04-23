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
      console.error("Failed to fetch cart items:", error);
      throw new Error("Failed to fetch cart items");
    }
  }

  async getCartById(cartId: string): Promise<Cart> {
    try {
      const response = await axios.get(`${this.apiUrl}/${cartId}`);
      const cart = response.data;
      
      // Validate cart items
      for (const item of cart.cartItems) {
        if (item.price === null || item.price === undefined || item.price <= 0) {
          console.error("Invalid cart item in API response:", item);
          throw new Error(`Invalid cart item price: ${item.price} for cartItemId=${item.cartItemId}`);
        }
        if (!item.quantity || item.quantity <= 0) {
          console.error("Invalid cart item in API response:", item);
          throw new Error(`Invalid cart item quantity: ${item.quantity} for cartItemId=${item.cartItemId}`);
        }
        if ((item.productId !== null && item.bundleId !== null) || (item.productId === null && item.bundleId === null)) {
          console.error("Invalid cart item in API response: productId and bundleId must be mutually exclusive:", item);
          throw new Error(`CartItem must have exactly one of productId or bundleId for cartItemId=${item.cartItemId}`);
        }
      }
      return cart;
    } catch (error) {
      console.error("Failed to fetch cart by ID:", cartId, error);
      throw new Error(`Failed to fetch cart: ${cartId}`);
    }
  }

  async getCart() {
    try {
      const cartId = localStorage.getItem("cart_id");
      if (cartId) {
        const cart = await this.getCartById(cartId);
        localStorage.setItem("cart", JSON.stringify(cart));
        return cart;
      } else {
        throw new Error("No cart found in local storage");
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      return null;
    }
  }

  async addToCart(item: any, quantity = 1, dispatch: Dispatch, discountRate: number = 0, userId: number) {
    try {

      // Validate item data
      if (item.price === null || item.price === undefined || item.price <= 0) {
        throw new Error(`Invalid item price: ${item.price} for productId=${item.productId || 'N/A'}, bundleId=${item.bundleId || 'N/A'}`);
      }
      if (!item.stock || item.stock <= 0) {
        throw new Error(`Invalid item stock: ${item.stock} for productId=${item.productId || 'N/A'}, bundleId=${item.bundleId || 'N/A'}`);
      }
      
      if ((item.productId == null && item.bundleId == null) || (item.productId != null && item.bundleId != null)) {
        throw new Error(`Item must have exactly one of productId or bundleId: productId=${item.productId || 'N/A'}, bundleId=${item.bundleId || 'N/A'}`);
      }

      let cart = await this.getCurrentCart();
      if (!cart) {
        cart = await this.createCart(userId);
      }

      const itemToAdd = this.mapItemToCartItem(item);
      cart.cartItems = this.upsertItems(cart.cartItems, itemToAdd, quantity);
      await this.setCart(cart, dispatch);

      const totals = this.calculateTotals(cart, discountRate);
      return { cart, totals };
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      toast.error("Failed to add item to cart: " + (error || "Unknown error"));
      throw error;
    }
  }

  private async getCurrentCart() {
    const cartId = localStorage.getItem("cart_id");
    if (cartId) {
      return await this.getCartById(cartId);
    }
    return null;
  }

  async createCart(userId: number): Promise<Cart> {
    try {
      const newCart: Cart = {
        cartId: createId(),
        userId,
        cartItems: [],
      };
      const response = await axios.post(this.apiUrl, newCart);
      localStorage.setItem("cart_id", newCart.cartId);
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    } catch (error) {
      console.error("Failed to create cart in backend:", error);
      toast.error("Failed to create cart");
      throw error;
    }
  }

  private mapItemToCartItem(item: any): CartItem {
    const isProduct = item.productId !== undefined && item.productId !== null;

    const cartItem = {
      cartItemId: isProduct ? parseInt(`1${item.productId}`) : parseInt(`2${item.bundleId}`),
      productId: isProduct ? item.productId : null,
      bundleId: isProduct ? null : item.bundleId,
      price: item.price,
      quantity: 1,
      stock: item.stock
    };

    // Validate cart item
    if (cartItem.price === null || cartItem.price === undefined || item.price <= 0) {
      throw new Error(`Invalid cart item price: ${cartItem.price} for cartItemId=${cartItem.cartItemId}`);
    }
    if ((cartItem.productId !== null && cartItem.bundleId !== null) || (cartItem.productId === null && cartItem.bundleId === null)) {
      throw new Error(`CartItem must have exactly one of productId or bundleId for cartItemId=${cartItem.cartItemId}`);
    }

    return cartItem;
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
    try {
      const cart = await this.getCurrentCart();
      if (cart) {
        cart.cartItems = cart.cartItems.filter(item => item.cartItemId !== cartItemId);
        await this.setCart(cart, dispatch);

        if (cart.cartItems.length === 0) {
          localStorage.removeItem("cart_id");
          localStorage.removeItem("cart");
          dispatch(clearCart());
        }
      }
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      toast.error("Failed to remove item from cart");
    }
  }

  async incrementItemQuantity(cartItemId: number, quantity: number = 1, dispatch: Dispatch) {
    try {
      const cart = await this.getCurrentCart();
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

          await this.setCart(cart, dispatch);
        }
      }
    } catch (error) {
      console.error("Failed to increment item quantity:", error);
      toast.error("Failed to update quantity");
    }
  }

  async decrementItemQuantity(cartItemId: number, quantity: number = 1, dispatch: Dispatch) {
    try {
      const cart = await this.getCurrentCart();
      if (cart) {
        const item = cart.cartItems.find(item => item.cartItemId === cartItemId);
        if (item) {
          item.quantity -= quantity;
          if (item.quantity < 1) item.quantity = 1;
          await this.setCart(cart, dispatch);
        }
      }
    } catch (error) {
      console.error("Failed to decrement item quantity:", error);
      toast.error("Failed to update quantity");
    }
  }

  async deleteCart(cartId: string): Promise<void> {
    try {
      await axios.delete(`${this.apiUrl}/${cartId}`);
      localStorage.removeItem("cart");
      localStorage.removeItem("cart_id");
    } catch (error) {
      console.error("Failed to delete cart:", error);
      toast.error("Failed to delete cart");
    }
  }

  async setCart(cart: Cart, dispatch: Dispatch) {
    try {

      // Validate cart items
      for (const item of cart.cartItems) {
        if (item.price === null || item.price === undefined || item.price <= 0) {
          console.error("Invalid cart item detected:", item);
          throw new Error(`Invalid cart item price: ${item.price} for cartItemId=${item.cartItemId}`);
        }
        if (!item.quantity || item.quantity <= 0) {
          console.error("Invalid cart item detected:", item);
          throw new Error(`Invalid cart item quantity: ${item.quantity} for cartItemId=${item.cartItemId}`);
        }
        if ((item.productId !== null && item.bundleId !== null) || (item.productId === null && item.bundleId === null)) {
          console.error("Invalid cart item detected: productId and bundleId must be mutually exclusive:", item);
          throw new Error(`CartItem must have exactly one of productId or bundleId for cartItemId=${item.cartItemId}`);
        }
      }
      const response = await axios.post<Cart>(this.apiUrl, cart);
      localStorage.setItem("cart", JSON.stringify(response.data));
      dispatch(setCart(response.data));
    } catch (error) {
      console.error("Failed to set cart:", error);
      toast.error("Failed to sync cart with server");
      throw error;
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