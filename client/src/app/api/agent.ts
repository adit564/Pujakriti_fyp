import axios, { AxiosError, AxiosResponse } from "axios";
import { router } from "../router/routes";
import { toast } from "react-toastify";

axios.defaults.baseURL = "http://localhost:8081/api/";



const idle = () => new Promise(resolve => setTimeout(resolve, 100));
const responseBody = (response: AxiosResponse) => {
  return response.data;
}

axios.interceptors.response.use(async response => {
    await idle();
    return response
}, (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;

    switch (status) {
        case 404:
            toast.error("Resource not found:", data);
            router.navigate("/not-found");
            break;
        case 500:
            toast.error("Internal Server error:", data);
            router.navigate("/server-error");
            break;
        case 401:
            toast.error("Unauthorized access:", data);
            router.navigate("/unauthorized");
            break;
        case 400:
            toast.error("Bad request:", data);
            router.navigate("/bad-request");
            break;
        default:
            toast.error("An error occurred:", data);
            break;
    }

    return Promise.reject(error.response);
});



const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody)
}

const ProductsList = {
    list:()=> requests.get("products"),
    get: (productId: number) => requests.get(`products/${productId}`)
}

const ProductImages = {
    list: () => requests.get("images/productImages"),
    get: (productId: number) => requests.get(`images/product/${productId}`)
}

const BundleList = {
    list: () => requests.get("bundles"),
    get: (bundleId: number) => requests.get(`bundles/${bundleId}`)
}

const BundleImages = {
    list: () => requests.get("images/bundlesImages"),
    get: (bundleId: number) => requests.get(`images/bundle/${bundleId}`)
}

const agent = {
    ProductsList,
    ProductImages,
    BundleList,
    BundleImages
}

export default agent;