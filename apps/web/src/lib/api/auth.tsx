import { signup as signupSchema,login as loginSchema } from "@workspace/schema/auth";
import {updateUserOtpBasedPassword} from "@workspace/schema/user"
import { api } from "./api";
import { AxiosError } from "axios";
import {z} from "zod";

export const signup = async (data: z.infer<typeof signupSchema>) => {
    try {
        const response = await api.post("/api/auth/signup", data);
        return response.data;
    } catch (error) {
        console.error("Error signing up:", error);
        if(error instanceof AxiosError) {
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
        if(error instanceof AxiosError) {
            return error.response
        }
        return error;
    }
}

export const resetPassword =  async (data:z.infer<typeof updateUserOtpBasedPassword>)=>{
    try{
        const response = await api.post("/api/auth/reset-password",data);
        return response.data;
    } catch (error) {
        console.error("Error resetting password:", error);
        if(error instanceof AxiosError) {
            return error.response;
        }
        return error;
    }
}