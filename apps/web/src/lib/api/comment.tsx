import { api } from "./api";
import { isLoggedIn } from "./auth";

import { z } from "zod";

import { CommentResponseSchema,CreateCommentResponseSchema,CommentSuggestionResponseSchema,DeleteCommentResponseSchema } from "@workspace/schema/api-response/comment";
import {comment,commentSuggestion as commentSuggestionSchema,updateComment as updateCommentSchema} from "@workspace/schema/comment"

export const getComments = async ({ postId, commentId, page, limit }: { postId: string; commentId: string|null; page: number; limit: number }): Promise<z.infer<typeof CommentResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }

        const response = await api.get("/api/comments/get", { params: { postId, commentId, page, limit } });
        return response.data as z.infer<typeof CommentResponseSchema>;
    } catch (error) {
        console.error("Error fetching comments:", error);
        return {
            message: "Error fetching comments",
            status: "error",
            data: {
                comments: [],
                totalPage: 0,
                currentPage: 1,
            },
        };
    }
}

export const createComment =  async (data: z.infer<typeof comment>) :Promise<z.infer<typeof CreateCommentResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }

        const response = await api.post("/api/comments/create", data);
        return response.data as z.infer<typeof CreateCommentResponseSchema>;
    } catch (error) {
        console.error("Error creating comment:", error);
        return {
            message: "Error creating comment",
            status: "error",
            data: {
                id: "",
                postId: "",
                parentId: null,
                content: "",
                userId: "",
                user: {
                    id: "",
                    name: "",
                    image: "",
                },
                isEdited: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        };
    }
}

export const commentSuggestion = async (data: z.infer<typeof commentSuggestionSchema>) :Promise<z.infer<typeof CommentSuggestionResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.post("/api/comments/ai/suggestion", data);
        return response.data as z.infer<typeof CommentSuggestionResponseSchema>;
    } catch (error) {
        console.error("Error fetching comment suggestions:", error);
        return {
            message: "Error fetching comment suggestions",
            status: "error",
            data: {
                content: "",
            },
        };
    }
};

export const updateComment = async (data: z.infer<typeof updateCommentSchema>) :Promise<z.infer<typeof CreateCommentResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }

        const response = await api.put("/api/comments/update", data);
        return response.data as z.infer<typeof CreateCommentResponseSchema>;
    } catch (error) {
        console.error("Error updating comment:", error);
        return {
            message: "Error updating comment",
            status: "error",
            data: {
                id: "",
                postId: "",
                parentId: null,
                content: "",
                userId: "",
                user: {
                    id: "",
                    name: "",
                    image: "",
                },
                isEdited: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        };
    }
}

export const deleteComment = async (commentId: string) :Promise<z.infer<typeof DeleteCommentResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }

        const response = await api.delete(`/api/comments/delete/${commentId}`);
        return response.data as z.infer<typeof DeleteCommentResponseSchema>;
    } catch (error) {
        console.error("Error deleting comment:", error);
        return {
            message: "Error deleting comment",
            status: "error",
        };
    }
}