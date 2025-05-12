import { api } from "./api";
import { z } from "zod";
import { FollowerSuggestionsResponseSchema, FollowRelationResponseSchema,FollowersResponseSchema,FollowingsResponseSchema,MutualFollowerResponseSchema } from "@workspace/schema/api-response/follower";
import { isLoggedIn } from "./auth";


export const getFollowerSuggestions = async (page: number, limit: number): Promise<z.infer<typeof FollowerSuggestionsResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.get(`/api/followers/suggestions`, {
            params: {
                page,
                limit,
            },
        });
        return response.data as z.infer<typeof FollowerSuggestionsResponseSchema>;
    } catch (error) {
        console.error("Error fetching follower suggestions:", error);
        return {
            message: "Error fetching follower suggestions",
            status: "error",
            data: {
                suggestions: [],
                totalPage: 0,
                currentPage: 1,
            },
        };
    }
}

export const getFollower = async ({id, page, limit}: {id: string; page: number; limit: number}): Promise<z.infer<typeof FollowersResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.get(`/api/followers/${id}`, {
            params: {
                page,
                limit,
            },
        });
        return response.data as z.infer<typeof FollowersResponseSchema>;
    } catch (error) {
        console.error("Error fetching followers:", error);
        return {
            message: "Error fetching followers",
            status: "error",
            data: {
                followers: [],
                totalPage: 0,
                currentPage: 1,
            },
        };
    }
}

export const followUser = async (followingId: string): Promise<z.infer<typeof FollowRelationResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.post(`/api/followers/follow`, {
            followingId,
        });
        return response.data as z.infer<typeof FollowRelationResponseSchema>;
    } catch (error) {
        console.error("Error following user:", error);
        return {
            message: "Error following user",
            status: "error",
            data: {
                id: "",
                followerId: "",
                followingId: "",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        };
    }
}

export const getFollowings = async ({id, page, limit}: {id: string; page: number; limit: number}): Promise<z.infer<typeof FollowingsResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.get(`/api/followers/following/${id}`, {
            params: {
                page,
                limit,
            },
        });
        return response.data as z.infer<typeof FollowingsResponseSchema>;
    } catch (error) {
        console.error("Error fetching followings:", error);
        return {
            message: "Error fetching followings",
            status: "error",
            data: {
                following: [],
                totalPage: 0,
                currentPage: 1,
            },
        };
    }
}

export const unFollowUser = async (followingId: string): Promise<z.infer<typeof FollowRelationResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.delete(`/api/followers/unfollow/${followingId}`);
        return response.data as z.infer<typeof FollowRelationResponseSchema>;
    } catch (error) {
        console.error("Error unfollowing user:", error);
        return {
            message: "Error unfollowing user",
            status: "error",
            data: {
                id: "",
                followerId: "",
                followingId: "",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        };
    }
}

export const getMutualFollowers = async ({id, page, limit}: {id: string; page: number; limit: number}): Promise<z.infer<typeof MutualFollowerResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.get(`/api/followers/mutuals/${id}`, {
            params: {
                page,
                limit,
            },
        });
        return response.data as z.infer<typeof MutualFollowerResponseSchema>;
    } catch (error) {
        console.error("Error fetching mutual followers:", error);
        return {
            message: "Error fetching mutual followers",
            status: "error",
            data: {
                mutual: [],
                totalPage: 0,
                currentPage: 1,
            },
        };
    }
}