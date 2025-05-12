import { api } from "./api"
import { AxiosError } from "axios"
import { UsersResponseSchema,UserProfileResponseSchema } from "@workspace/schema/api-response/user"
import { isLoggedIn } from "./auth"
import { z } from "zod"
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

export const searchUsers = async ({identifier,page,limit}:{identifier:string,page:number,limit:number}):Promise<z.infer<typeof UsersResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn()
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in")
        }

        const response = await api.get(`/api/users/${identifier}`, { params: {page, limit } })
        console.log("response", response)
        return response.data as z.infer<typeof UsersResponseSchema>
    } catch (error) {
        console.error("Error searching users:", error)
        return {
            message: "Error searching users",
            status: "error",
            data: {
                users: [],
                totalPage: 0,
                currentPage: 1,
            },
        }
    }
}

export const getMyProfile = async ():Promise<z.infer<typeof UserProfileResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn()
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in")
        }

        const response = await api.get(`/api/users/profile/me`)
        return response.data as z.infer<typeof UserProfileResponseSchema>
    } catch (error) {
        console.error("Error fetching my profile:", error)
        return {
            message: "Error fetching my profile",
            status: "error",
            data: {
                profile: {
                    id: "",
                    username: "",
                    email: "",
                    mobile: "",
                    name: "",
                    bio: "",
                    image: "",
                    dob: "",
                    isVerified: false,
                    createdAt: "",
                    updatedAt: "",
                },
                followersCount: 0,
                followingCount: 0,
                friendsCount: 0,
                postCount: 0,
                isUserProfile: true,
            },
        }
    }
}

export const getProfile = async (id: string):Promise<z.infer<typeof UserProfileResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn()
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in")
        }

        const response = await api.get(`/api/users/profile/${id}`)
        return response.data as z.infer<typeof UserProfileResponseSchema>
    } catch (error) {
        console.error("Error fetching profile:", error)
        return {
            message: "Error fetching profile",
            status: "error",
            data: {
                profile: {
                    id: "",
                    username: "",
                    email: "",
                    mobile: "",
                    name: "",
                    bio: "",
                    image: "",
                    dob: "",
                    isVerified: false,
                    createdAt: "",
                    updatedAt: "",
                },
                followersCount: 0,
                followingCount: 0,
                friendsCount: 0,
                postCount: 0,
                isUserProfile: false,
            },
        }
    }
}
