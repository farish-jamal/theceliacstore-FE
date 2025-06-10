import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginApiResponse {
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

export const loginUser = async (
  payload: LoginPayload
): Promise<LoginApiResponse> => {
  const apiResponse = await apiService<LoginApiResponse>({
    endpoint: endpoints.login,
    method: "POST",
    data: payload,
  });

  return apiResponse.response as LoginApiResponse;
};
