"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    UserSchema,
    UserDataSchema,
    ProfileDataSchema,
} from "@workspace/schema/api-response/user";
import { z } from "zod";
import InfiniteScroll from "react-infinite-scroll-component";
import { UserSkeleton } from "./skeleton/user";
import { format, parseISO } from "date-fns"
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";
import { LikedAndDislikedUserDataSchema, LikedAndDislikedUserSchema } from "@workspace/schema/api-response/comment-reaction";
import { LikeAndDislikeDataSchema,LikeAndDislikeUserSchema } from "@workspace/schema/api-response/post-reaction";
import { useRouter } from "next/navigation";
import { UserSchema as FriendSchema, FriendRequestDataSchema,SuggestionsDataSchema,BlockedFriendsDataSchema,FriendsDataSchema,MutualFriendsDataSchema } from '@workspace/schema/api-response/friend';
import { FollowerSuggestionsDataSchema, MutualFollowerDataSchema, FollowingDataSchema, FollowerDataSchema, UserSchema as FollowUser} from '@workspace/schema/api-response/follower';


export function UserCard({ user }: { user: z.infer<typeof UserSchema> }) {
    const router = useRouter();
    return (
        <Card className="w-full">
            <CardContent className="flex items-center justify-start gap-4 cursor-pointer" onClick={() => router.push(`/dashboard/profile/${user.id}`)}>
                <Avatar>
                    <AvatarImage src={user.image} alt="User Avatar" />
                    {/* Fallback for when the image is not available */}
                    <AvatarFallback className="bg-gray-200 text-gray-500">
                        {user.name}
                    </AvatarFallback>

                    <AvatarFallback>{user.name}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <CardTitle>{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                </div>
            </CardContent>
        </Card>
    );
}

export function UserList({
    users,
    fetchUser,
}: {
    users: z.infer<typeof UserDataSchema>
    fetchUser: () => void;
}) {
    return (
        <div className="flex flex-col justify-start items-center gap-4 w-full h-full">
            <InfiniteScroll
                dataLength={users.users.length} // This is important field to render the next data
                next={fetchUser}
                hasMore={users.currentPage <= users.totalPage}
                loader={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <UserSkeleton />
                        <UserSkeleton />
                        <UserSkeleton />
                        <UserSkeleton />
                    </div>
                }
                endMessage={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <h1 className="text-2xl font-bold">No more users</h1>
                    </div>
                }
                className="flex flex-col items-center justify-center w-full h-full gap-2"
            >
                {users.users.map((user) => (
                    <UserCard key={user.id} user={user} />
                ))}
            </InfiniteScroll>
        </div>
    );
}

export const ProfileCard = ({ user, handleBlockUser, handleUnblockUser, handleAcceptFriendRequest, handleRejectFriendRequest, handleRemoveRequest, handleFriendRequest, handleRemoveFriend }: { user: z.infer<typeof ProfileDataSchema>, handleBlockUser: (id: string) => void, handleUnblockUser: (id: string) => void , handleAcceptFriendRequest: (id: string) => void, handleRejectFriendRequest: (id: string) => void, handleRemoveRequest: (id: string) => void, handleFriendRequest: (id: string) => void ,handleRemoveFriend: (id: string) => void }) => {
    const { profile, followersCount, followingCount, friendsCount, isFollowing, friendStatus, postCount } = user
    return (
        <Card className="w-full sm:w-11/12 h-fit shadow-lg border">
            <CardContent className="flex flex-col sm:flex-row justify-center items-center text-center sm:gap-8 gap-4 p-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center">
                    <Avatar className="w-28 h-28 mb-4 shadow-md">
                        <AvatarImage src={profile.image ? profile.image : ""} alt="User Avatar" />
                        <AvatarFallback className="text-xl font-bold">
                            {profile.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* Profile Details Section */}
                <div className="flex flex-col justify-center items-center w-full">
                    <CardTitle className="text-3xl font-extrabold">{profile.name}</CardTitle>
                    <CardDescription className="text-lg">@{profile.username}</CardDescription>
                    <CardDescription >{profile.email}</CardDescription>
                    <CardDescription >{profile.mobile}</CardDescription>

                    <Separator className="my-6 w-full border-gray-300" />

                    {/* Stats Section */}
                    <div className="flex gap-8 mt-4">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold">{followersCount}</span>
                            <span >Followers</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold">{followingCount}</span>
                            <span >Following</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold">{friendsCount}</span>
                            <span >Friends</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold">{postCount}</span>
                            <span >Posts</span>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="flex flex-col items-start mt-6 text-left w-full">
                        <p className=" text-base">{profile.bio}</p>
                        <p className=" text-sm mt-2">
                            <strong>Date of Birth:</strong> {format(parseISO(profile.dob), "MMMM do, yyyy")}
                        </p>
                    </div>
                    {/* Action Section */}
                    <div className="flex gap-4 mt-6">
                        {
                            typeof isFollowing === "boolean" && (
                                <Button variant="outline" size="lg" onClick={() => { }}>
                                    {isFollowing ? "Unfollow" : "Follow"}
                                </Button>
                            )
                        }
                        {
                            friendStatus && !user.isUserProfile && (
                                <>
                                    {
                                        friendStatus.accepted ? (
                                            <Button variant="outline" size="lg" className="cursor-pointer" onClick={() => handleRemoveFriend(user.profile.id)}>
                                                Unfriend
                                            </Button>
                                        ) : friendStatus.senderBlocked ? (
                                            <Button variant="outline" size="lg" className="cursor-pointer" onClick={() => handleUnblockUser(user.profile.id)}>
                                                UnBlock
                                            </Button>
                                        ) : friendStatus.receiverBlocked ? (
                                            <Button variant="outline" size="lg" className="cursor-pointer" onClick={() => handleBlockUser(user.profile.id)}>
                                                Block
                                            </Button>
                                        ) : friendStatus.receiverPending ? (
                                            <div className="flex gap-4 border-emerald-400">
                                                <Button variant="outline" size="lg" className="cursor-pointer" onClick={() => handleAcceptFriendRequest(user.profile.id)}>
                                                    Accept
                                                </Button>
                                                <Button variant="destructive" size="lg" className="cursor-pointer" onClick={() => handleRejectFriendRequest(user.profile.id)}>
                                                    Reject
                                                </Button>
                                            </div>
                                        ) : friendStatus.senderPending ? (
                                            <Button variant="destructive" size="lg" className="cursor-pointer" onClick={() => handleRemoveRequest(user.profile.id)}>
                                                Cancel
                                            </Button>
                                        ) : (
                                            <div className="flex gap-4 border-emerald-400">
                                                <Button variant="outline" size="lg" className="cursor-pointer" onClick={() => handleFriendRequest(user.profile.id)}>
                                                    Add Friend
                                                </Button>
                                                <Button variant="destructive" size="lg" className="cursor-pointer" onClick={() => handleBlockUser(user.profile.id)}>
                                                    Block
                                                </Button>
                                            </div>
                                        )
                                    }

                                </>
                            )
                        }
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


export function UserCardForLikedAndDislikedUserComment({ user }: { user: z.infer<typeof LikedAndDislikedUserSchema> }) {
    const router = useRouter();
    return (
        <Card className="w-full">
            <CardContent className="flex items-center justify-start gap-4 cursor-pointer" onClick={() => router.push(`/dashboard/profile/${user.user.id}`)}>
                <Avatar>
                    <AvatarImage src={user.user.image} alt="User Avatar" />
                    {/* Fallback for when the image is not available */}
                    <AvatarFallback className="bg-gray-200 text-gray-500">
                        {user.user.name}
                    </AvatarFallback>

                    <AvatarFallback>{user.user.name}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <CardTitle>{user.user.name}</CardTitle>
                </div>
            </CardContent>
        </Card>
    );
}

export function LikedAndDislikedUserListForComment({
    users,
    fetchUser,
}: {
    users: z.infer<typeof LikedAndDislikedUserDataSchema>
    fetchUser: () => void;
}) {
    return (
        <div className="flex flex-col justify-start items-center gap-4 w-full h-full">
            <InfiniteScroll
                dataLength={users.users.length} // This is important field to render the next data
                next={fetchUser}
                hasMore={users.currentPage <= users.totalPage}
                loader={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <UserSkeleton />
                    </div>
                }
                endMessage={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <h1 className="text-2xl font-bold">No more users</h1>
                    </div>
                }
                className="flex flex-col items-center justify-center w-full h-full gap-2"
            >
                {users.users.map((user) => (
                    <UserCardForLikedAndDislikedUserComment key={user.id} user={user} />
                ))}
            </InfiniteScroll>
        </div>
    );
}


export function UserCardForLikedAndDislikedUserPost({ user }: { user: z.infer<typeof LikeAndDislikeUserSchema> }) {
    const router = useRouter();
    return (
        <Card className="w-full">
            <CardContent className="flex items-center justify-start gap-4 cursor-pointer" onClick={() => router.push(`/dashboard/profile/${user.user.id}`)}>
                <Avatar>
                    <AvatarImage src={user.user.image} alt="User Avatar" />
                    {/* Fallback for when the image is not available */}
                    <AvatarFallback className="bg-gray-200 text-gray-500">
                        {user.user.name}
                    </AvatarFallback>

                    <AvatarFallback>{user.user.name}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <CardTitle>{user.user.name}</CardTitle>
                </div>
            </CardContent>
        </Card>
    );
}

export function LikedAndDislikedUserListForPost({
    users,
    fetchUser,
}: {
    users: z.infer<typeof LikeAndDislikeDataSchema>
    fetchUser: () => void;
}) {
    return (
        <div className="flex flex-col justify-start items-center gap-4 w-full h-96">
            <InfiniteScroll
                dataLength={users.users.length} // This is important field to render the next data
                next={fetchUser}
                hasMore={users.currentPage <= users.totalPage}
                loader={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <UserSkeleton />
                    </div>
                }
                endMessage={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <h1 className="text-2xl font-bold">No more users</h1>
                    </div>
                }
                className="flex flex-col items-center justify-center w-full h-full gap-2"
            >
                {users.users.map((user) => (
                    <UserCardForLikedAndDislikedUserPost key={user.id} user={user} />
                ))}
            </InfiniteScroll>
        </div>
    );
}


export function FriendCard({ user }: { user: z.infer<typeof FriendSchema> }) {
    const router = useRouter();
    return (
        <Card className="w-full">
            <CardContent className="flex items-center justify-start gap-4 cursor-pointer" onClick={() => router.push(`/dashboard/profile/${user.id}`)}>
                <Avatar>
                    <AvatarImage src={user.image ? user.image : ""} alt="User Avatar" />
                    {/* Fallback for when the image is not available */}
                    <AvatarFallback className="bg-gray-200 text-gray-500">
                        {user.name}
                    </AvatarFallback>

                    <AvatarFallback>{user.name}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <CardTitle>{user.name}</CardTitle>
                </div>
            </CardContent>
        </Card>
    );
}

export const FollowerCard = ({ user }: { user: z.infer<typeof FollowUser> }) => {
    const router = useRouter();
    return (
        <Card className="w-full">
            <CardContent className="flex items-center justify-start gap-4 cursor-pointer" onClick={() => router.push(`/dashboard/profile/${user.id}`)}>
                <Avatar>
                    <AvatarImage src={user.image ? user.image : ""} alt="User Avatar" />
                    {/* Fallback for when the image is not available */}
                    <AvatarFallback className="bg-gray-200 text-gray-500">
                        {user.name}
                    </AvatarFallback>

                    <AvatarFallback>{user.name}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <CardTitle>{user.name}</CardTitle>
                </div>
            </CardContent>
        </Card>
    );
}

export function FriendRequestList({
    users,
    fetchUser,
}: {
    users: z.infer<typeof FriendRequestDataSchema>
    fetchUser: () => void;
}) {
    return (
        <div className="flex flex-col justify-start items-center gap-4 w-full h-full">
            <InfiniteScroll
                dataLength={users.requests.length} // This is important field to render the next data
                next={fetchUser}
                hasMore={users.currentPage <= users.totalPages}
                loader={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <UserSkeleton />
                    </div>
                }
                endMessage={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <h1 className="text-2xl font-bold">No more users</h1>
                    </div>
                }
                className="flex flex-col items-center justify-center w-full h-full gap-2"
            >
                {users.requests.map((user) => (
                    <FriendCard key={user.sender.id} user={user.sender} />
                ))}
            </InfiniteScroll>
        </div>
    );
}

export function FriendSuggestionList({
    users,
    fetchUser,
}: {
    users: z.infer<typeof SuggestionsDataSchema>
    fetchUser: () => void;
}) {
    return (
        <div className="flex flex-col justify-start items-center gap-4 w-full h-full">
            <InfiniteScroll
                dataLength={users.suggestions.length} // This is important field to render the next data
                next={fetchUser}
                hasMore={users.currentPage <= users.totalPages}
                loader={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <UserSkeleton />
                    </div>
                }
                endMessage={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <h1 className="text-2xl font-bold">No more users</h1>
                    </div>
                }
                className="flex flex-col items-center justify-center w-full h-full gap-2"
            >
                {users.suggestions.map((user) => (
                    <FriendCard key={user.id} user={user} />
                ))}
            </InfiniteScroll>
        </div>
    );
}

export function BlockedUserList({
    users,
    fetchUser,
}: {
    users: z.infer<typeof BlockedFriendsDataSchema>
    fetchUser: () => void;
}) {
    return (
        <div className="flex flex-col justify-start items-center gap-4 w-full h-full">
            <InfiniteScroll
                dataLength={users.blocked.length} // This is important field to render the next data
                next={fetchUser}
                hasMore={users.currentPage <= users.totalPages}
                loader={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <UserSkeleton />
                    </div>
                }
                endMessage={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <h1 className="text-2xl font-bold">No more users</h1>
                    </div>
                }
                className="flex flex-col items-center justify-center w-full h-full gap-2"
            >
                {users.blocked.map((user) => (
                    <FriendCard key={user.receiver.id} user={user.receiver} />
                ))}
            </InfiniteScroll>
        </div>
    );
}

export function FriendList({
    users,
    fetchUser,
}: {
    users: z.infer<typeof FriendsDataSchema>
    fetchUser: () => void;
}) {
    return (
        <div className="flex flex-col justify-start items-center gap-4 w-full h-full">
            <InfiniteScroll
                dataLength={users.friends.length} // This is important field to render the next data
                next={fetchUser}
                hasMore={users.currentPage <= users.totalPages}
                loader={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <UserSkeleton />
                    </div>
                }
                endMessage={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <h1 className="text-2xl font-bold">No more users</h1>
                    </div>
                }
                className="flex flex-col items-center justify-center w-full h-full gap-2"
            >
                {users.friends.map((user) => (
                    <FriendCard key={user.id} user={user} />
                ))}
            </InfiniteScroll>
        </div>
    );
}

export function MutualFriendList({
    users,
    fetchUser,
}: {
    users: z.infer<typeof MutualFriendsDataSchema>
    fetchUser: () => void;
}) {
    return (
        <div className="flex flex-col justify-start items-center gap-4 w-full h-full">
            <InfiniteScroll
                dataLength={users.mutual.length} // This is important field to render the next data
                next={fetchUser}
                hasMore={users.currentPage <= users.totalPages}
                loader={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <UserSkeleton />
                    </div>
                }
                endMessage={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <h1 className="text-2xl font-bold">No more users</h1>
                    </div>
                }
                className="flex flex-col items-center justify-center w-full h-full gap-2"
            >
                {users.mutual.map((user) => (
                    <FriendCard key={user.id} user={user} />
                ))}
            </InfiniteScroll>
        </div>
    );
}

export function MutualFollowerList({
    users,
    fetchUser,
}: {
    users: z.infer<typeof MutualFollowerDataSchema>
    fetchUser: () => void;
}) {
    return (
        <div className="flex flex-col justify-start items-center gap-4 w-full h-full">
            <InfiniteScroll
                dataLength={users.mutual.length} // This is important field to render the next data
                next={fetchUser}
                hasMore={users.currentPage <= users.totalPage}
                loader={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <UserSkeleton />
                    </div>
                }
                endMessage={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <h1 className="text-2xl font-bold">No more users</h1>
                    </div>
                }
                className="flex flex-col items-center justify-center w-full h-full gap-2"
            >
                {users.mutual.map((user) => (
                    <FollowerCard key={user.id} user={user} />
                ))}
            </InfiniteScroll>
        </div>
    );
}

export function FollowerList({
    users,
    fetchUser,
}: {
    users: z.infer<typeof FollowerDataSchema>
    fetchUser: () => void;
}) {
    return (
        <div className="flex flex-col justify-start items-center gap-4 w-full h-full">
            <InfiniteScroll
                dataLength={users.followers.length} // This is important field to render the next data
                next={fetchUser}
                hasMore={users.currentPage <= users.totalPage}
                loader={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <UserSkeleton />
                    </div>
                }
                endMessage={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <h1 className="text-2xl font-bold">No more users</h1>
                    </div>
                }
                className="flex flex-col items-center justify-center w-full h-full gap-2"
            >
                {users.followers.map((user) => (
                    <FollowerCard key={user.follower.id} user={user.follower} />
                ))}
            </InfiniteScroll>
        </div>
    );
}


export function FollowingList({
    users,
    fetchUser,
}: {
    users: z.infer<typeof FollowingDataSchema>
    fetchUser: () => void;
}) {
    return (
        <div className="flex flex-col justify-start items-center gap-4 w-full h-full">
            <InfiniteScroll
                dataLength={users.following.length} // This is important field to render the next data
                next={fetchUser}
                hasMore={users.currentPage <= users.totalPage}
                loader={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <UserSkeleton />
                    </div>
                }
                endMessage={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <h1 className="text-2xl font-bold">No more users</h1>
                    </div>
                }
                className="flex flex-col items-center justify-center w-full h-full gap-2"
            >
                {users.following.map((user) => (
                    <FollowerCard key={user.following.id} user={user.following} />
                ))}
            </InfiniteScroll>
        </div>
    );
}


export function FollowerSuggestionList({
    users,
    fetchUser,
}: {
    users: z.infer<typeof FollowerSuggestionsDataSchema>
    fetchUser: () => void;
}) {
    return (
        <div className="flex flex-col justify-start items-center gap-4 w-full h-full">
            <InfiniteScroll
                dataLength={users.suggestions.length} // This is important field to render the next data
                next={fetchUser}
                hasMore={users.currentPage <= users.totalPage}
                loader={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <UserSkeleton />
                    </div>
                }
                endMessage={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <h1 className="text-2xl font-bold">No more users</h1>
                    </div>
                }
                className="flex flex-col items-center justify-center w-full h-full gap-2"
            >
                {users.suggestions.map((user) => (
                    <FollowerCard key={user.id} user={user} />
                ))}
            </InfiniteScroll>
        </div>
    );
}