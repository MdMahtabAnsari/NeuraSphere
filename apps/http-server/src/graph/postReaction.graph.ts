import { graph } from "./graph";
import { InternalServerError } from "../utils/errors";

class PostReactionGraph {

    async likePost(postId: string, userId: string) {
        const session = graph.getSession();
        try {
            const query = `
                MATCH (p:Post {id: $postId})
                MATCH (u:User {id: $userId})
                OPTIONAL MATCH (u)-[r:DISLIKES]->(p)
                DELETE r
                WITH p,u
                MERGE (u)-[:LIKES]->(p)
                RETURN p
                `;
            const result = await session.run(query, {
                postId: postId,
                userId: userId
            });
            console.log(result.records.map(record => record.get('p').properties));
            return result.records.map(record => record.get('p').properties);
        } catch (error) {
            console.error("Error in liking post", error);
            throw new InternalServerError("Error in liking post");
        } finally {
            graph.closeSession(session);
        }
    }

    async dislikePost(postId: string, userId: string) {
        const session = graph.getSession();
        try {
            const query = `
                MATCH (p:Post {id: $postId})
                MATCH (u:User {id: $userId})
                OPTIONAL MATCH (u)-[r:LIKES]->(p)
                DELETE r
                WITH p,u
                MERGE (u)-[:DISLIKES]->(p)
                RETURN p
                `;
            const result = await session.run(query, {
                postId: postId,
                userId: userId
            });
            console.log(result.records.map(record => record.get('p').properties));
            return result.records.map(record => record.get('p').properties);
        } catch (error) {
            console.error("Error in disliking post", error);
            throw new InternalServerError("Error in disliking post");
        } finally {
            graph.closeSession(session);
        }
    }

    async unlikePost(postId: string, userId: string) {
        const session = graph.getSession();
        try {
            const query = `
                MATCH (p:Post {id: $postId})
                MATCH (u:User {id: $userId})
                OPTIONAL MATCH (u)-[r:LIKES]->(p)
                DELETE r
                RETURN p
                `;
            const result = await session.run(query, {
                postId: postId,
                userId: userId
            });
            console.log(result.records.map(record => record.get('p').properties));
            return result.records.map(record => record.get('p').properties);
        } catch (error) {
            console.error("Error in unliking post", error);
            throw new InternalServerError("Error in unliking post");
        } finally {
            graph.closeSession(session);
        }
    }

    async removeDislikePost(postId: string, userId: string) {
        const session = graph.getSession();
        try {
            const query = `
                MATCH (p:Post {id: $postId})
                MATCH (u:User {id: $userId})
                OPTIONAL MATCH (u)-[r:DISLIKES]->(p)
                DELETE r
                RETURN p
                `;
            const result = await session.run(query, {
                postId: postId,
                userId: userId
            });
            console.log(result.records.map(record => record.get('p').properties));
            return result.records.map(record => record.get('p').properties);
        } catch (error) {
            console.error("Error in removing dislike from post", error);
            throw new InternalServerError("Error in removing dislike from post");
        } finally {
            graph.closeSession(session);
        }
    }
}

export const postReactionGraph = new PostReactionGraph();