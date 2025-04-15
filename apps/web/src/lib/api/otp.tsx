import { api } from "./api"
import {otpEmailVerify as otpEmailVerifySchema,otpEmailRequest as otpEmailRequestSchema} from "@workspace/schema/otp"
import { AxiosError } from "axios"
import {z} from "zod"

export const otpEmailRequest = async (data: z.infer<typeof otpEmailRequestSchema>) => {
    try {
        const response = await api.post("/api/otp/create/email", data);
        return response.data;
    } catch (error) {
        console.error("Error requesting OTP:", error);
        if (error instanceof AxiosError) {
            return error.response;
        }
        return error;
    }
}

export const otpEmailVerify = async (data: z.infer<typeof otpEmailVerifySchema>) => {
    try {
        const response = await api.post("/api/otp/verify/email", data);
        return response.data;
    } catch (error) {
        console.error("Error verifying OTP:", error);
        if (error instanceof AxiosError) {
            return error.response;
        }
        return error;
    }
}

export const otpForgotPasswordRequest = async (data: z.infer<typeof otpEmailRequestSchema>) => {
    try {
        const response = await api.post("/api/otp/create/forgot-password", data);
        return response.data;
    } catch (error) {
        console.error("Error requesting OTP:", error);
        if (error instanceof AxiosError) {
            return error.response;
        }
        return error;
    }
}

export const otpForgotPasswordVerify = async (data: z.infer<typeof otpEmailVerifySchema>) => {
    try {
        const response = await api.post("/api/otp/verify/forgot-password", data);
        return response.data;
    } catch (error) {
        console.error("Error verifying OTP:", error);
        if (error instanceof AxiosError) {
            return error.response;
        }
        return error;
    }
}

