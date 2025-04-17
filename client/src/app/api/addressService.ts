import { Address, AddressFormValues } from "../models/address";
import axios from "axios";

const apiUrl: string = "http://localhost:8081/api/addresses";

const getUserAddresses = async (userId: number): Promise<Address[]> => {
  const response = await axios.get(`${apiUrl}/user/${userId}`);
  return response.data;
};

const createAddress = async (address: AddressFormValues): Promise<Address> => {
  const response = await axios.post(apiUrl, address);
  return response.data;
};

const updateAddress = async (id: number, address: AddressFormValues): Promise<Address> => {
  const response = await axios.put(`${apiUrl}/${id}`, address);
  return response.data;
};

const deleteAddress = async (id: number): Promise<void> => {
  await axios.delete(`${apiUrl}/${id}`);
};

const setDefaultAddress = async (addressId: number, userId: number): Promise<Address> => {
  const response = await axios.put(`${apiUrl}/${addressId}/default?userId=${userId}`);
  return response.data;
};

const addressService = {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
};

export default addressService;
