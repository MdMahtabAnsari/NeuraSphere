"use client";
import { useEffect, useState } from "react";
import { getFollower, getFollowings, getFollowerSuggestions, getMutualFollowers } from "@/lib/api/follower";
import { FollowerSuggestionList, FollowerList, FollowingList ,MutualFollowerList} from "../user";
import { FollowerSuggestionsDataSchema, FollowerDataSchema, FollowingDataSchema, MutualFollowerDataSchema } from "@workspace/schema/api-response/follower";


import { z } from "zod";


export const FollowerSuggestion = () => {
    const [suggestions, setSuggestions] = useState<z.infer<typeof FollowerSuggestionsDataSchema>>({
        suggestions: [],
        totalPage: 1,
        currentPage: 1,
    });

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        const response = await getFollowerSuggestions(suggestions.currentPage, 10);

        if (response.status === "success") {
            setSuggestions((prev) => ({
                ...prev,
                suggestions: [...prev.suggestions, ...response.data.suggestions],
                totalPage: response.data.totalPage,
                currentPage: response.data.currentPage + 1,
            }));

        };
    }
    return <FollowerSuggestionList users={suggestions} fetchUser={fetchSuggestions} />;
}

export const Follower = ({ id }: { id: string }) => {
    const [follower, setFollower] = useState<z.infer<typeof FollowerDataSchema>>({
        followers: [],
        totalPage: 1,
        currentPage: 1,
    });

    useEffect(() => {
        fetchFollower();
    }, []);

    const fetchFollower = async () => {
        const response = await getFollower({ id, page: follower.currentPage, limit: 10 });
        if (response.status === "success") {
            setFollower((prev) => ({
                ...prev,
                followers: [...prev.followers, ...response.data.followers],
                totalPage: response.data.totalPage,
                currentPage: response.data.currentPage + 1,
            }));
        }
    };

    return <FollowerList users={follower} fetchUser={fetchFollower} />;
};


export const Following = ({ id }: { id: string }) => {
    const [following, setFollowing] = useState<z.infer<typeof FollowingDataSchema>>({
        following: [],
        totalPage: 1,
        currentPage: 1,
    });

    useEffect(() => {
        fetchFollowing();
    }, []);

    const fetchFollowing = async () => {
        const response = await getFollowings({ id, page: following.currentPage, limit: 10 });
        if (response.status === "success") {
            setFollowing((prev) => ({
                ...prev,
                following: [...prev.following, ...response.data.following],
                totalPage: response.data.totalPage,
                currentPage: response.data.currentPage + 1,
            }));
        }
    };

    return <FollowingList users={following} fetchUser={fetchFollowing} />;
};


export const MutualFollower = ({ id }: { id: string }) => {
    const [mutualFollower, setMutualFollower] = useState<z.infer<typeof MutualFollowerDataSchema>>({
        mutual: [],
        totalPage: 1,
        currentPage: 1,
    });

    useEffect(() => {
        fetchMutualFollower();
    }, []);

    const fetchMutualFollower = async () => {
        const response = await getMutualFollowers({ id, page: mutualFollower.currentPage, limit: 10 });
        if (response.status === "success") {
            setMutualFollower((prev) => ({
                ...prev,
                mutual: [...prev.mutual, ...response.data.mutual],
                totalPage: response.data.totalPage,
                currentPage: response.data.currentPage + 1,
            }));
        }
    };

    return <MutualFollowerList users={mutualFollower} fetchUser={fetchMutualFollower} />;
};