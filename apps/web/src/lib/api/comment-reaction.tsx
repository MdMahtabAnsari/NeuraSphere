import { api } from "./api";
import { isLoggedIn } from "./auth";

import { z } from "zod";

import { ReactionResponseSchema,LikedAndDislikedUsersResponseSchema } from "@workspace/schema/api-response/comment-reaction";
import {postIdCommentIdObj} from "@workspace/schema/comment";

export const likeComment = async (data: z.infer<typeof postIdCommentIdObj>): Promise<z.infer<typeof ReactionResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }

        const response = await api.post("/api/comments/reactions/like", data);
        return response.data as z.infer<typeof ReactionResponseSchema>;
    } catch (error) {
        console.error("Error liking comment:", error);
        return {
            message: "Error liking comment",
            status: "error",
            data: 0,
        };
    }
}

export const dislikeComment = async (data: z.infer<typeof postIdCommentIdObj>): Promise<z.infer<typeof ReactionResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }

        const response = await api.post("/api/comments/reactions/dislike", data);
        return response.data as z.infer<typeof ReactionResponseSchema>;
    } catch (error) {
        console.error("Error disliking comment:", error);
        return {
            message: "Error disliking comment",
            status: "error",
            data: 0,
        };
    }
}
export const removeLikeComment = async (data: z.infer<typeof postIdCommentIdObj>): Promise<z.infer<typeof ReactionResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }

        const response = await api.delete(`/api/comments/reactions/${data.postId}/${data.commentId}/like`);
        return response.data as z.infer<typeof ReactionResponseSchema>;
    } catch (error) {
        console.error("Error removing like from comment:", error);
        return {
            message: "Error removing like from comment",
            status: "error",
            data: 0,
        };
    }
}

export const removeDislikeComment = async (data: z.infer<typeof postIdCommentIdObj>): Promise<z.infer<typeof ReactionResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }

        const response = await api.delete(`/api/comments/reactions/${data.postId}/${data.commentId}/dislike`);
        return response.data as z.infer<typeof ReactionResponseSchema>;
    } catch (error) {
        console.error("Error removing dislike from comment:", error);
        return {
            message: "Error removing dislike from comment",
            status: "error",
            data: 0,
        };
    }
}

export const getLikedUsers = async (commentId: string): Promise<z.infer<typeof LikedAndDislikedUsersResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.get(`/api/comments/reactions/${commentId}/users/like`);
        return response.data as z.infer<typeof LikedAndDislikedUsersResponseSchema>;
    } catch (error) {
        console.error("Error fetching liked users:", error);
        return {
            message: "Error fetching liked users",
            status: "error",
            data: {
                users: [],
                totalPage: 0,
                currentPage: 1,
            },
        };
    }
};

export const getDislikedUsers = async (commentId: string): Promise<z.infer<typeof LikedAndDislikedUsersResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.get(`/api/comments/reactions/${commentId}/users/dislike`);
        return response.data as z.infer<typeof LikedAndDislikedUsersResponseSchema>;
    } catch (error) {
        console.error("Error fetching disliked users:", error);
        return {
            message: "Error fetching disliked users",
            status: "error",
            data: {
                users: [],
                totalPage: 0,
                currentPage: 1,
            },
        };
    }
};

