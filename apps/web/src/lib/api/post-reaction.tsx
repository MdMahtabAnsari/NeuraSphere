import { api } from "./api";
import { isLoggedIn } from "./auth";

import { z } from "zod";

import { ReactionResponseSchema,LikeAndDislikeResponseSchema } from "@workspace/schema/api-response/post-reaction";


export const likePost = async (postId:string): Promise<z.infer<typeof ReactionResponseSchema>> => {
    try {
       const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.post(`/api/posts/reactions/like`, { postId });
        return response.data as z.infer<typeof ReactionResponseSchema>;
    } catch (error) {
        console.error("Error liking post:", error);
        return {
            message: "Error liking post",
            status: "error",
            data: 0,
        };
    }
};

export const dislikePost = async (postId:string): Promise<z.infer<typeof ReactionResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.post(`/api/posts/reactions/dislike`, { postId });
        return response.data as z.infer<typeof ReactionResponseSchema>;
    } catch (error) {
        console.error("Error disliking post:", error);
        return {
            message: "Error disliking post",
            status: "error",
            data: 0,
        };
    }
}

export const removeLikePost = async (postId:string): Promise<z.infer<typeof ReactionResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.delete(`/api/posts/reactions/${postId}/like`);
        return response.data as z.infer<typeof ReactionResponseSchema>;
    } catch (error) {
        console.error("Error removing like from post:", error);
        return {
            message: "Error removing like from post",
            status: "error",
            data: 0,
        };
    }
}

export const removeDislikePost = async (postId:string): Promise<z.infer<typeof ReactionResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.delete(`/api/posts/reactions/${postId}/dislike`);
        return response.data as z.infer<typeof ReactionResponseSchema>;
    } catch (error) {
        console.error("Error removing dislike from post:", error);
        return {
            message: "Error removing dislike from post",
            status: "error",
            data: 0,
        };
    }
}

export const getLikedUsers = async (postId:string): Promise<z.infer<typeof LikeAndDislikeResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.get(`/api/posts/reactions/${postId}/users/like`);
        return response.data as z.infer<typeof LikeAndDislikeResponseSchema>;
    } catch (error) {
        console.error("Error getting liked users:", error);
        return {
            message: "Error getting liked users",
            status: "error",
            data: {
                users: [],
                totalPage: 0,
                currentPage: 1,
            },
        };
    }
};

export const getDislikedUsers = async (postId:string): Promise<z.infer<typeof LikeAndDislikeResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.get(`/api/posts/reactions/${postId}/users/dislike`);
        return response.data as z.infer<typeof LikeAndDislikeResponseSchema>;
    } catch (error) {
        console.error("Error getting disliked users:", error);
        return {
            message: "Error getting disliked users",
            status: "error",
            data: {
                users: [],
                totalPage: 0,
                currentPage: 1,
            },
        };
    }
};