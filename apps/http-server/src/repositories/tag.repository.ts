import { z } from "zod"
import { InternalServerError, NotFoundError, BadRequestError } from "../utils/errors"
import { client, Prisma } from "@workspace/database/client"
import { tags } from "@workspace/schema/post"

class TagRepository {
    async createTags(postId: string, data: z.infer<typeof tags>) {
        try {
            return await Promise.all(data.map(async (tag) => {
                const tagData = await client.tag.upsert({
                    where: { name: tag },
                    update: {},
                    create: { name: tag },
                })
                await client.post_Tags.create({
                    data: {
                        postId: postId,
                        tagId: tagData.id
                    }
                })
                return tagData
            }
            ));
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw new BadRequestError("Invalid tag")
                }
            }
            throw new InternalServerError()
        }
    }

    async updateTags(postId: string, data: z.infer<typeof tags>) {
        try {
            await client.post_Tags.deleteMany({
                where: {
                    postId: postId
                }
            })
            return await this.createTags(postId, data)
        } catch (error) {
            throw new InternalServerError()
        }
    }

    async deleteTags(postId: string) {
        try {
            await client.post_Tags.deleteMany({
                where: {
                    postId: postId
                }
            })
            return true
        } catch (error) {
            throw new InternalServerError()
        }
    }

}

export const tagRepository = new TagRepository()