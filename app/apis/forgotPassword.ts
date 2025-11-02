import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordApiResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
  error?: boolean;
  statusCode?: number;
}

export const forgotPassword = async (
  payload: ForgotPasswordPayload
): Promise<ForgotPasswordApiResponse> => {
  const apiResponse = await apiService<ForgotPasswordApiResponse>({
    endpoint: endpoints.forgotPassword,
    method: "POST",
    data: payload,
    removeToken: true,
  });

  return apiResponse.response as ForgotPasswordApiResponse;
};

