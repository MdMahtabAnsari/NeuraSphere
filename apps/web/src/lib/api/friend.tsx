import { api } from "./api";
import { z } from "zod";
import { FriendStatusResponseSchema,FriendRequestsResponseSchema,FriendSuggestionsResponseSchema,BlockedFriendsResponseSchema,FriendsResponseSchema,MutualFriendsResponseSchema } from "@workspace/schema/api-response/friend";
import { isLoggedIn } from "./auth";

export const blockUser = async (friendId: string): Promise<z.infer<typeof FriendStatusResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.post("/api/friends/block", {
            friendId,
        });
        const data = FriendStatusResponseSchema.parse(response.data);
        return data;
    } catch (error) {
        console.error("Error blocking user:", error);
        return {
            message: "Error blocking user",
            status: "error",
            data: {
                id: "",
                senderId: "",
                receiverId: "",
                status: "Blocked",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        };
    }
}

export const unblockUser = async (friendId: string): Promise<z.infer<typeof FriendStatusResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.post("/api/friends/unblock", {
            friendId,
        });
        const data = FriendStatusResponseSchema.parse(response.data);
        return data;
    } catch (error) {
        console.error("Error unblocking user:", error);
        return {
            message: "Error unblocking user",
            status: "error",
            data: {
               id: "",
                senderId: "",
                receiverId: "",
                status: "Blocked",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        };
    }
}

export const createFriendRequest = async (friendId: string): Promise<z.infer<typeof FriendStatusResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.post("/api/friends/request", {
            friendId,
        });
        const data = FriendStatusResponseSchema.parse(response.data);
        return data;
    } catch (error) {
        console.error("Error creating friend request:", error);
        return {
            message: "Error creating friend request",
            status: "error",
            data: {
                id: "",
                senderId: "",
                receiverId: "",
                status: "Pending",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        };
    }
}

export const removeRequest = async (friendId: string): Promise<z.infer<typeof FriendStatusResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.post("/api/friends/remove-request", {
            friendId,
        });
        const data = FriendStatusResponseSchema.parse(response.data);
        return data;
    } catch (error) {
        console.error("Error removing friend request:", error);
        return {
            message: "Error removing friend request",
            status: "error",
            data: {
                id: "",
                senderId: "",
                receiverId: "",
                status: "Pending",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        };
    }
}

export const removeFriend = async (friendId: string): Promise<z.infer<typeof FriendStatusResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.post(`/api/friends/remove-friend`, {
            friendId,
        });
        const data = FriendStatusResponseSchema.parse(response.data);
        return data;
    } catch (error) {
        console.error("Error removing friend:", error);
        return {
            message: "Error removing friend",
            status: "error",
            data: {
                id: "",
                senderId: "",
                receiverId: "",
                status: "Pending",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        };
    }
}

export const acceptFriendRequest = async (friendId: string): Promise<z.infer<typeof FriendStatusResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.post("/api/friends/accept", {
            friendId,
        });
        const data = FriendStatusResponseSchema.parse(response.data);
        return data;
    } catch (error) {
        console.error("Error accepting friend request:", error);
        return {
            message: "Error accepting friend request",
            status: "error",
            data: {
                id: "",
                senderId: "",
                receiverId: "",
                status: "Pending",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        };
    }
}

export const getFriendRequests = async (page: number, limit: number): Promise<z.infer<typeof FriendRequestsResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.get("/api/friends/requests", {
            params: {
                page,
                limit,
            },
        });
        const data = FriendRequestsResponseSchema.parse(response.data);
        return data;
    } catch (error) {
        console.error("Error getting friend requests:", error);
        return {
            message: "Error getting friend requests",
            status: "error",
            data: {
                requests: [],
                totalPages: 0,
                currentPage: 1,
            },
        };
    }
}

export const rejectFriendRequest = async (friendId: string): Promise<z.infer<typeof FriendStatusResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.post("/api/friends/reject", {
            friendId,
        });
        const data = FriendStatusResponseSchema.parse(response.data);
        return data;
    } catch (error) {
        console.error("Error rejecting friend request:", error);
        return {
            message: "Error rejecting friend request",
            status: "error",
            data: {
                id: "",
                senderId: "",
                receiverId: "",
                status: "Pending",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        };
    }
}

export const getFriendSuggestions = async (page: number, limit: number): Promise<z.infer<typeof FriendSuggestionsResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.get("/api/friends/suggestions", {
            params: {
                page,
                limit,
            },
        });
        const data = FriendSuggestionsResponseSchema.parse(response.data);
        return data;
    } catch (error) {
        console.error("Error getting friend suggestions:", error);
        return {
            message: "Error getting friend suggestions",
            status: "error",
            data: {
                suggestions: [],
                totalPages: 0,
                currentPage: 1,
            },
        };
    }
}

export const getBlockedFriends = async (page: number, limit: number): Promise<z.infer<typeof BlockedFriendsResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.get("/api/friends/blocked", {
            params: {
                page,
                limit,
            },
        });
        const data = BlockedFriendsResponseSchema.parse(response.data);
        return data;
    } catch (error) {
        console.error("Error getting blocked friends:", error);
        return {
            message: "Error getting blocked friends",
            status: "error",
            data: {
                blocked: [],
                totalPages: 0,
                currentPage: 1,
            },
        };
    }
}

export const getFriends = async ({ id, page, limit }: { id: string; page: number; limit: number }): Promise<z.infer<typeof FriendsResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.get(`/api/friends/${id}`, {
            params: {
                page,
                limit,
            },
        });
        const data = FriendsResponseSchema.parse(response.data);
        return data;
    } catch (error) {
        console.error("Error getting friends:", error);
        return {
            message: "Error getting friends",
            status: "error",
            data: {
                friends: [],
                totalPages: 0,
                currentPage: 1,
            },
        };
    }
}


export const getMutualFriends = async ({ id, page, limit }: { id: string; page: number; limit: number }): Promise<z.infer<typeof MutualFriendsResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }
        const response = await api.get(`/api/friends/mutual/${id}`, {
            params: {
                page,
                limit,
            },
        });
        const data = MutualFriendsResponseSchema.parse(response.data);
        return data;
    } catch (error) {
        console.error("Error getting mutual friends:", error);
        return {
            message: "Error getting mutual friends",
            status: "error",
            data: {
                mutual: [],
                totalPages: 0,
                currentPage: 1,
            },
        };
    }
}