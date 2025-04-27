import axios, { AxiosError, AxiosResponse } from "axios";
import { router } from "../router/routes";
import { toast } from "react-toastify";
import cartService from "./cartService";
import { Dispatch } from "redux";
import { Cart } from "../models/cart";
import addressService from "./addressService";
import { AddressFormValues } from "../models/address";
import type { User } from "../models/user";
import { types } from "util";

axios.defaults.baseURL = "http://localhost:8081/api/";

interface OrderItemDTO {
  orderItemId: number;
  productId?: number;
  bundleId?: number;
  quantity: number;
  price: number;
}


interface OrdersItemDTO {
  orderItemId: number;
  productName?: string;
  bundleName?: string;
  quantity: number;
  price: number;
}

export interface OrdersResponse {
  orderId: number
  totalAmount: number
  addressCity: string
  addressStreet: string
  addressState: string
  status: string
  discountCode: string
  discountRate: number
  orderDate: string
  orderItems: OrdersItemDTO[]
  transactionId: string
}


axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
    const response = error.response as AxiosResponse;
    const errorData = response?.data as
      | { detail?: string }
      | string
      | undefined;

    let errorMessage = error.message || "No response data";

    if (typeof errorData === "object" && errorData?.detail) {
      errorMessage = errorData.detail;
    } else if (typeof errorData === "string") {
      errorMessage = errorData;
    }

    const status = response?.status;
    const config = error.config;

    switch (status) {
      case 400:
        toast.error(`Bad request: ${errorMessage}`);
        router.navigate("/bad-request");
        return Promise.reject({ message: errorMessage, status, data: response?.data });
        break;
      case 401:
        if (config?.url?.endsWith("/api/auth/login")) {
          return Promise.reject({
            message: errorMessage,
            status,
            data: response?.data,
          });
        } else {
          toast.error(`Unauthorized access: ${errorMessage}`);
          router.navigate("/unauthorized");
          return Promise.reject({ message: errorMessage, status, data: response?.data });
        }
        break;
      case 404:
        toast.error(`Resource not found: ${errorMessage}`);
        router.navigate("/not-found");
        break;
      case 405:
        toast.error(`Method not allowed: ${errorMessage}`);
        router.navigate("/bad-request");
        break;
      case 409: // HANDLE THE 409 CONFLICT FOR DUPLICATE EMAIL
        if (config?.url?.endsWith('/api/auth/signup') && errorMessage.toLowerCase().includes('email address already exists')) {
          toast.error(errorMessage);
          return Promise.reject({ message: errorMessage, status, data: response?.data });
        } else {
          toast.error(`Conflict: ${errorMessage}`);
          router.navigate("/bad-request"); // Or a more appropriate conflict route
          return Promise.reject({ message: errorMessage, status, data: response?.data });
        }
        break;
      case 500:
        if (config?.url?.endsWith("/api/auth/login")) {
          toast.error(`Login failed please check your credentials`);
        } else {
          router.navigate("/server-error");
          toast.error(`Internal Server error: ${errorMessage}`);
        }
        break;
      default:
        if (error.code === "ERR_NETWORK") {
          toast.error("Network error: Unable to connect to the server");
        } else {
          toast.error(`An error occurred: ${errorMessage}`);
        }
        router.navigate("/server-error");
        break;
    }

    return Promise.reject({
      message: errorMessage,
      status,
      data: response?.data,
    });
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
  types: () =>
    requests
      .get("products/categories")
      .then((types) => [{ id: 0, name: "All" }, ...types]),
  search: (keyword: string) =>
    requests.get(`products?keyword=${keyword}`).then((res) => res.content),
};

const ProductImages = {
  list: () => requests.get("images/productImages?size=50"),
  get: (productId: number) => requests.get(`images/product/${productId}`),
};

const BundleList = {
  list: () => requests.get("bundles?size=50"),
  get: (bundleId: number) => requests.get(`bundles/${bundleId}`),
  types: () =>
    requests
      .get("bundles/pujas")
      .then((types) => [{ id: 0, name: "All" }, ...types]),
  search: (keyword: string) =>
    requests.get(`bundles?keyword=${keyword}`).then((res) => res.content),
  allCastes:()=>
    requests
    .get("bundles/castes")
    .then((types)=>[{id:0, name:"All"},...types]),
    allBundleCastes:()=>
      requests
      .get("bundles/bundleCastes")
      .then((types)=>[{id:0, name:"All"},...types]),
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
  createCart: async (userId: number) => {
    try {
      return await cartService.createCart(userId);
    } catch (error) {
      console.log("Failed to create Cart: " + error);
      throw error;
    }
  },
  addItem: async (
    item: any,
    quantity: number,
    dispatch: Dispatch,
    discountRate: number = 0,
    userId: number | undefined
  ) => {
    try {
      const result = await cartService.addToCart(
        item,
        quantity,
        dispatch,
        discountRate,
        userId ?? 0
      );
      return result;
    } catch (error) {
      console.log("Failed to add item to cart: ", error);
      throw error;
    }
  },
  removeItem: async (cartItemId: number, dispatch: Dispatch) => {
    try {
      const result = await cartService.removeItemFromCart(cartItemId, dispatch);
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
  },
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
  create: async (
    userId: number,
    addressId: number,
    cartId: string,
    discountCode?: string
  ): Promise<number> => {
    try {
      const params = new URLSearchParams({
        userId: userId.toString(),
        addressId: addressId.toString(),
        cartId,
        ...(discountCode && { discountCode }),
      });
      // console.log("Creating order with URL:", `orders?${params.toString()}`);
      const response = await requests.post(`orders?${params.toString()}`, {});
      // console.log("Order response:", response);
      return response as number;
    } catch (error) {
      console.log("Failed to create order: ", error);
      throw error;
    }
  },
  getAllOrders: async(userId: number)=>{
    try {
      const response = await requests.get(`orders/${userId}`);
      return response;
    } catch (error) {
      toast.error("Failed to fetch orders" + error);
      throw error;
    }
  }
};

interface StatusResponse {
  status: "COMPLETED" | "FAILED" | "ERROR";
  message?: string;
}

const Payments = {
  initiate: async (orderId: number, amount: number): Promise<string> => {
    try {
      const params = new URLSearchParams({
        orderId: orderId.toString(),
        amount: amount.toFixed(2),
      });
      console.log(
        "Initiating payment with URL:",
        `payments/initiate?${params.toString()}`
      );
      const response = await axios.get(
        `payments/initiate?${params.toString()}`,
        {
          headers: { Accept: "text/html" },
        }
      );
      console.log("Payment initiate response:", response.data);
      return response.data;
    } catch (error) {
      console.log("Failed to initiate payment: ", error);
      throw error;
    }
  },
  verify: async (
    orderId: string,
    amount: string | null,
    transactionId: string | null
  ): Promise<StatusResponse> => {
    try {
      const status = new URLSearchParams(window.location.search).get("status") || "success";
      
      const params = new URLSearchParams({
        orderId,
        status,
        ...(amount && { amt: amount }),
        ...(transactionId && { refId: transactionId }),
      });
  
      const response = await requests.get(`payments/verify?${params.toString()}`);
      return response;
    } catch (error) {
      console.log("Failed to verify payment: ", error);
      throw error;
    }
  },
};

const User={
  getUser: async(userId: number)=>{
    try{
      const response = await requests.get(`users/${userId}`)
      return response;
    }catch(error){
      toast.error("Failed to fetch user" + error);
      console.log("Failed to fetch user", error)
      throw error;
    }
  },
  updateUser: async (userId:number, userResponse: User) =>{
    try{
      const response = await requests.put(`users/update/${userId}`,userResponse);
      return response;
    }catch(error){
      toast.error("Failed to update user" + error);
      console.log("Failed to update user", error)
      throw error;
    }
  }
}


const agent = {
  Cartt,
  ProductsList,
  ProductImages,
  BundleList,
  BundleImages,
  Address,
  Orders,
  Payments,
  User
};




export default agent;
