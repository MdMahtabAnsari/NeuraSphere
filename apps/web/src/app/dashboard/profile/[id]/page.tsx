"use client"
import { useEffect, useState } from "react"
import { getProfile } from "@/lib/api/user";
import { ProfileCard } from "@/components/custom/user";
import { ProfileDataSchema } from "@workspace/schema/api-response/user";
import { z } from "zod";
import { ProfileCardSkeleton } from "@/components/custom/skeleton/user";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Friend, MutualFriend, BlockedFriend, FriendRequest,FriendSuggestion } from "@/components/custom/friend/friend";
import { Post } from "@/components/custom/post/post";
import {blockUser,unblockUser,acceptFriendRequest,rejectFriendRequest,removeRequest,removeFriend,createFriendRequest} from "@/lib/api/friend";
import { MutualFollower,FollowerSuggestion,Follower,Following } from "@/components/custom/follow/follow";



export default function Page() {
    const { id } = useParams()
    const [profile, setProfile] = useState<z.infer<typeof ProfileDataSchema> | null>(null);
    const [options, setOptions] = useState<"Friend" | "Follower" | "Following" | "Posts" | "Mutual Friends" | "Blocked Friends" | "Friend Requests"|"Friend Suggestions" |"Follower Suggestions" |"Mutual Followers">("Posts");

    const [loading, setLoading] = useState(true)
    const [userId, setUserId] = useState<string>("")
    useEffect(() => {
        if (id) {
            setUserId(id as string)
        }
        if (userId) {
            fetchProfile();
        }
    }, [userId])
    const fetchProfile = async () => {
        const data = await getProfile(userId);
        if (data.status === "success") {
            setProfile(data.data);
        } else {
            setProfile(null);
        }
        setLoading(false);
    }

    const handleBlockUser = async (id: string) => {
        const data = await blockUser(id);
        if (data.status === "success") {
            setProfile((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    friendStatus: {
                        senderBlocked: true,
                        accepted: prev.friendStatus?.accepted ?? false,
                        receiverBlocked: prev.friendStatus?.receiverBlocked ?? false,
                        senderPending: prev.friendStatus?.senderPending ?? false,
                        receiverPending: prev.friendStatus?.receiverPending ?? false,
                        rejected: prev.friendStatus?.rejected ?? false,
                    },
                };
            });
        }
    };

    const handleUnblockUser = async (id: string) => {
        const data = await unblockUser(id);
        if (data.status === "success") {
            setProfile((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    friendStatus: {
                        senderBlocked: false,
                        accepted: prev.friendStatus?.accepted ?? false,
                        receiverBlocked: prev.friendStatus?.receiverBlocked ?? false,
                        senderPending: prev.friendStatus?.senderPending ?? false,
                        receiverPending: prev.friendStatus?.receiverPending ?? false,
                        rejected: prev.friendStatus?.rejected ?? false,
                    },
                };
            });
        }
    };
    const handleAcceptFriendRequest = async (id: string) => {
        const data = await acceptFriendRequest(id);
        if (data.status === "success") {
            setProfile((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    friendStatus: {
                        senderBlocked: prev.friendStatus?.senderBlocked ?? false,
                        accepted: true,
                        receiverBlocked: prev.friendStatus?.receiverBlocked ?? false,
                        senderPending: false,
                        receiverPending: false,
                        rejected: prev.friendStatus?.rejected ?? false,
                    },
                };
            });
        }
    };

    const handleRejectFriendRequest = async (id: string) => {
        const data = await rejectFriendRequest(id);
        if (data.status === "success") {
            setProfile((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    friendStatus: {
                        senderBlocked: prev.friendStatus?.senderBlocked ?? false,
                        accepted: false,
                        receiverBlocked: prev.friendStatus?.receiverBlocked ?? false,
                        senderPending: false,
                        receiverPending: false,
                        rejected: true,
                    },
                };
            });
        }
    };

    const handleRemoveRequest = async (id: string) => {
        const data = await removeRequest(id);
        if (data.status === "success") {
            setProfile((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    friendStatus: {
                        senderBlocked: prev.friendStatus?.senderBlocked ?? false,
                        accepted: false,
                        receiverBlocked: prev.friendStatus?.receiverBlocked ?? false,
                        senderPending: false,
                        receiverPending: false,
                        rejected: false,
                    },
                };
            });
        }
    };

    const handleRemoveFriend = async (id: string) => {
        const data = await removeFriend(id);
        if (data.status === "success") {
            setProfile((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    friendStatus: {
                        senderBlocked: prev.friendStatus?.senderBlocked ?? false,
                        accepted: false,
                        receiverBlocked: prev.friendStatus?.receiverBlocked ?? false,
                        senderPending: false,
                        receiverPending: false,
                        rejected: false,
                    },
                };
            });
        }
    };

    const handleFriendRequest = async (id: string) => {
        const data = await createFriendRequest(id);
        if (data.status === "success") {
            setProfile((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    friendStatus: {
                        senderBlocked: prev.friendStatus?.senderBlocked ?? false,
                        accepted: false,
                        receiverBlocked: prev.friendStatus?.receiverBlocked ?? false,
                        senderPending: true,
                        receiverPending: false,
                        rejected: false,
                    },
                };
            });
        }
    };


    return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-4 my-10">
            {loading ? (
                <ProfileCardSkeleton />
            ) : profile ? (
                <>
                    <ProfileCard user={profile} handleBlockUser={handleBlockUser} handleUnblockUser={handleUnblockUser} handleAcceptFriendRequest={handleAcceptFriendRequest} handleRejectFriendRequest={handleRejectFriendRequest} handleRemoveRequest={handleRemoveRequest} handleFriendRequest={handleFriendRequest} handleRemoveFriend={handleRemoveFriend} />
                    <Separator className="w-full" />
                    {
                        profile.isUserProfile ? (
                            <div className="flex flex-wrap items-center justify-center w-full gap-2">
                                <Button variant={options === "Posts" ? "default" : "outline"} className="cursor-pointer" onClick={() => setOptions("Posts")}>Posts</Button>
                                <Button variant={options === "Friend" ? "default" : "outline"} className="cursor-pointer" onClick={() => setOptions("Friend")}>Friends</Button>
                                <Button variant={options === "Follower" ? "default" : "outline"} className="cursor-pointer" onClick={() => setOptions("Follower")}>Followers</Button>
                                <Button variant={options === "Following" ? "default" : "outline"} className="cursor-pointer" onClick={() => setOptions("Following")}>Following</Button>
                                <Button variant={options === "Blocked Friends" ? "default" : "outline"} className="cursor-pointer" onClick={() => setOptions("Blocked Friends")}>Blocked Friends</Button>
                                <Button variant={options === "Friend Requests" ? "default" : "outline"} className="cursor-pointer" onClick={() => setOptions("Friend Requests")}>Friend Requests</Button>
                                <Button variant={options === "Friend Suggestions" ? "default" : "outline"} className="cursor-pointer" onClick={() => setOptions("Friend Suggestions")}>Friend Suggestions</Button>
                                <Button variant={options === "Follower Suggestions" ? "default" : "outline"} className="cursor-pointer" onClick={() => setOptions("Follower Suggestions")}>Follower Suggestions</Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-full gap-2">
                                <Button variant={options === "Posts" ? "default" : "outline"} className="cursor-pointer" onClick={() => setOptions("Posts")}>Posts</Button>
                                <Button variant={options === "Friend" ? "default" : "outline"} className="cursor-pointer" onClick={() => setOptions("Friend")}>Friends</Button>
                                <Button variant={options === "Mutual Friends" ? "default" : "outline"} className="cursor-pointer" onClick={() => setOptions("Mutual Friends")}>Mutual Friends</Button>
                                <Button variant={options === "Follower" ? "default" : "outline"} className="cursor-pointer" onClick={() => setOptions("Follower")}>Followers</Button>
                                <Button variant={options === "Following" ? "default" : "outline"} className="cursor-pointer" onClick={() => setOptions("Following")}>Following</Button>
                                <Button variant={options === "Mutual Followers" ? "default" : "outline"} className="cursor-pointer" onClick={() => setOptions("Mutual Followers")}>Mutual Followers</Button>
                            </div>
                        )
                    }
                    <Separator className="w-full" />
                    {options === "Posts" ? (
                                            <Post id={profile.profile.id} />
                                        ) : options === "Friend" ? (
                                            <Friend friendId={profile.profile.id} />
                                        ) : options === "Follower" ? (
                                            <Follower id={profile.profile.id} />
                                        ) : options === "Following" ? (
                                            <Following id={profile.profile.id} />
                                        ) : options === "Mutual Friends" ? (
                                            <MutualFriend friendId={profile.profile.id} />
                                        ) : options === "Blocked Friends" ? (
                                            <BlockedFriend />
                                        ) : options === "Friend Requests" ? (
                                            <FriendRequest />
                                        ) : options === "Follower Suggestions" ? (
                                            <FollowerSuggestion />
                                        ) : options === "Mutual Followers" ? (
                                            <MutualFollower id={profile.profile.id} />
                                        ) : options === "Friend Suggestions" ? (
                                            <FriendSuggestion />
                                        ) : options === "Follower Suggestions" ? (
                                                <FollowerSuggestion />
                                        ) : options === "Mutual Followers" ? (
                                                <MutualFollower id={profile.profile.id} />
                                        ) : (null)
                                        }
                </>
            ) : (
                <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                    <h1 className="text-2xl font-bold">No Profile Found</h1>
                </div>
            )}
        </div>
    )
}
