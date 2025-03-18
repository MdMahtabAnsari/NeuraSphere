import { graph } from "./graph";
import { InternalServerError } from "../utils/errors";

interface Tag {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
}
class TagGraph {

    async createPostTags(postId: string, data: Tag[]) {
        const session = graph.getSession();
        try {
            const query = `
                MATCH (p:Post {id: $postId})
                UNWIND $data as tag
                MERGE (t:Tag {id: tag.id})
                ON CREATE SET
                    t.name = tag.name,
                    t.createdAt = tag.createdAt,
                    t.updatedAt = tag.updatedAt
                MERGE (p)-[:TAGGED]->(t)
                RETURN t
                `;
            const result = await session.run(query, {
                postId: postId,
                data: data.map(tag => ({
                    id: tag.id,
                    name: tag.name,
                    createdAt: tag.createdAt.toISOString(),
                    updatedAt: tag.updatedAt.toISOString()
                }))
            });
            console.log(result.records.map(record => record.get('t').properties));
            return result.records.map(record => record.get('t').properties);
        } catch (error) {
            console.error("Error in creating post tags", error);
            throw new InternalServerError("Error in creating post tags");
        } finally {
            graph.closeSession(session);
        }
    }

    async updatePostTags(postId: string, data: Tag[]) {
        const session = graph.getSession();
        try {
            const query = `
                MATCH (p:Post {id: $postId})-[r:TAGGED]->(t:Tag)
                DELETE r
                WITH p
                UNWIND $data as tag
                MERGE (t:Tag {id: tag.id})
                ON CREATE SET
                    t.name = tag.name,
                    t.createdAt = tag.createdAt,
                    t.updatedAt = tag.updatedAt
                MERGE (p)-[:TAGGED]->(t)
                RETURN t
                `;
            const result = await session.run(query, {
                postId: postId,
                data: data.map(tag => ({
                    id: tag.id,
                    name: tag.name,
                    createdAt: tag.createdAt.toISOString(),
                    updatedAt: tag.updatedAt.toISOString()
                }))
            });
            console.log(result.records.map(record => record.get('t').properties));
            return result.records.map(record => record.get('t').properties);
        } catch (error) {
            console.error("Error in updating post tags", error);
            throw new InternalServerError("Error in updating post tags");
        } finally {
            graph.closeSession(session);
        }
    }

    async deletePostTags(postId: string) {
        const session = graph.getSession();
        try {
            const query = `
                MATCH (p:Post {id: $postId})-[r:TAGGED]->(t:Tag)
                DELETE r
            `;
            await session.run(query, {
                postId: postId
            });
            return true;
        } catch (error) {
            console.error("Error in deleting post tags", error);
            throw new InternalServerError("Error in deleting post tags");
        } finally {
            graph.closeSession(session);
        }
    }
}

export const tagGraph = new TagGraph();