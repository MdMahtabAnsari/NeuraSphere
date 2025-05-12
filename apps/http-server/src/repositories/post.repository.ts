import { createPost, identifier, tags, updatePost } from "@workspace/schema/post"
import { z } from "zod"
import { InternalServerError, NotFoundError } from "../utils/errors"
import { client, Prisma } from "@workspace/database/client"

class PostRepository {

    async createPost(userId: string, data: z.infer<typeof createPost>) {
        try {
            return await client.post.create({
                data: {
                    content: data.content,
                    userId: userId,
                }
            })
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
            return await client.post.findUnique({
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
                            username: true,
                            name: true,
                            image: true
                        }
                    }
                }
            })
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
            return await client.post.update({
                where: {
                    id: data.id
                },
                data: {
                    content: data.content ? data.content : null
                }
            })
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
            return await client.post.findUnique({
                where: {
                    id: postId
                }
            })
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
            return await client.post.update({
                where: {
                    id: postId
                },
                data: {
                    isEdited: true
                }
            })
        }
        catch (error) {
            console.error("Error in makePostIsEdited Repository", error)
            throw new InternalServerError()
        }
    }

    async getPostByTags(tag: z.infer<typeof tags>, page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;

            return await client.post.findMany({
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
                            username: true,
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
            return await client.post.findMany({
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
                            username: true,
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
        } catch (error) {
            console.error("Error in getUserPosts Repository", error)
            throw new InternalServerError()
        }
    }

    async getPostByUsernamesAndUseridAndNameAndMobileAndEmail(identifiers: z.infer<typeof identifier>, page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;
            return await client.post.findMany({
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
                            username: true,
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
        } catch (error) {
            console.error("Error in getPostByUsernamesAndUseridAndName Repository", error)
            throw new InternalServerError()
        }
    }

    async getUserPostsPages(userId: string, limit: number = 10) {
        try {
            const totalPosts = await client.post.count({
                where: {
                    userId
                }
            });
            return Math.ceil(totalPosts / limit);
        } catch (error) {
            console.error("Error in getUserPostsPages Repository", error)
            throw new InternalServerError()
        }
    } async getPostByUsernamesAndUseridAndNameAndMobileAndEmailPages(identifiers: z.infer<typeof identifier>, limit: number = 10) {
        try {
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
            return Math.ceil(totalPosts / limit);
        } catch (error) {
            console.error("Error in getPostByUsernamesAndUseridAndNameAndMobileAndEmailPages Repository", error)
            throw new InternalServerError()
        }
    }

    async getPostByTagsPages(tag: z.infer<typeof tags>, limit: number = 10) {
        try {
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
            return Math.ceil(totalPosts / limit);
        } catch (error) {
            console.error("Error in getPostByTagsPages Repository", error);
            throw new InternalServerError();
        }
    }

    async getPostByArrayOfIds(ids: string[]) {
        try {
            return await client.post.findMany({
                where: {
                    id: {
                        in: ids
                    }
                },
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
                            username: true,
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
            })
        } catch (error) {
            console.error("Error in getPostByArrayOfIds Repository", error)
            throw new InternalServerError()
        }
    }

    async getUserPostCount(userId: string) {
        try {
            return await client.post.count({
                where: {
                    userId: userId
                }
            })
        } catch (error) {
            console.error("Error in getUserPostCount Repository", error)
            throw new InternalServerError()
        }
    }

}

export const postRepository = new PostRepository()