import { signup as signupSchema, login as loginSchema } from "@workspace/schema/auth";
import { updateUserOtpBasedPassword } from "@workspace/schema/user"
import { api } from "./api";
import { AxiosError } from "axios";
import { z } from "zod";
import { NextRequest } from "next/server";

export const signup = async (data: z.infer<typeof signupSchema>) => {
    try {
        const response = await api.post("/api/auth/signup", data);
        return response.data;
    } catch (error) {
        console.error("Error signing up:", error);
        if (error instanceof AxiosError) {
            return error.response
        }
        return error;

    }
};

export const login = async (data: z.infer<typeof loginSchema>) => {
    try {
        const response = await api.post("/api/auth/login", data);
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        if (error instanceof AxiosError) {
            return error.response
        }
        return error;
    }
}

export const resetPassword = async (data: z.infer<typeof updateUserOtpBasedPassword>) => {
    try {
        const response = await api.post("/api/auth/reset-password", data);
        return response.data;
    } catch (error) {
        console.error("Error resetting password:", error);
        if (error instanceof AxiosError) {
            return error.response;
        }
        return error;
    }
}

export const logout = async () => {
    try {
        const response = await api.post("/api/auth/logout");
        return response.data;
    } catch (error) {
        console.error("Error logging out:", error);
        if (error instanceof AxiosError) {
            return error.response
        }
        return error;
    }
}

export const refreshToken = async (): Promise<boolean> => {
    try {
        await api.post("/api/auth/refresh");
        return true;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return false;
    }
};

export const isLoggedIn = async (): Promise<boolean> => {
    try {
        await api.post("/api/auth/is-logged-in");
        return true;
    } catch (error) {
        if(error instanceof AxiosError) {
            if (error.response?.status === 401) {
                return await refreshToken();
            }
        }
        console.error("Error checking login status:", error);
        return false;
    }
};

export const isLoggedInEdge = async (request: NextRequest) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/is-logged-in`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Cookie:request.cookies.toString()

            }
        });
        if (response.ok) {
            return true;
        }
        if (response.status === 401) {
            try {
                return await refreshTokenEdge(request);
            } catch (error) {
                console.error("Error refreshing token:", error);
                return false;
            }
        }
        return false;

    } catch (error) {
        console.error("Error checking login status:", error);
        return false;

    }
}

export const refreshTokenEdge = async (request: NextRequest) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Cookie: request.cookies.toString()
            }
        });
        if (response.ok) {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return false;
    }
}