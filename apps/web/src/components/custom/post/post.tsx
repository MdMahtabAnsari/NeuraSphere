"use client";
import { getOtherUserPosts } from "@/lib/api/post";
import { PostDataSchema } from "@workspace/schema/api-response/post";
import { z } from "zod";
import { useEffect, useState } from "react";
import { PostList } from "@/components/custom/post";
import { deletePost, createView } from "@/lib/api/post";
import {
    likePost,
    dislikePost,
    removeLikePost,
    removeDislikePost,
} from "@/lib/api/post-reaction";

export const Post = ({ id }: { id: string }) => {
    const [posts, setPosts] = useState<z.infer<typeof PostDataSchema>>({
        posts: [],
        totalPage: 1,
        currentPage: 1,
    });

    useEffect(() => {
            fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const data = await getOtherUserPosts({
            id,
            page: posts.currentPage,
            limit: 10,
        });
        if (data.status === "success") {
            setPosts((prev) => ({
                posts: [...prev.posts, ...data.data.posts],
                currentPage: prev.currentPage + 1,
                totalPage: data.data.totalPage,
            }));
        }
    };

    const handleDelete = async (id: string) => {
        const data = await deletePost(id);
        if (data.status === "success") {
            setPosts((prev) => ({
                ...prev,
                posts: prev.posts.filter((post) => post.id !== id),
            }));
        }
    };

    const handleLikePost = async (id: string) => {
        const data = await likePost(id);
        if (data.status === "success") {
            setPosts((prev) => ({
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
                        } else {
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
                    } else {
                        return post;
                    }
                }),
            }));
        }
    };

    const handleDislikePost = async (id: string) => {
        const data = await dislikePost(id);
        if (data.status === "success") {
            setPosts((prev) => ({
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
                        } else {
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
                    } else {
                        return post;
                    }
                }),
            }));
        }
    };

    const handleRemoveLikePost = async (id: string) => {
        const data = await removeLikePost(id);
        if (data.status === "success") {
            setPosts((prev) => ({
                ...prev,
                posts: prev.posts.map((post) =>
                    post.id === id
                        ? {
                            ...post,
                            reactionStatus: {
                                dislike: post.reactionStatus.dislike,
                                like: false,
                            },
                            reactions: {
                                likeCount: data.data,
                                dislikeCount: post.reactions.dislikeCount,
                            },
                        }
                        : post
                ),
            }));
        }
    };

    const handleRemoveDislikePost = async (id: string) => {
        const data = await removeDislikePost(id);
        if (data.status === "success") {
            setPosts((prev) => ({
                ...prev,
                posts: prev.posts.map((post) =>
                    post.id === id
                        ? {
                            ...post,
                            reactionStatus: {
                                dislike: false,
                                like: post.reactionStatus.like,
                            },
                            reactions: {
                                likeCount: post.reactions.likeCount,
                                dislikeCount: data.data,
                            },
                        }
                        : post
                ),
            }));
        }
    };

    const handleView = async (id: string) => {
        const data = await createView(id);
        if (data.status === "success") {
            setPosts((prev) => ({
                ...prev,
                posts: prev.posts.map((post) =>
                    post.id === id
                        ? {
                            ...post,
                            views: data.data,
                        }
                        : post
                ),
            }));
        }
    };

    return (
        <PostList
            posts={posts}
            fetchPosts={fetchPosts}
            handleDelete={handleDelete}
            handleLikePost={handleLikePost}
            handleDislikePost={handleDislikePost}
            handleRemoveLikePost={handleRemoveLikePost}
            handleRemoveDislikePost={handleRemoveDislikePost}
            handleView={handleView}
        />
    );
};
