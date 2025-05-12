"use client";
import { useEffect, useState } from "react";
import { getFriends, getBlockedFriends, getFriendRequests, getMutualFriends, getFriendSuggestions } from "@/lib/api/friend";
import { FriendList, BlockedUserList, FriendRequestList, MutualFriendList, FriendSuggestionList } from "../user";
import { FriendsDataSchema, BlockedFriendsDataSchema, FriendRequestDataSchema, MutualFriendsDataSchema, SuggestionsDataSchema } from "@workspace/schema/api-response/friend";
import { z } from "zod";


export const Friend = ({ friendId }: { friendId: string }) => {
    const [friend, setFriend] = useState<z.infer<typeof FriendsDataSchema>>({
        friends: [],
        totalPages: 1,
        currentPage: 1,
    });

    useEffect(() => {

        fetchFriends();

    }, []);

    const fetchFriends = async () => {
        const response = await getFriends({ id: friendId, page: friend.currentPage, limit: 10 });
        if (response.status === "success") {
            setFriend((prev) => ({
                ...prev,
                friends: [...prev.friends, ...response.data.friends],
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage + 1,
            }));
        }
    };

    return (
        <FriendList
            users={friend}
            fetchUser={fetchFriends}
        />
    );
};

export const BlockedFriend = () => {
    const [blockedFriend, setBlockedFriend] = useState<z.infer<typeof BlockedFriendsDataSchema>>({
        blocked: [],
        totalPages: 1,
        currentPage: 1,
    });

    useEffect(() => {
        fetchBlockedFriends();

    }, []);

    const fetchBlockedFriends = async () => {
        const response = await getBlockedFriends(blockedFriend.currentPage, 10);
        if (response.status === "success") {
            setBlockedFriend((prev) => ({
                ...prev,
                blocked: [...prev.blocked, ...response.data.blocked],
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage + 1,
            }));
        }
    };

    return (
        <BlockedUserList
            users={blockedFriend}
            fetchUser={fetchBlockedFriends}
        />
    );
};

export const FriendRequest = () => {
    const [friendRequest, setFriendRequest] = useState<z.infer<typeof FriendRequestDataSchema>>({
        requests: [],
        totalPages: 1,
        currentPage: 1,
    });

    useEffect(() => {
        fetchFriendRequests();
    }, []);

    const fetchFriendRequests = async () => {
        const response = await getFriendRequests(friendRequest.currentPage, 10);
        if (response.status === "success") {
            setFriendRequest((prev) => ({
                ...prev,
                requests: [...prev.requests, ...response.data.requests],
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage + 1,
            }));
        }
    };
    return (
        <FriendRequestList
            users={friendRequest}
            fetchUser={fetchFriendRequests}
        />
    );
}
export const MutualFriend = ({ friendId }: { friendId: string }) => {
    const [mutualFriend, setMutualFriend] = useState<z.infer<typeof MutualFriendsDataSchema>>({
        mutual: [],
        totalPages: 1,
        currentPage: 1,
    });

    useEffect(() => {

        fetchMutualFriends();

    }, []);

    const fetchMutualFriends = async () => {
        const response = await getMutualFriends({ id: friendId, page: mutualFriend.currentPage, limit: 10 });
        if (response.status === "success") {
            setMutualFriend((prev) => ({
                ...prev,
                mutual: [...prev.mutual, ...response.data.mutual],
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage + 1,
            }));
        }
    };

    return (
        <MutualFriendList
            users={mutualFriend}
            fetchUser={fetchMutualFriends}
        />
    );
};

export const FriendSuggestion = () => {
    const [friendSuggestion, setFriendSuggestion] = useState<z.infer<typeof SuggestionsDataSchema>>({
        suggestions: [],
        totalPages: 1,
        currentPage: 1,
    });

    useEffect(() => {
        fetchFriendSuggestions();
    }, []);

    const fetchFriendSuggestions = async () => {
        const response = await getFriendSuggestions(friendSuggestion.currentPage, 10);
        if (response.status === "success") {
            setFriendSuggestion((prev) => ({
                ...prev,
                suggestions: [...prev.suggestions, ...response.data.suggestions],
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage + 1,
            }));
        }
    };

    return (
        <FriendSuggestionList
            users={friendSuggestion}
            fetchUser={fetchFriendSuggestions}
        />
    );
};





