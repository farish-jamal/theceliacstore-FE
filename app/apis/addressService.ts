import { apiService } from "./apiService";
import { endpoints } from "./endpoints";
import {
  CreateAddressPayload,
  AddressApiResponse,
  AddressListApiResponse,
} from "@/app/types/Address";

// Get all addresses for a specific user
export const getAddresses = async (userId: string): Promise<AddressListApiResponse> => {
  const apiResponse = await apiService<AddressListApiResponse>({
    endpoint: endpoints.getUserAddresses(userId),
  });
  return apiResponse.response as AddressListApiResponse;
};

// Create a new address
export const createAddress = async (
  payload: CreateAddressPayload
): Promise<AddressApiResponse> => {
  const apiResponse = await apiService<AddressApiResponse>({
    endpoint: endpoints.addresses,
    method: "POST",
    data: payload,
  });
  return apiResponse.response as AddressApiResponse;
};

// Update an existing address
export const updateAddress = async (
  addressId: string,
  payload: CreateAddressPayload
): Promise<AddressApiResponse> => {
  const apiResponse = await apiService<AddressApiResponse>({
    endpoint: `${endpoints.addresses}/${addressId}`,
    method: "PUT",
    data: payload,
  });
  return apiResponse.response as AddressApiResponse;
};

// Delete an address
export const deleteAddress = async (
  addressId: string
): Promise<{ success: boolean; message: string }> => {
  const apiResponse = await apiService<{ success: boolean; message: string }>({
    endpoint: `${endpoints.addresses}/${addressId}`,
    method: "DELETE",
  });
  return apiResponse.response as { success: boolean; message: string };
};

// Get a specific address by ID
export const getAddressById = async (
  addressId: string
): Promise<AddressApiResponse> => {
  const apiResponse = await apiService<AddressApiResponse>({
    endpoint: `${endpoints.addresses}/${addressId}`,
  });
  return apiResponse.response as AddressApiResponse;
}; 