import axios, { AxiosRequestConfig, Method } from "axios";
import { BACKEND_URL } from "../constants/URL";
import { getCookie } from "../utils/getCookie";

interface ApiServiceParams {
  endpoint: string;
  method?: Method;
  data?: unknown;
  params?: unknown;
  token?: string;
  headers?: Record<string, string>;
  customUrl?: string;
  removeToken?: boolean;
  signal?: AbortSignal;
}

export const apiService = async <T = unknown>({
  endpoint,
  method = "GET",
  data,
  params,
  token: _token,
  headers = {},
  customUrl,
  removeToken = false,
  signal,
}: ApiServiceParams): Promise<
  { response: T } | { success: false; error: true; [key: string]: unknown }
> => {
  try {
    let token: string | null = null;
    if (typeof window !== "undefined") {
      token = getCookie("token");
    }

    const requestHeaders: Record<string, string> = {
      "ngrok-skip-browser-warning": "true",
      ...headers,
    };

    if (!removeToken && (token || _token)) {
      requestHeaders.Authorization = `Bearer ${_token || token}`;
    }

    const requestObj: AxiosRequestConfig = {
      url: `${customUrl ? customUrl : BACKEND_URL}/${endpoint}`,
      method,
      params,
      data,
      headers: requestHeaders,
    };

    if (signal) {
      requestObj.signal = signal;
    }

    const { data: res } = await axios.request<T>(requestObj);
    return { response: res };
  } catch (error) {
    console.error(error, "backend endpoint error");
    return { success: false, error: true, ...(error || {}) };
  }
};
