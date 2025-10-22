import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterApiResponse {
  success?: boolean;
  data?: {
    id: string;
    email: string;
    name: string;
    phone: string;
    token: string;
  };
  message?: string;
}

export const registerUser = async (
  payload: RegisterPayload
): Promise<RegisterApiResponse> => {
  const apiResponse = await apiService<RegisterApiResponse>({
    endpoint: endpoints.register,
    method: "POST",
    data: payload,
  });
  return apiResponse.response as RegisterApiResponse;
};
