import axios, { AxiosError, AxiosResponse } from "axios";
import { router } from "../router/routes";
import { toast } from "react-toastify";
import cartService from "./cartService";
import { Dispatch } from "redux";
import { Cart } from "../models/cart";
import addressService from "./addressService";
import { AddressFormValues } from "../models/address";

axios.defaults.baseURL = "http://localhost:8081/api/";

interface OrderItemDTO {
  orderItemId: number;
  productId?: number;
  bundleId?: number;
  quantity: number;
  price: number;
}

interface OrderResponse {
  orderId: number;
  userId: number;
  totalAmount: number;
  address: number;
  status: string;
  discountCodeId?: number;
  orderDate: number[];
  orderItems: OrderItemDTO[];
  paymentID?: number;
}

interface PaymentResponse {
  message: string | undefined;
  paymentId: number;
  orderId: number;
  userId: number;
  transactionId?: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  paymentDate: string;
}

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt"); // Changed from "token" to "jwt"
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const idle = () => new Promise((resolve) => setTimeout(resolve, 0));
const responseBody = (response: AxiosResponse) => {
  return response.data;
};

axios.interceptors.response.use(
  async (response) => {
    await idle();
    return response;
  },
  (error: AxiosError) => {
    console.error("Error details:", error);
    const response = error.response as AxiosResponse;
    const data = response?.data || error.message || "No response data";
    const status = response?.status;
    const config = error.config;

    switch (status) {
      case 400:
        toast.error(`Bad request: ${data}`);
        router.navigate("/bad-request");
        break;
      case 401:
        toast.error(`Unauthorized access: ${data}`);
        router.navigate("/unauthorized");
        break;
      case 404:
        toast.error(`Resource not found: ${data}`);
        router.navigate("/not-found");
        break;
      case 405:
        toast.error(`Method not allowed: ${data}`);
        router.navigate("/bad-request");
        break;
      case 500:
        // Check if the error was on the login endpoint
        if (config?.url?.endsWith('/api/auth/login')) {
          toast.error(`Login failed please check your credentials`);

          // Do not navigate, let the component handle the error
        } else {
          router.navigate("/server-error");
        toast.error(`Internal Server error: ${data}`);
        }
        break;
      default:
        if (error.code === "ERR_NETWORK") {
          toast.error("Network error: Unable to connect to the server");
        } else {
          toast.error(`An error occurred: ${data}`);
        }
        router.navigate("/server-error");
        break;
    }

    return Promise.reject({ message: error.message, status, data });
  }
);

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: object) => axios.post(url, body).then(responseBody),
  put: (url: string, body: object) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const ProductsList = {
  list: () => requests.get("products?size=50"),
  get: (productId: number) => requests.get(`products/${productId}`),
  types: () => requests.get("products/categories").then(types => [{ id: 0, name: "All" }, ...types]),
  search: (keyword: string) => requests.get(`products?keyword=${keyword}`).then((res) => res.content),
};

const ProductImages = {
  list: () => requests.get("images/productImages?size=50"),
  get: (productId: number) => requests.get(`images/product/${productId}`),
};

const BundleList = {
  list: () => requests.get("bundles?size=50"),
  get: (bundleId: number) => requests.get(`bundles/${bundleId}`),
  types: () => requests.get("bundles/pujas").then(types => [{ id: 0, name: "All" }, ...types]),
  search: (keyword: string) => requests.get(`bundles?keyword=${keyword}`).then((res) => res.content),
};

const BundleImages = {
  list: () => requests.get("images/bundlesImages?size=50"),
  get: (bundleId: number) => requests.get(`images/bundle/${bundleId}`),
};

const Cartt = {
  get: async () => {
    try {
      return await cartService.getCart();
    } catch (error) {
      console.log("Failed to get cart: ", error);
      throw error;
    }
  },
  createCart: async(userId:number)=>{
    try{
      return await cartService.createCart(userId);
    }catch(error){
      console.log("Failed to create Cart: " + error )
      throw error;
    }
  },
  addItem: async (item: any, quantity: number, dispatch: Dispatch, discountRate: number = 0, userId: number | undefined) => {
    try {
      const result = await cartService.addToCart(item, quantity, dispatch, discountRate, userId ?? 0);
      console.log("Item added to cart: ", result);
      return result;
    } catch (error) {
      console.log("Failed to add item to cart: ", error);
      throw error;
    }
  },
  removeItem: async (cartItemId: number, dispatch: Dispatch) => {
    try {
      const result = await cartService.removeItemFromCart(cartItemId, dispatch);
      console.log("Item removed from cart: ", result);
      return result;
    } catch (error) {
      console.log("Failed to remove item from cart: ", error);
      throw error;
    }
  },
  incrementItemQuantity: async (
    cartItemId: number,
    quantity: number = 1,
    dispatch: Dispatch
  ) => {
    try {
      await cartService.incrementItemQuantity(cartItemId, quantity, dispatch);
    } catch (error) {
      console.log("Failed to increment item quantity: ", error);
      throw error;
    }
  },
  decrementItemQuantity: async (
    cartItemId: number,
    quantity: number = 1,
    dispatch: Dispatch
  ) => {
    try {
      await cartService.decrementItemQuantity(cartItemId, quantity, dispatch);
    } catch (error) {
      console.log("Failed to decrement item quantity: ", error);
      throw error;
    }
  },
  setCart: async (cart: Cart, dispatch: Dispatch) => {
    try {
      await cartService.setCart(cart, dispatch);
    } catch (error) {
      console.log("Failed to set cart: ", error);
      throw error;
    }
  },
  deleteCart: async (cartId: string) => {
    try {
      await cartService.deleteCart(cartId);
    } catch (error) {
      console.log("Failed to delete cart: ", error);
      throw error;
    }
  }
};

const Address = {
  getAll: async (userId: number) => {
    try {
      return await addressService.getUserAddresses(userId);
    } catch (error) {
      console.log("Failed to fetch addresses: ", error);
      throw error;
    }
  },
  create: async (address: AddressFormValues) => {
    try {
      return await addressService.createAddress(address);
    } catch (error) {
      console.log("Failed to create address: ", error);
      throw error;
    }
  },
  update: async (id: number, address: AddressFormValues) => {
    try {
      return await addressService.updateAddress(id, address);
    } catch (error) {
      console.log("Failed to update address: ", error);
      throw error;
    }
  },
  delete: async (id: number) => {
    try {
      return await addressService.deleteAddress(id);
    } catch (error) {
      console.log("Failed to delete address: ", error);
      throw error;
    }
  },
  setDefault: async (addressId: number, userId: number) => {
    try {
      return await addressService.setDefaultAddress(addressId, userId);
    } catch (error) {
      console.log("Failed to set default address: ", error);
      throw error;
    }
  },
};

const Orders = {
  create: async (userId: number, addressId: number, cartId: string, discountCode?: string): Promise<number> => {
    try {
      const params = new URLSearchParams({
        userId: userId.toString(),
        addressId: addressId.toString(),
        cartId,
        ...(discountCode && { discountCode })
      });
      console.log("Creating order with URL:", `orders?${params.toString()}`);
      const response = await requests.post(`orders?${params.toString()}`, {});
      console.log("Order response:", response);
      return response as number; // Explicitly return as number
    } catch (error) {
      console.log("Failed to create order: ", error);
      throw error;
    }
  }
};

interface StatusResponse {
  status: 'COMPLETED' | 'FAILED' | 'ERROR';
  message?: string;
}

const Payments = {
  initiate: async (orderId: number, amount: number): Promise<string> => {
    try {
      const params = new URLSearchParams({
        orderId: orderId.toString(),
        amount: amount.toFixed(2),
      });
      console.log("Initiating payment with URL:", `payments/initiate?${params.toString()}`);
      const response = await axios.get(`payments/initiate?${params.toString()}`, {
        headers: { Accept: "text/html" },
      });
      console.log("Payment initiate response:", response.data);
      return response.data;
    } catch (error) {
      console.log("Failed to initiate payment: ", error);
      throw error;
    }
  },
  verify: async (orderId: string, amount: string, transactionId: string): Promise<StatusResponse> => {
    try {
      const params = new URLSearchParams({
        orderId: orderId, 
        amt: amount,
        refId: transactionId,
      });
      console.log("Verifying payment with URL:", `payments/verify?${params.toString()}`);
      // const response = await requests.get(`payments/verify?${params.toString()}`);
      const response = await requests.get(`payments/verify?orderId=${orderId}&amt=${amount}&refId=${transactionId}`);
      console.log("Payment verify response:", response);
      return response;
    } catch (error) {
      console.log("Failed to verify payment: ", error);
      throw error;
    }
  },
};

const agent = {
  Cartt,
  ProductsList,
  ProductImages,
  BundleList,
  BundleImages,
  Address,
  Orders,
  Payments
};

export default agent;