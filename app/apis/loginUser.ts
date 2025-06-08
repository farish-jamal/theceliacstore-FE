import axios from "axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
  };
  token: string;
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  // Replace with your real API endpoint
  const response = await axios.post("/api/login", payload);
  return response.data;
}
