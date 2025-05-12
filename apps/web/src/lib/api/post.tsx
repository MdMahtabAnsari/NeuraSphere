import { api } from "./api";
import { isLoggedIn } from "./auth";
import { AxiosError } from "axios";
import { z } from "zod";
import {DeletePostResponseSchema, PostResponseSchema,PostByIdResponseSchema,ViewPostResponseSchema} from "@workspace/schema/api-response/post";
import {createPost as createPostSchema,updatePost as updatePostSchema} from "@workspace/schema/post";
import {CommentSuggestionResponseSchema} from "@workspace/schema/api-response/comment";

export const postSuggestion = async ({page,limit}:{page:number; limit:number}):Promise<z.infer<typeof PostResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }

        const response = await api.get("/api/posts/suggestions", { params: { page, limit } });
        return response.data as z.infer<typeof PostResponseSchema>;
    } catch (error) {
        console.error("Error posting suggestion:", error);
        return{
            message: "Error posting suggestion",
            status: "error",
            data: {
                posts: [],
                totalPage: 0,
                currentPage: 1,
            },
        }
    }
};

export const viralPosts = async ({page,limit}:{page:number; limit:number}):Promise<z.infer<typeof PostResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }

        const response = await api.get("/api/posts/viral", { params: { page, limit } });
        return response.data as z.infer<typeof PostResponseSchema>;
    } catch (error) {
        console.error("Error fetching viral posts:", error);
        return {
            message: "Error fetching viral posts",
            status: "error",
            data: {
                posts: [],
                totalPage: 0,
                currentPage: 1,
            },
        };
    }
};


export const getOtherUserPosts = async ({ id, page, limit }: { id: string; page: number; limit: number }):Promise<z.infer<typeof PostResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }

        const response = await api.get(`/api/posts/other/${id}`, { params: { page, limit } });
        return response.data as z.infer<typeof PostResponseSchema>;
    } catch (error) {
        console.error("Error fetching other user posts:", error);
        return {
            message: "Error fetching other user posts",
            status: "error",
            data: {
                posts: [],
                totalPage: 0,
                currentPage: 1,
            },
        };
    }
};

export const getPostByTag = async ({ tags, page, limit }: { tags: string[]; page: number; limit: number }):Promise<z.infer<typeof PostResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }

        const response = await api.get("/api/posts/search/tags", { params: { tags, page, limit } });
        return response.data as z.infer<typeof PostResponseSchema>;
    } catch (error) {
        console.error("Error fetching posts by tag:", error);
        return {
            message: "Error fetching posts by tag",
            status: "error",
            data: {
                posts: [],
                totalPage: 0,
                currentPage: 1,
            },
        };
    }
};

export const getUserPosts = async ({ page, limit }: {page:number,limit:number}):Promise<z.infer<typeof PostResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }

        const response = await api.get("/api/posts/me", { params: { page, limit } });
        return response.data as z.infer<typeof PostResponseSchema>;
    } catch (error) {
        console.error("Error fetching user posts:", error);
        return {
            message: "Error fetching user posts",
            status: "error",
            data: {
                posts: [],
                totalPage: 0,
                currentPage: 1,
            },
        };
    }
};

export const getPostByUsernamesAndUseridAndNameAndMobileAndEmail = async ({ identifier,page, limit }: { identifier:string,page:number,limit:number }):Promise<z.infer<typeof PostResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }

        const response = await api.get("/api/posts/search", { params: { identifier, page, limit } });
        return response.data as z.infer<typeof PostResponseSchema>;
    } catch (error) {
        console.error("Error fetching posts by usernames and other filters:", error);
        return {
            message: "Error fetching posts by usernames and other filters",
            status: "error",
            data: {
                posts: [],
                totalPage: 0,
                currentPage: 1,
            },
        };
    }
};

export const createPost = async (data: z.infer<typeof createPostSchema>) => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }

        const response = await api.post("/api/posts/create", data);
        return response.data;
    } catch (error) {
        console.error("Error creating post:", error);
        if (error instanceof AxiosError) {
            return error.response;
        }
        return error;
    }
};

export const updatePost = async (data: z.infer<typeof updatePostSchema>) => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }

        const response = await api.put("/api/posts/update", data);
        return response.data;
    } catch (error) {
        console.error("Error updating post:", error);
        if (error instanceof AxiosError) {
            return error.response;
        }
        return error;
    }
};

export const deletePost = async (id: string): Promise<z.infer<typeof DeletePostResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }

        const response = await api.delete(`/api/posts/delete/${id}`);
        return response.data as z.infer<typeof DeletePostResponseSchema>;
    } catch (error) {
        console.error("Error deleting post:", error);
        return {
            message: "Error deleting post",
            status: "error",
        }
    }
};


export const getPostById = async (id: string):Promise<z.infer<typeof PostByIdResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }

        const response = await api.get(`/api/posts/${id}`);
        return response.data as z.infer<typeof PostByIdResponseSchema>;
    } catch (error) {
        console.error("Error fetching post by ID:", error);
        return {
            message: "Error fetching post by ID",
            status: "error",
            data: {
                id: "",
                content: "",
                media: [],
                user: {
                    id: "",
                    image: "",
                    username: "",
                    name: "",
                },
                tags: [],
                createdAt: "",
                updatedAt: "",
                isUserPost: false,
                isEdited: false,
                reactions: {
                    likeCount: 0,
                    dislikeCount: 0,
                },
                reactionStatus: {
                    like: false,
                    dislike: false,
                },
                comments: 0,
                views: 0
            },
        }
    }
}

export const createView = async (postId: string):Promise<z.infer<typeof ViewPostResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.post(`/api/views`, { postId });
        return response.data as z.infer<typeof ViewPostResponseSchema>;
    } catch (error) {
        console.error("Error creating view:", error);
        return {
            message: "Error creating view",
            status: "error",
            data: 0,
        };
    }
};

export const getAiSuggestion = async (content:string):Promise<z.infer<typeof CommentSuggestionResponseSchema>> => {
    try {
        const response = await api.post(`api/posts/ai/suggestion`, { content });
        return response.data as z.infer<typeof CommentSuggestionResponseSchema>;
    } catch (error) {
        console.error("Error fetching AI suggestion:", error);
        return {
            message: "Error fetching AI suggestion",
            status: "error",
            data: {
                content: "",
            },
        };
    }
};