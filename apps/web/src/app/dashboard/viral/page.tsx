"use client"

import { viralPosts } from "@/lib/api/post";
import { PostList } from "@/components/custom/post";
import { PostDataSchema } from "@workspace/schema/api-response/post";
import { useEffect, useState } from "react";
import { z } from "zod";
import { deletePost, createView } from "@/lib/api/post";
import { likePost, dislikePost, removeLikePost, removeDislikePost } from "@/lib/api/post-reaction";

export default function Page() {

    const [response, setResponse] = useState<z.infer<typeof PostDataSchema>>({
        posts: [],
        totalPage: 1,
        currentPage: 1,
    });


    useEffect(() => {
        if (response.currentPage <= response.totalPage) {
            fetchPosts();
        }
    }
        , [response.currentPage]);

    const fetchPosts = async () => {
        const data = await viralPosts({ page: response.currentPage, limit: 10 });
        if (data.status === "success") {
            setResponse((prev) => ({
                ...prev,
                posts: [...prev.posts, ...data.data.posts],
                currentPage: prev.currentPage + 1,
                totalPage: data.data.totalPage,
            }));
        }
        else {
            setResponse((prev) => ({
                ...prev,
                currentPage: prev.currentPage + 1,
                totalPage: prev.totalPage,
            }));
        }
    }
    const handleDelete = async (id: string) => {
        const data = await deletePost(id);
        if (data.status === "success") {
            setResponse((prev) => ({
                ...prev,
                posts: prev.posts.filter((post) => post.id !== id),
            }));
        }
    }
    const handleLikePost = async (id: string) => {
        const data = await likePost(id);
        if (data.status === "success") {
            setResponse((prev) => ({
                ...prev,
                posts: prev.posts.map((post) => {
                    if (post.id === id) {
                        if (post.reactionStatus.dislike) {
                            return {
                                ...post,
                                reactionStatus: {
                                    ...post.reactionStatus,
                                    like: true,
                                    dislike: false,
                                },
                                reactions: {
                                    ...post.reactions,
                                    likeCount: data.data,
                                    dislikeCount: post.reactions.dislikeCount - 1,
                                },
                            };
                        }
                        else {
                            return {
                                ...post,
                                reactionStatus: {
                                    ...post.reactionStatus,
                                    like: true,
                                    dislike: false,
                                },
                                reactions: {
                                    ...post.reactions,
                                    likeCount: data.data,
                                    dislikeCount: post.reactions.dislikeCount,
                                },
                            };
                        }
                    }
                    else {
                        return post;
                    }
                }),
            }));
        }
    };

    const handleDislikePost = async (id: string) => {
        const data = await dislikePost(id);
        if (data.status === "success") {
            setResponse((prev) => ({
                ...prev,
                posts: prev.posts.map((post) => {
                    if (post.id === id) {
                        if (post.reactionStatus.like) {
                            return {
                                ...post,
                                reactionStatus: {
                                    ...post.reactionStatus,
                                    like: false,
                                    dislike: true,
                                },
                                reactions: {
                                    ...post.reactions,
                                    likeCount: post.reactions.likeCount - 1,
                                    dislikeCount: data.data,
                                },
                            };
                        }
                        else {
                            return {
                                ...post,
                                reactionStatus: {
                                    ...post.reactionStatus,
                                    like: false,
                                    dislike: true,
                                },
                                reactions: {
                                    ...post.reactions,
                                    likeCount: post.reactions.likeCount,
                                    dislikeCount: data.data,
                                },
                            };
                        }
                    }
                    else {
                        return post;
                    }
                }),
            }));
        }
    }

    const handleRemoveLikePost = async (id: string) => {
        const data = await removeLikePost(id);
        if (data.status === "success") {
            setResponse((prev) => ({
                ...prev,
                posts: prev.posts.map((post) => post.id === id ? {
                    ...post,
                    reactionStatus: {
                        dislike: post.reactionStatus.dislike,
                        like: false,
                    },
                    reactions: {
                        likeCount: data.data,
                        dislikeCount: post.reactions.dislikeCount,
                    },
                } : post),
            }));
        }
    };

    const handleRemoveDislikePost = async (id: string) => {
        const data = await removeDislikePost(id);
        if (data.status === "success") {
            setResponse((prev) => ({
                ...prev,
                posts: prev.posts.map((post) => post.id === id ? {
                    ...post,
                    reactionStatus: {
                        dislike: false,
                        like: post.reactionStatus.like,
                    },
                    reactions: {
                        likeCount: post.reactions.likeCount,
                        dislikeCount: data.data,
                    },
                } : post),
            }));
        }
    };
    const handleView = async (id: string) => {
        const data = await createView(id);
        if (data.status === "success") {
            setResponse((prev) => ({
                ...prev,
                posts: prev.posts.map((post) => post.id === id ? {
                    ...post,
                    views: data.data,
                } : post),
            }));
        }
    };
    return (
        <PostList posts={response} fetchPosts={fetchPosts} handleDelete={handleDelete} handleLikePost={handleLikePost} handleDislikePost={handleDislikePost} handleRemoveDislikePost={handleRemoveDislikePost} handleRemoveLikePost={handleRemoveLikePost} handleView={handleView} />
    );
}