"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, parseISO } from "date-fns";
import {
    PostSchema,
    PostDataSchema,
} from "@workspace/schema/api-response/post";
import { MediaCard } from "./media";
import {
    ThumbsUp,
    ThumbsDown,
    MessageSquareMore,
    Share,
    EllipsisVertical,
    Eye
} from "lucide-react";
import { z } from "zod";
import InfiniteScroll from "react-infinite-scroll-component";
import { PostCardSkeleton } from "@/components/custom/skeleton/post";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Comments } from "./comment";
import { useState, useEffect } from "react";
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    LinkedinShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
    LinkedinIcon,
} from "react-share";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LikedAndDislikedUserListForPost } from "./user";
import { getLikedUsers, getDislikedUsers } from "@/lib/api/post-reaction";
import { LikeAndDislikeDataSchema } from "@workspace/schema/api-response/post-reaction";

export function PostCard({
    post,
    handleDelete,
    handleLikePost,
    handleDislikePost,
    handleRemoveLikePost,
    handleRemoveDislikePost,
    handleView,
}: {
    post: z.infer<typeof PostSchema>;
    handleDelete: (id: string) => void;
    handleLikePost: (id: string) => void;
    handleDislikePost: (id: string) => void;
    handleRemoveLikePost: (id: string) => void;
    handleRemoveDislikePost: (id: string) => void;
    handleView: (id: string) => void;
}) {
    const router = useRouter();
    const handleProfileClick = () => {
        router.push(`/dashboard/profile/${post.user.id}`);
    };
    const [options, setOptions] = useState<null|"liked"|"disliked"|"comment">(null);
    return (
        <Card className="w-full max-w-lg">
            <CardHeader className="flex justify-between items-center">
                <div
                    className="flex items-center justify-center space-x-4 cursor-pointer"
                    onClick={handleProfileClick}
                >
                    <Avatar>
                        <AvatarImage src={post.user.image} alt="User Avatar" />
                        <AvatarFallback>{post.user.name}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <CardTitle>
                            {post.user.name} {post.isEdited && `(Edited)`}
                        </CardTitle>
                        <CardDescription>
                            {format(parseISO(post.createdAt), "MMMM do, yyyy h:mm:ss a")}
                        </CardDescription>
                    </div>
                </div>
                {post.isUserPost && (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="cursor-pointer">
                            <EllipsisVertical />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/dashboard/post/update/${post.id}`)}>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => {
                                    handleDelete(post.id);
                                    console.log("Post deleted");
                                }}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </CardHeader>
            <CardContent className="space-y-2">
                {post.content && <p>{post.content}</p>}
                {post.media.length > 0 && <MediaCard media={post.media} postId={post.id} handleView={handleView} />}
            </CardContent>
            <Separator className="my-2" />
            <CardFooter className="flex justify-between">
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 cursor-pointer"
                    onClick={() => !post.reactionStatus.like ? handleLikePost(post.id) : handleRemoveLikePost(post.id)}
                >
                    {post.reactionStatus.like ? (
                        <ThumbsUp className="text-blue-500" />
                    ) : (
                        <ThumbsUp />
                    )}
                    {post.reactions.likeCount > 0 && (
                        <span>{post.reactions.likeCount}</span>
                    )}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 cursor-pointer"
                    onClick={() => setOptions((prev) => (prev === "liked" ? null : "liked"))}
                >
                    Liked
                    {post.comments > 0 && <span>{post.comments}</span>}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 cursor-pointer"
                    onClick={() => !post.reactionStatus.dislike ? handleDislikePost(post.id) : handleRemoveDislikePost(post.id)}
                >
                    {post.reactionStatus.dislike ? (
                        <ThumbsDown className="text-red-500" />
                    ) : (
                        <ThumbsDown />
                    )}
                    {post.reactions.dislikeCount > 0 && (
                        <span>{post.reactions.dislikeCount}</span>
                    )}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 cursor-pointer"
                    onClick={() => setOptions((prev) => (prev === "disliked" ? null : "disliked"))}
                >
                    Disliked
                    {post.comments > 0 && <span>{post.comments}</span>}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 cursor-pointer"
                >
                    <Eye />
                    {post.views > 0 && <span>{post.views}</span>}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 cursor-pointer"
                    onClick={() => setOptions((prev) => (prev === "comment" ? null : "comment"))}
                >
                    <MessageSquareMore />
                    {post.comments > 0 && <span>{post.comments}</span>}
                </Button>
                <ShareDialog post={post} />
            </CardFooter>
            <Separator className="my-2" />
            {options === "comment" && <Comments postId={post.id} />}
            {options === "liked" && (
                <LikedUser postId={post.id} />
            )}
            {options === "disliked" && (
                <DislikedUser postId={post.id} />
            )}
        </Card>
    );
}

export function PostList({
    posts,
    fetchPosts,
    handleDelete,
    handleLikePost,
    handleDislikePost,
    handleRemoveLikePost,
    handleRemoveDislikePost,
    handleView,
}: {
    posts: z.infer<typeof PostDataSchema>;
    fetchPosts: () => void;
    handleDelete: (id: string) => void;
    handleLikePost: (id: string) => void;
    handleDislikePost: (id: string) => void;
    handleRemoveLikePost: (id: string) => void;
    handleRemoveDislikePost: (id: string) => void;
    handleView: (id: string) => void;
}) {
    return (
        <div className="flex flex-col justify-start items-center gap-4 w-full h-full my-6">
            <InfiniteScroll
                dataLength={posts.posts.length}
                next={fetchPosts}
                hasMore={posts.currentPage <= posts.totalPage}
                loader={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <PostCardSkeleton />
                    </div>
                }
                endMessage={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <h1 className="text-2xl font-bold">No more posts</h1>
                    </div>
                }
                className="flex flex-col items-center justify-center w-full h-full gap-2"
            >
                {posts.posts.map((post) => (
                    <PostCard key={post.id} post={post} handleDelete={handleDelete} handleLikePost={handleLikePost} handleDislikePost={handleDislikePost} handleRemoveLikePost={handleRemoveLikePost} handleRemoveDislikePost={handleRemoveDislikePost} handleView={handleView} /> 
                ))}
            </InfiniteScroll>
        </div>
    );
}

export function ShareDialog({ post }: { post: z.infer<typeof PostSchema> }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 cursor-pointer"
                >
                    <Share />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Share this post</DialogTitle>
                    <DialogDescription>
                        Share this post with your friends and family.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-wrap justify-center items-center gap-2">
                    <FacebookShareButton
                        url={`http://localhost/dashboard/post/${post.id}`}
                        title={post.content}
                    >
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton
                        url={`http://localhost/dashboard/post/${post.id}`}
                        title={post.content}
                    >
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <WhatsappShareButton
                        url={`http://localhost/dashboard/post/${post.id}`}
                        title={post.content}
                    >
                        <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                    <LinkedinShareButton
                        url={`http://localhost/dashboard/post/${post.id}`}
                        title={post.content}
                    >
                        <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                </div>
            </DialogContent>
        </Dialog>
    );
}


export function LikedUser({ postId }: { postId: string }) {

    const [likedUsers, setLikedUsers] = useState<z.infer<typeof LikeAndDislikeDataSchema>>({
        users: [],
        currentPage: 1,
        totalPage: 1,
    })

    useEffect(() => {
        if (likedUsers.currentPage <= likedUsers.totalPage) {
            fetchLikedUsers();
        }
    }
        , [likedUsers.currentPage]);

    const fetchLikedUsers = async () => {
        const response = await getLikedUsers(postId);
        if (response.status === "success") {
            setLikedUsers((prev) => ({
                ...prev,
                users: [...prev.users, ...response.data.users],
                currentPage: prev.currentPage + 1,
                totalPage: response.data.totalPage,
            }));
        }
    };

    return (
        <LikedAndDislikedUserListForPost users={likedUsers} fetchUser={fetchLikedUsers} />
    );


}

export function DislikedUser({ postId }: { postId: string }) {

    const [dislikedUsers, setDislikedUsers] = useState<z.infer<typeof LikeAndDislikeDataSchema>>({
        users: [],
        currentPage: 1,
        totalPage: 1,
    })

    useEffect(() => {
        if (dislikedUsers.currentPage <= dislikedUsers.totalPage) {
            fetchDislikedUsers();
        }
    }
        , [dislikedUsers.currentPage]);

    const fetchDislikedUsers = async () => {
        const response = await getDislikedUsers(postId);
        if (response.status === "success") {
            setDislikedUsers((prev) => ({
                ...prev,
                users: [...prev.users, ...response.data.users],
                currentPage: prev.currentPage + 1,
                totalPage: response.data.totalPage,
            }));
        }
    };

    return (
        <LikedAndDislikedUserListForPost users={dislikedUsers} fetchUser={fetchDislikedUsers} />
    );
}
