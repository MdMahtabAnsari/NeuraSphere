import { createPost, updatePost, identifier, tags } from "@workspace/schema/post"
import { z } from "zod"
import { InternalServerError, NotFoundError } from "../utils/errors"
import { client, Prisma } from "@workspace/database/client"

class PostRepository {

    async createPost(userId: string, data: z.infer<typeof createPost>) {
        try {
            const post = await client.post.create({
                data: {
                    content: data.content,
                    userId: userId,
                }
            })
            return post
        } catch (error) {
            console.error("Error in createPost Repository", error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new NotFoundError("User not found")
                }
            }
            throw new InternalServerError()
        }
    }

    async getPostByIdWithAllData(postId: string) {
        try {
            const post = await client.post.findUnique({
                where: {
                    id: postId
                },
                include: {
                    media: true,
                    tags: {
                        select: {
                            tag: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    }
                }
            })
            return post
        } catch (error) {
            console.error("Error in getPostByIdWithAllData Repository", error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new NotFoundError("Post not found")
                }
            }
            throw new InternalServerError()
        }
    }

    async updatePost(data: z.infer<typeof updatePost>) {
        try {
            const post = await client.post.update({
                where: {
                    id: data.id
                },
                data: {
                    content: data.content ? data.content : null
                }
            })
            return post
        } catch (error) {
            console.error("Error in updatePost Repository", error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new NotFoundError("Post not found")
                }
            }
            throw new InternalServerError()
        }
    }

    async getPostById(postId: string) {
        try {
            const post = await client.post.findUnique({
                where: {
                    id: postId
                }
            })
            return post
        } catch (error) {
            console.error("Error in getPostById Repository", error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new NotFoundError("Post not found")
                }
            }
            throw new InternalServerError()
        }
    }

    async makePostIsEdited(postId: string) {
        try {
            await client.post.update({
                where: {
                    id: postId
                },
                data: {
                    isEdited: true
                }
            })
            return true
        }
        catch (error) {
            console.error("Error in makePostIsEdited Repository", error)
            throw new InternalServerError()
        }
    }

    async getPostByTags(tag: z.infer<typeof tags> | undefined, page: number = 1, limit: number = 10) {
        try {
            if (!tag || tag.length === 0) {
                console.log("No tags found");
                return [];
            }

            const skip = (page - 1) * limit;

            const totalPosts = await client.post.count({
                where: {
                    OR: tag.map(tagName => ({
                        tags: {
                            some: {
                                tag: {
                                    name: {
                                        contains: tagName, // `contains` instead of `like` for better filtering
                                        mode: "insensitive"
                                    }
                                }
                            }
                        }
                    }))
                }
            });

            const totalPages = Math.ceil(totalPosts / limit);

            const posts= await client.post.findMany({
                where: {
                    OR: tag.map(tagName => ({
                        tags: {
                            some: {
                                tag: {
                                    name: {
                                        contains: tagName, // `contains` instead of `like` for better filtering
                                        mode: "insensitive"
                                    }
                                }
                            }
                        }
                    }))
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit,
                select: {
                    id: true,
                    content: true,
                    media: {
                        select: {
                            id: true,
                            type: true,
                            url: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    },
                    tags: {
                        select: {
                            tag: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    },
                    createdAt: true,
                    updatedAt: true,
                    isEdited: true,
                }
            });
            return {posts,totalPages,currentPage:page}
        } catch (error) {
            console.error("Error in getPostByTags Repository", error);
            throw new InternalServerError();
        }
    }


    async deletePost(postId: string) {
        try {
            await client.post.delete({
                where: {
                    id: postId
                }
            })
            return true
        } catch (error) {
            console.error("Error in deletePost Repository", error)
            throw new InternalServerError()
        }
    }

    async getUserPosts(userId: string, page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit

            const totalPosts = await client.post.count({
                where: {
                    userId: userId
                }
            });
            const totalPages = Math.ceil(totalPosts / limit);
            const posts = await client.post.findMany({
                where: {
                    userId: userId
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: skip,
                take: limit,
                select: {
                    id: true,
                    content: true,
                    media: {
                        select: {
                            id: true,
                            type: true,
                            url: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    },
                    tags: {
                        select: {
                            tag: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    },
                    createdAt: true,
                    updatedAt: true,
                    isEdited: true,
                }
            });
            return {posts,totalPages,currentPage:page}
        } catch (error) {
            console.error("Error in getUserPosts Repository", error)
            throw new InternalServerError()
        }
    }

    async getPostByUsernamesAndUseridAndNameAndMobileAndEmail(identifiers: z.infer<typeof identifier>, page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit
            const totalPosts = await client.post.count({
                where: {
                    OR: [
                        {
                            user: {
                                name: {
                                    contains: identifiers,
                                    mode: "insensitive"
                                }
                            }
                        },
                        {
                            user: {
                                id: identifiers
                            }
                        },
                        {
                            id: identifiers
                        }, {
                            user: {
                                email: identifiers
                            }
                        }, {
                            user: {
                                mobile: identifiers
                            }
                        }
                    ]
                }
            });
            const totalPages = Math.ceil(totalPosts / limit);
            const posts = await client.post.findMany({
                where: {
                    OR: [
                        {
                            user: {
                                name: {
                                    contains: identifiers,
                                    mode: "insensitive"
                                }
                            }
                        },
                        {
                            user: {
                                id: identifiers
                            }
                        },
                        {
                            id: identifiers
                        }, {
                            user: {
                                email: identifiers
                            }
                        }, {
                            user: {
                                mobile: identifiers
                            }
                        }
                    ]
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: skip,
                take: limit,
                select: {
                    id: true,
                    content: true,
                    media: {
                        select: {
                            id: true,
                            type: true,
                            url: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    },
                    tags: {
                        select: {
                            tag: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    },
                    createdAt: true,
                    updatedAt: true,
                    isEdited: true,
                }
            });
            return {posts,totalPages,currentPage:page}
        } catch (error) {
            console.error("Error in getPostByUsernamesAndUseridAndName Repository", error)
            throw new InternalServerError()
        }
    }

}

export const postRepository = new PostRepository()