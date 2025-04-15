import { api } from "./api"
import { AxiosError } from "axios"
export const isUsernameAvailable = async (username: string) => {
    try {
        const response = await api.get(`/api/users/isAvailable/username/${username}`)
        return response.data
    } catch (error) {
        console.error('Error checking username availability:', error)
        
        if (error instanceof AxiosError) {
            return error.response;
        }
        return error;
    }
}

export const isEmailAvailable = async (email: string) => {
    try {
        const response = await api.get(`/api/users/isAvailable/email/${email}`)
        return response.data
    } catch (error) {
        console.error('Error checking email availability:', error)
        
        if (error instanceof AxiosError) {
            return error.response;
        }
        return error
    }
}

export const isMobileAvailable = async (mobile: string) => {
    try {
        const response = await api.get(`/api/users/isAvailable/mobile/${mobile}`)
        return response.data
    } catch (error) {
        console.error('Error checking mobile availability:', error)
        
        if (error instanceof AxiosError) {
            return error.response;
        }
        return error;
    }
}

export const isValidEmail = async (email: string) => {
    try {
        const response = await api.get(`/api/users/isValid/email/${email}`)
        return response.data
    } catch (error) {
        console.error('Error checking email validity:', error)
        
        if (error instanceof AxiosError) {
            return error.response;
        }
        return error;
    }
}