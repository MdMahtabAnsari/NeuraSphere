import { graph } from "./graph";
import { InternalServerError } from "../utils/errors";

interface Post {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    content: string | null;
    isEdited: boolean;
}
class PostGraph {
    async createPost(post: Post) {
        const session = graph.getSession();
        try {
            const query = `
                MERGE (p:Post {
                    id: $id,
                    createdAt: $createdAt,
                    updatedAt: $updatedAt,
                    userId: $userId,
                    ${post.content ? `content: $content,` : ''}
                    isEdited: $isEdited
                })
                WITH p
                MATCH (u:User {id: $userId})
                MERGE (u)-[:POSTED]->(p)
                RETURN p
            `;
            const result = await session.run(query, {
                id: post.id,
                createdAt: post.createdAt.toISOString(),
                updatedAt: post.updatedAt.toISOString(),
                userId: post.userId,
                content: post.content,
                isEdited: post.isEdited
            });
            console.log(result.records[0]?.get('p').properties);
            return result.records[0]?.get('p').properties;
        } catch (error) {
            console.error("Error in creating post", error);
            throw new InternalServerError("Error in creating post");
        } finally {
            graph.closeSession(session);
        }
    }
    async updatePost(post: Post) {
        const session = graph.getSession();
        try {
            const query = `
                MATCH (p:Post {id: $id})
                SET p+= {
                    id: $id,
                    createdAt: $createdAt,
                    updatedAt: $updatedAt,
                    userId: $userId,
                    ${post.content ? `content: $content,` : ''}
                    isEdited: $isEdited
                }
                WITH p
                MATCH (u:User {id: $userId})
                MERGE (u)-[:POSTED]->(p)
                RETURN p
            `;
            const result = await session.run(query, {
                id: post.id,
                createdAt: post.createdAt.toISOString(),
                updatedAt: post.updatedAt.toISOString(),
                userId: post.userId,
                content: post.content,
                isEdited: post.isEdited
            });
            console.log(result.records[0]?.get('p').properties);
            return result.records[0]?.get('p').properties;
        } catch (error) {
            console.error("Error in updating post", error);
            throw new InternalServerError("Error in updating post");
        }
        finally {
            graph.closeSession(session);
        }
    }

    async deletePost(postId: string) {
        const session = graph.getSession();
        try {
            const query = `
                MATCH (p:Post {id: $postId})
                DETACH DELETE p
            `;
            await session.run(query, {
                postId
            });
            return true;
        } catch (error) {
            console.error("Error in deleting post", error);
            throw new InternalServerError("Error in deleting post");
        }
        finally {
            graph.closeSession(session);
        }
    }

    async getPostSuggestion(userId: string, page: number = 1, limit: number = 10) {
        const session = graph.getSession();
        try {
            const query = `MATCH (u:User {id: $userId})
            OPTIONAL MATCH (u)-[:LIKES]->(p:Post)-[:TAGGED]->(:Tag)<-[:TAGGED]-(p1:Post)
            OPTIONAL MATCH (u)-[:FOLLOWS]->(:User)-[:POSTED]->(p2:Post)-[:TAGGED]->(:Tag)<-[:TAGGED]-(p3:Post)
            OPTIONAL MATCH (u)-[:FRIENDS]->(:User)-[:POSTED]->(p4:Post)-[:TAGGED]->(:Tag)<-[:TAGGED]-(p5:Post)
            OPTIONAL MATCH (u)-[:VIEWED]->(p6:Post)-[:TAGGED]->(:Tag)<-[:TAGGED]-(p7:Post)
            WITH u,apoc.coll.toSet(
                collect(DISTINCT p1) + collect(DISTINCT p2) + collect(DISTINCT p3) + collect(DISTINCT p4) + collect(DISTINCT p5)+ collect(DISTINCT p7)
            ) as posts
            UNWIND posts as post
            WITH u,post
            WHERE NOT (u)-[:POSTED]->(post)
            AND NOT (u)-[:LIKES]->(post)
            AND NOT (u)-[:DISLIKES]->(post)
            AND NOT (u)-[:VIEWED]->(post)
            RETURN post
            ORDER BY post.createdAt DESC
            SKIP toInteger($skip)
            LIMIT toInteger($limit)
            `;
            const result = await session.run(query, { userId, skip: (page - 1) * limit, limit });
            return result.records.map(record => record.get('p').properties);
        } catch (error) {
            console.error("Error in getting post suggestion", error);
            throw new InternalServerError("Error in getting post suggestion");
        } finally {
            graph.closeSession(session);
        }

    }

    async getPostSuggestionPages(userId: string, limit: number = 10) {
        const session = graph.getSession();
        try {
            const query = `MATCH (u:User {id: $userId})
            OPTIONAL MATCH (u)-[:LIKES]->(p:Post)-[:TAGGED]->(:Tag)<-[:TAGGED]-(p1:Post)
            OPTIONAL MATCH (u)-[:FOLLOWS]->(:User)-[:POSTED]->(p2:Post)-[:TAGGED]->(:Tag)<-[:TAGGED]-(p3:Post)
            OPTIONAL MATCH (u)-[:FRIENDS]->(:User)-[:POSTED]->(p4:Post)-[:TAGGED]->(:Tag)<-[:TAGGED]-(p5:Post)
            OPTIONAL MATCH (u)-[:VIEWED]->(p6:Post)-[:TAGGED]->(:Tag)<-[:TAGGED]-(p7:Post)
            WITH u,apoc.coll.toSet(
                collect(DISTINCT p1) + collect(DISTINCT p2) + collect(DISTINCT p3) + collect(DISTINCT p4) + collect(DISTINCT p5) + collect(DISTINCT p7)
            ) as posts
            UNWIND posts as post
            WITH u,post
            WHERE NOT (u)-[:POSTED]->(post)
            AND NOT (u)-[:LIKES]->(post)
            AND NOT (u)-[:DISLIKES]->(post)
            AND NOT (u)-[:VIEWED]->(post)
            RETURN COUNT(DISTINCT post) as count
            `;
            const result = await session.run(query, { userId });
            const count = result.records[0]?.get('count').toNumber();
            return Math.ceil(count / limit);
        } catch (error) {
            console.error("Error in getting post suggestion pages", error);
            throw new InternalServerError("Error in getting post suggestion pages");
        }
        finally {
            graph.closeSession(session);
        }
    }

    async getViralPosts(page: number = 1, limit: number = 10) {
        const session = graph.getSession();
        try{
            const query = `MATCH (p:Post)
            OPTIONAL MATCH (p)<-[v:VIEWED]-(:User)
            OPTIONAL MATCH (p)<-[l:LIKES]-(:User)
            WITH p, COUNT(DISTINCT v) as views, COUNT(DISTINCT l) as likes
            ORDER BY views DESC, likes DESC
            SKIP toInteger($skip)
            LIMIT toInteger($limit)
            RETURN DISTINCT p
            `;
            const result = await session.run(query, { skip: (page - 1) * limit, limit });
            return result.records.map(record => record.get('p').properties);
        } catch (error) {
            console.error("Error in getting viral posts", error);
            throw new InternalServerError("Error in getting viral posts");

        }finally {
            graph.closeSession(session);
        }
    }

    async getViralPostsPages(limit: number = 10) {
        const session = graph.getSession();
        try{
            const query = `MATCH (p:Post)
            OPTIONAL MATCH (p)<-[v:VIEWED]-(:User)
            OPTIONAL MATCH (p)<-[l:LIKES]-(:User)
            WITH p, COUNT(DISTINCT v) as views, COUNT(DISTINCT l) as likes
            RETURN COUNT(DISTINCT p) as count
            `;
            const result = await session.run(query);
            const count = result.records[0]?.get('count').toNumber();
            return Math.ceil(count / limit);
        } catch (error) {
            console.error("Error in getting viral posts pages", error);
            throw new InternalServerError("Error in getting viral posts pages");

        }finally {
            graph.closeSession(session);
        }
    }

}


export const postGraph = new PostGraph();