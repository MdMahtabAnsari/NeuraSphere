"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PostCard } from "@/components/custom/post";
import { PostSchema } from "@workspace/schema/api-response/post";
import { getPostById,deletePost,createView } from "@/lib/api/post";
import { likePost,dislikePost,removeDislikePost,removeLikePost } from "@/lib/api/post-reaction";

import { z } from "zod";


import { PostCardSkeleton } from "@/components/custom/skeleton/post";


export default function Page() {
    const { postId } = useParams();
    const [post, setPost] = useState<z.infer<typeof PostSchema> | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (postId) {
            fetchPost();
        }
    }, [postId]);

    const fetchPost = async () => {
        const data = await getPostById(postId as string);
        if (data.status === "success") {
            setPost(data.data);
        } else {
            setPost(null);
        }
        setLoading(false);
    };
    const handleDelete = async (id: string) => {
        const data = await deletePost(id);
        if (data.status === "success") {
            setPost(null);
        }
    };
    const handleLikePost = async (id: string) => {
        const data = await likePost(id);
        if (data.status === "success") {
            setPost((prev) => {
                if (prev) {
                    if(prev.reactionStatus.dislike){
                        return {
                            ...prev,
                            reactionStatus: {
                                like: true,
                                dislike: false,
                            },
                            likes: data.data,
                            dislikes: prev.reactions.dislikeCount - 1,
                        }
                    }
                    else{
                        return {
                            ...prev,
                            reactionStatus: {
                                dislike: false,
                                like: true,
                            },
                            likes: data.data,
                            dislikes: prev.reactions.dislikeCount,
                        }
                    }
                }
                 else {
                return prev;
                }
            });
        }
    };
    const handleDislikePost = async (id: string) => {
        const data = await dislikePost(id);
        if (data.status === "success") {
            setPost((prev) => {
                if (prev) {
                    if(prev.reactionStatus.like){
                        return {
                            ...prev,
                            reactionStatus: {
                                like: false,
                                dislike: true,
                            },
                            reactions: {
                                likeCount: prev.reactions.likeCount - 1,
                                dislikeCount: data.data,
                            },
                        }
                    }
                    else{
                        return {
                            ...prev,
                            reactionStatus: {
                                ...prev.reactionStatus,
                                like: false,
                                dislike: true,
                            },
                            reactions: {
                                likeCount: prev.reactions.likeCount,
                                dislikeCount: data.data,
                            },
                        }
                    }
                }
                 else {
                return prev;
                }
            });
        }
    };
    const handleRemoveLikePost = async (id: string) => {
        const data = await removeLikePost(id);
        if (data.status === "success") {
            setPost((prev) => {
                if (prev) {
                    return {
                        ...prev,
                        reactionStatus: {
                            ...prev.reactionStatus,
                            like: false,
                        },
                        reactions:{
                            ...prev.reactions,
                            likeCount: prev.reactions.likeCount - 1,
                        }
                    };
                }
                 else {
                return prev;
                }
            });
        }
    };
    const handleRemoveDislikePost = async (id: string) => {
        const data = await removeDislikePost(id);
        if (data.status === "success") {
            setPost((prev) => {
                if (prev) {
                    return {
                        ...prev,
                        reactionStatus: {
                            ...prev.reactionStatus,
                            dislike: false,
                        },
                        reactions:{
                            ...prev.reactions,
                            dislikeCount: prev.reactions.dislikeCount - 1,
                        }
                    };
                }
                else {
                return prev;
                }
            });
        }
    };
    const handleView = async (id: string) => {
        const data = await createView(id);
        if (data.status === "success") {
            setPost((prev) => {
                if (prev) {
                    return {
                        ...prev,
                        views: data.data,
                    };
                }
                else {
                    return prev;
                }
            });
        }
    }
    return (
        <div className="flex w-full h-full justify-center items-center my-4">
            {loading ? (
                <PostCardSkeleton />
            ) : post ? (

                <PostCard
                    post={post}
                    handleDelete={handleDelete}
                    handleLikePost={handleLikePost}
                    handleDislikePost={handleDislikePost}
                    handleRemoveLikePost={handleRemoveLikePost}
                    handleRemoveDislikePost={handleRemoveDislikePost}
                    handleView={handleView}
                />
            ) : (
                <div className="text-center">Post not found</div>
            )}
        </div>
    );
}

// handleDelete,
//     handleLikePost,
//     handleDislikePost,
//     handleRemoveLikePost,
//     handleRemoveDislikePost,
