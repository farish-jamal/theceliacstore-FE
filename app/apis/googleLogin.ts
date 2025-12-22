import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export interface GoogleLoginPayload {
    idToken: string;
}

export interface GoogleLoginApiResponse {
    success?: boolean;
    data?: {
        id: string;
        email: string;
        name: string;
        phone: string;
        profilePicture?: string;
        authProvider?: string;
        token: string;
    };
    message?: string;
}

export const googleLogin = async (
    payload: GoogleLoginPayload
): Promise<GoogleLoginApiResponse> => {
    const apiResponse = await apiService<GoogleLoginApiResponse>({
        endpoint: endpoints.googleLogin,
        method: "POST",
        data: payload,
    });

    return apiResponse.response as GoogleLoginApiResponse;
};
