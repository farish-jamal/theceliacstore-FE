export interface Address {
  _id?: string;
  user?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  mobile: string;
  isPrimary?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CreateAddressPayload {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  mobile: string;
  isPrimary?: boolean;
}

export interface UpdateAddressPayload extends CreateAddressPayload {
  _id: string;
}

export interface AddressApiResponse {
  success: boolean;
  data: Address;
  message: string;
  statusCode: number;
}

export interface AddressListApiResponse {
  success: boolean;
  data: Address[];  // Direct array, not nested in addresses object
  message: string;
  statusCode: number;
} 