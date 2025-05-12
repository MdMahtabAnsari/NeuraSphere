"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import InfiniteScroll from "react-infinite-scroll-component";
import { z } from "zod";
import { format, parseISO, set } from "date-fns";
import {
    CommentDataSchema,
    CommentSchema,
} from "@workspace/schema/api-response/comment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentCardSkeleton } from "./skeleton/comment";
import {
    getComments,
    createComment,
    commentSuggestion,
    updateComment,
    deleteComment,
} from "@/lib/api/comment";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
    ThumbsUp,
    ThumbsDown,
    Reply,
    SendHorizontal,
    Brain,
    EllipsisVertical,
} from "lucide-react";
import { Input } from "../ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import {
    updateComment as updateCommentSchema,
    postIdCommentIdObj,
} from "@workspace/schema/comment";
import {
    likeComment,
    dislikeComment,
    removeDislikeComment,
    removeLikeComment,
} from "@/lib/api/comment-reaction";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { LikedAndDislikedUserListForComment } from "./user"
import { getLikedUsers, getDislikedUsers } from "@/lib/api/comment-reaction";
import { LikedAndDislikedUserDataSchema } from "@workspace/schema/api-response/comment-reaction";
import { User } from 'lucide-react';

export function CommentCard({
    comment,
    handleShowReply,
    handleUpdateComment,
    handleLikeComment,
    handleDislikeComment,
    handleDelete,
    handleRemoveLikeComment,
    handleRemoveDislikeComment,
}: {
    comment: z.infer<typeof CommentSchema>;
    handleShowReply: (parentId: string) => void;
    handleUpdateComment: (data: z.infer<typeof updateCommentSchema>) => void;
    handleLikeComment: (data: z.infer<typeof postIdCommentIdObj>) => void;
    handleDislikeComment: (data: z.infer<typeof postIdCommentIdObj>) => void;
    handleDelete: (commentId: string) => void;
    handleRemoveLikeComment: (data: z.infer<typeof postIdCommentIdObj>) => void;
    handleRemoveDislikeComment: (
        data: z.infer<typeof postIdCommentIdObj>
    ) => void;
}) {
    const router = useRouter();
    const [edit, setEdit] = useState<boolean>(false);
    const [content, setContent] = useState<string>("");
    const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
    const handleCommentSuggestion = async () => {
        setIsSuggesting(true);
        const response = await commentSuggestion({
            postId: comment.postId,
            parentId: comment.parentId ? comment.parentId : undefined,
        });
        if (response.status === "success") {
            setContent(response.data.content);
        }
        setIsSuggesting(false);
    };
    return (
        <Card className="w-full">
            <CardHeader className="flex justify-between items-center">
                <div
                    className="flex items-center space-x-4 cursor-pointer"
                    onClick={() => router.push(`/dashboard/profile/${comment.user.id}`)}
                >
                    <Avatar>
                        <AvatarImage src={comment.user.image} alt="User Avatar" />
                        <AvatarFallback>{comment.user.name}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <CardTitle>
                            {comment.user.name} {comment.isEdited && `(Edited)`}
                        </CardTitle>
                        <CardDescription>
                            {format(parseISO(comment.createdAt), "MMMM do, yyyy h:mm:ss a")}
                        </CardDescription>
                    </div>
                </div>
                {comment.isUserComment && (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="cursor-pointer">
                            <EllipsisVertical />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => setEdit((prev) => !prev)}
                            >
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => {
                                    handleDelete(comment.id);
                                }}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </CardHeader>
            <CardContent className="space-y-2">
                {!edit ? (
                    comment.content
                ) : (
                    <div className="flex items-center justify-center w-full">
                        <Input
                            type="text"
                            placeholder="Write a comment..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-3/4 h-10"
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={!content || isSuggesting}
                            className="flex items-center cursor-pointer"
                            onClick={() => {
                                setEdit(false);
                                handleUpdateComment({ id: comment.id, content });
                            }}
                        >
                            <SendHorizontal />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center cursor-pointer"
                            onClick={handleCommentSuggestion}
                            disabled={isSuggesting}
                        >
                            <Brain />
                        </Button>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 cursor-pointer"
                    onClick={() => handleShowReply(comment.id)}
                >
                    <Reply />
                    <span>{comment.replyCount}</span>
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 cursor-pointer"
                    onClick={() =>
                        !comment.reactionStatus.like
                            ? handleLikeComment({
                                postId: comment.postId,
                                commentId: comment.id,
                            })
                            : handleRemoveLikeComment({
                                postId: comment.postId,
                                commentId: comment.id,
                            })
                    }
                >
                    {comment.reactionStatus.like ? (
                        <ThumbsUp className="text-blue-500" />
                    ) : (
                        <ThumbsUp />
                    )}
                    {comment.reactions.likeCount > 0 && (
                        <span>{comment.reactions.likeCount}</span>
                    )}
                </Button>
                {/* show likes in dialog box */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-1 cursor-pointer"
                        >
                            Liked Users
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Likes</DialogTitle>
                            <LikedUser commentId={comment.id} />
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 cursor-pointer"
                    onClick={() =>
                        !comment.reactionStatus.dislike
                            ? handleDislikeComment({
                                postId: comment.postId,
                                commentId: comment.id,
                            })
                            : handleRemoveDislikeComment({
                                postId: comment.postId,
                                commentId: comment.id,
                            })
                    }
                >
                    {comment.reactionStatus.dislike ? (
                        <ThumbsDown className="text-red-500" />
                    ) : (
                        <ThumbsDown />
                    )}
                    {comment.reactions.dislikeCount > 0 && (
                        <span>{comment.reactions.dislikeCount}</span>
                    )}
                </Button>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-1 cursor-pointer"
                        >
                            Disliked Users
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Dislikes</DialogTitle>
                            <DislikedUser commentId={comment.id} />
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
}

export function CommentList({
    comments,
    fetchComments,
    handleShowReply,
    handleUpdateComment,
    handleLikeComment,
    handleDislikeComment,
    handleDelete,
    handleRemoveLikeComment,
    handleRemoveDislikeComment,
}: {
    comments: z.infer<typeof CommentDataSchema>;
    fetchComments: () => void;
    handleShowReply: (parentId: string) => void;
    handleUpdateComment: (data: z.infer<typeof updateCommentSchema>) => void;
    handleLikeComment: (data: z.infer<typeof postIdCommentIdObj>) => void;
    handleDislikeComment: (data: z.infer<typeof postIdCommentIdObj>) => void;
    handleDelete: (commentId: string) => void;
    handleRemoveLikeComment: (data: z.infer<typeof postIdCommentIdObj>) => void;
    handleRemoveDislikeComment: (
        data: z.infer<typeof postIdCommentIdObj>
    ) => void;
}) {
    return (
        <div className="flex flex-col justify-start items-center gap-4 w-full h-full my-6">
            <InfiniteScroll
                dataLength={comments.comments.length}
                next={fetchComments}
                hasMore={comments.currentPage <= comments.totalPage}
                loader={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <CommentCardSkeleton />
                    </div>
                }
                endMessage={
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                        <h1 className="text-2xl font-bold">No more comments</h1>
                    </div>
                }
                className="flex flex-col items-center justify-center w-full h-full gap-2"
            >
                {comments.comments.map((comment) => (
                    <CommentCard
                        key={comment.id}
                        comment={comment}
                        handleShowReply={handleShowReply}
                        handleUpdateComment={handleUpdateComment}
                        handleLikeComment={handleLikeComment}
                        handleDislikeComment={handleDislikeComment}
                        handleDelete={handleDelete}
                        handleRemoveLikeComment={handleRemoveLikeComment}
                        handleRemoveDislikeComment={handleRemoveDislikeComment}
                    />
                ))}
            </InfiniteScroll>
        </div>
    );
}

export function Comments({ postId }: { postId: string }) {
    const [comments, setComments] = useState<z.infer<typeof CommentDataSchema>>({
        comments: [],
        totalPage: 1,
        currentPage: 1,
    });
    const [parentIds, setParentIds] = useState<string[]>([]);
    const [reply, setReply] = useState<string>("");
    const [isReplying, setIsReplying] = useState<boolean>(false);
    const [isSuggesting, setIsSuggesting] = useState<boolean>(false);

    useEffect(() => {
        if (comments.currentPage <= comments.totalPage) {
            fetchComments();
        }
    }, [comments.currentPage]);

    useEffect(() => {
        setComments({
            comments: [],
            totalPage: 1,
            currentPage: 1,
        });
    }, [parentIds.length]);

    const fetchComments = async () => {
        const data = await getComments({
            postId,
            commentId: parentIds.length > 0 ? parentIds[parentIds.length - 1] : null,
            page: comments.currentPage,
            limit: 10,
        });
        if (data.status === "success") {
            setComments((prev) => ({
                ...prev,
                comments: [...prev.comments, ...data.data.comments],
                currentPage: prev.currentPage + 1,
                totalPage: data.data.totalPage,
            }));
        } else {
            setComments((prev) => ({
                ...prev,
                currentPage: prev.currentPage + 1,
                totalPage: prev.totalPage,
            }));
        }
    };

    const handleShowReply = (parentId: string) => {
        setParentIds((prev) => {
            if (prev.includes(parentId)) {
                return prev.filter((id) => id !== parentId);
            } else {
                return [...prev, parentId];
            }
        });
    };

    const handleCreateComment = async () => {
        setIsReplying(true);
        const response = await createComment({
            postId,
            parentId:
                parentIds.length > 0 ? parentIds[parentIds.length - 1] : undefined,
            content: reply,
        });
        if (response.status === "success") {
            setComments({
                comments: [],
                totalPage: 1,
                currentPage: 1,
            });
            setReply("");
        }
        setIsReplying(false);
    };

    const handleCommentSuggestion = async () => {
        setIsSuggesting(true);
        const response = await commentSuggestion({
            postId,
            parentId:
                parentIds.length > 0 ? parentIds[parentIds.length - 1] : undefined,
        });
        if (response.status === "success") {
            setReply(response.data.content);
        }
        setIsSuggesting(false);
    };

    const handleUpdateComment = async (
        data: z.infer<typeof updateCommentSchema>
    ) => {
        const response = await updateComment(data);
        if (response.status === "success") {
            setComments((prev) => ({
                ...prev,
                comments: prev.comments.map((comment) =>
                    comment.id === data.id
                        ? {
                            ...comment,
                            content: data.content,
                            isEdited: response.data.isEdited,
                        }
                        : comment
                ),
            }));
        }
    };

    const handleLikeComment = async (
        data: z.infer<typeof postIdCommentIdObj>
    ) => {
        const response = await likeComment(data);
        if (response.status === "success") {
            setComments((prev) => ({
                ...prev,
                comments: prev.comments.map((comment) => {
                    if (comment.id === data.commentId) {
                        if (comment.reactionStatus.dislike) {
                            return {
                                ...comment,
                                reactionStatus: {
                                    ...comment.reactionStatus,
                                    like: true,
                                    dislike: false,
                                },
                                reactions: {
                                    likeCount: response.data,
                                    dislikeCount: comment.reactions.dislikeCount - 1,
                                },
                            };
                        }
                        else {
                            return {
                                ...comment,
                                reactionStatus: {
                                    like: true,
                                    dislike: false,
                                },
                                reactions: {
                                    likeCount: response.data,
                                    dislikeCount: comment.reactions.dislikeCount - 1,
                                },
                            };
                        }
                    }
                    else {
                        return comment;
                    }
                }
                ),
            }));
        }
    };

    const handleDislikeComment = async (
        data: z.infer<typeof postIdCommentIdObj>
    ) => {
        const response = await dislikeComment(data);
        if (response.status === "success") {
            setComments((prev) => ({
                ...prev,
                comments: prev.comments.map((comment) => {
                    if (comment.id === data.commentId) {
                        if (comment.reactionStatus.like) {
                            return {
                                ...comment,
                                reactionStatus: {
                                    like: false,
                                    dislike: true,
                                },
                                reactions: {
                                    likeCount: comment.reactions.likeCount - 1,
                                    dislikeCount: response.data,
                                },
                            };
                        }
                        else {
                            return {
                                ...comment,
                                reactionStatus: {
                                    like: false,
                                    dislike: true,
                                },
                                reactions: {
                                    likeCount: comment.reactions.likeCount,
                                    dislikeCount: response.data,
                                },
                            };
                        }
                    }
                    else {
                        return comment;
                    }
                }
                ),
            }));
        }
    };

    const handleRemoveLikeComment = async (
        data: z.infer<typeof postIdCommentIdObj>
    ) => {
        const response = await removeLikeComment(data);
        if (response.status === "success") {
            setComments((prev) => ({
                ...prev,
                comments: prev.comments.map((comment) =>
                    comment.id === data.commentId
                        ? {
                            ...comment,
                            reactions: {
                                likeCount: response.data,
                                dislikeCount: comment.reactions.dislikeCount,
                            },
                            reactionStatus: {
                                like: false,
                                dislike: comment.reactionStatus.dislike,
                            },
                        }
                        : comment
                ),
            }));
        }
    };
    const handleRemoveDislikeComment = async (
        data: z.infer<typeof postIdCommentIdObj>
    ) => {
        const response = await removeDislikeComment(data);
        if (response.status === "success") {
            setComments((prev) => ({
                ...prev,
                comments: prev.comments.map((comment) =>
                    comment.id === data.commentId
                        ? {
                            ...comment,
                            reactions: {
                                likeCount: comment.reactions.likeCount,
                                dislikeCount: response.data,
                            },
                            reactionStatus: {
                                like: comment.reactionStatus.like,
                                dislike: false,
                            },
                        }
                        : comment
                ),
            }));
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        const response = await deleteComment(commentId);
        if (response.status === "success") {
            setComments((prev) => ({
                ...prev,
                comments: prev.comments.filter((comment) => comment.id !== commentId),
            }));
        }
    };

    return (
        <div className="flex flex-col justify-center items-center gap-4 w-full h-96">
            <div className="w-full flex-col justify-center items-center overflow-auto scroll-auto">
                {parentIds.length > 0 && (
                    <div className="flex justify-start items-center gap-4 w-3/4 h-2 my-6 sticky top-2 z-10">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-1 cursor-pointer"
                            onClick={() =>
                                setParentIds((prev) => prev.slice(0, prev.length - 1))
                            }
                        >
                            Back
                        </Button>
                    </div>
                )}
                <CommentList
                    comments={comments}
                    fetchComments={fetchComments}
                    handleShowReply={handleShowReply}
                    handleUpdateComment={handleUpdateComment}
                    handleDelete={handleDeleteComment}
                    handleDislikeComment={handleDislikeComment}
                    handleLikeComment={handleLikeComment}
                    handleRemoveLikeComment={handleRemoveLikeComment}
                    handleRemoveDislikeComment={handleRemoveDislikeComment}
                />
            </div>
            <div className="flex items-center justify-center w-full">
                <Input
                    type="text"
                    placeholder="Write a comment..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    className="w-3/4 h-10"
                />
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={!reply || isReplying || isSuggesting}
                    className="flex items-center cursor-pointer"
                    onClick={handleCreateComment}
                >
                    <SendHorizontal />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center cursor-pointer"
                    onClick={handleCommentSuggestion}
                    disabled={isSuggesting || isReplying}
                >
                    <Brain />
                </Button>
            </div>
        </div>
    );
}


export function LikedUser({ commentId }: { commentId: string }) {
    const [likedUsers, setLikedUsers] = useState<z.infer<typeof LikedAndDislikedUserDataSchema>>({
        users: [],
        totalPage: 1,
        currentPage: 1,
    });
    useEffect(() => {
        if (likedUsers.currentPage <= likedUsers.totalPage) {
            fetchLikedUsers();
        }
    }
        , [likedUsers.currentPage]);

    const fetchLikedUsers = async () => {
        const response = await getLikedUsers(commentId);
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
        <LikedAndDislikedUserListForComment users={likedUsers} fetchUser={fetchLikedUsers} />
    );
}

export function DislikedUser({ commentId }: { commentId: string }) {
    const [dislikedUsers, setDislikedUsers] = useState<z.infer<typeof LikedAndDislikedUserDataSchema>>({
        users: [],
        totalPage: 1,
        currentPage: 1,
    });

    useEffect(() => {
        if (dislikedUsers.currentPage <= dislikedUsers.totalPage) {
            fetchDislikedUsers();
        }
    }, [dislikedUsers.currentPage]);


    const fetchDislikedUsers = async () => {
        const response = await getDislikedUsers(commentId);
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
        <LikedAndDislikedUserListForComment users={dislikedUsers} fetchUser={fetchDislikedUsers} />

    );
}
