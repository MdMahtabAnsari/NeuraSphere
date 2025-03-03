import { z } from "zod"
import { InternalServerError, NotFoundError } from "../utils/errors"
import { client, Prisma } from "@workspace/database/client"
import { media,removeMedia } from "@workspace/schema/post"

class MediaRepository {

    async createMedia(postId: string, data: z.infer<typeof media>) {
        try {
            await Promise.all(data.map(async (media) => {
                await client.media.upsert({
                    where: { postId_url: { postId: postId, url: media.url } },
                    update: {},
                    create: { url: media.url, type: media.type,postId:postId }
                })
            }
            ));
            return true
        } catch (error) {
            console.log(`Error in createMedia repository`, error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new NotFoundError("Post not found")
                }
                if (error.code === "P2025") {
                    throw new NotFoundError("Invalid media")
                }
            }
            throw new InternalServerError()
        }
    }
    async removeMedia(data: z.infer<typeof removeMedia>) {
        try {
            await client.media.deleteMany({
                where: {
                    id: {
                        in: data
                    }
                }
            })
            return true
        } catch (error) {
            console.log(`Error in removeMedia repository`, error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new NotFoundError("Post not found")
                }
                if (error.code === "P2025") {
                    throw new NotFoundError("Invalid media")
                }
            }
            throw new InternalServerError()
        }
    }
}

export const mediaRepository = new MediaRepository()