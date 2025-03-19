import { graph } from "./graph";
import { InternalServerError } from "../utils/errors";

class FollowerGraph {
    async followUser(userId: string, followingId: string) {
        const session = graph.getSession()
        try {
            const query = `
                MATCH (a:User {id: $userId})
                MATCH (b:User {id: $followingId})
                MERGE (a)-[:FOLLOWS]->(b)
            `
            await session.run(query, { userId, followingId })
            return true;
        } catch (error) {
            console.error("Error following user Graph", error)
            throw new InternalServerError()
        } finally {
            session.close()
        }
    }

    async unfollowUser(userId: string, followingId: string) {
        const session = graph.getSession()
        try {
            const query = `
                MATCH (a:User {id: $userId})
                MATCH (b:User {id: $followingId})
                OPTIONAL MATCH (a)-[r:FOLLOWS]->(b)
                DELETE r
            `
            await session.run(query, { userId, followingId })
            return true;
        } catch (error) {
            console.error("Error unfollowing user Graph", error)
            throw new InternalServerError()
        } finally {
            session.close()
        }
    }

    async getMutualFollowers(userId: string, followingId: string, page: number = 1, limit: number = 10) {
        const session = graph.getSession()
        try {
            const query = `
                MATCH (a:User {id: $userId})-[:FOLLOWS]->(m:User)<-[:FOLLOWS]-(b:User {id: $followingId})
                SKIP toInteger($skip)
                LIMIT toInteger($limit)
                RETURN m
            `
            const result = await session.run(query, { userId, followingId, skip: (page - 1) * limit, limit })
            return result.records.map(record => record.get('m').properties).map((user: any) => {
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image
                }
            });
        } catch (error) {
            console.error("Error getting mutual followers Graph", error)
            throw new InternalServerError()
        } finally {
            session.close()
        }
    }

    async getMutualFollowersPages(userId: string,followingId:string,limit: number = 10) {
        const session = graph.getSession()
        try {
            const query = `
                MATCH (a:User {id: $userId})-[:FOLLOWS]->(m:User)<-[:FOLLOWS]-(b:User {id: $followingId})
                RETURN count(m) as count
            `
            const result = await session.run(query, { userId, followingId })
            const count = result.records[0]?.get('count').toNumber()
            return Math.ceil(count / limit);
        } catch (error) {
            console.error("Error getting followers pages Graph", error)
            throw new InternalServerError()
        } finally {
            session.close()
        }
    }

    async getFollwersSuggestions(userId: string, page: number = 1, limit: number = 10) {
        const session = graph.getSession()
        try {
            const query = `
                MATCH (a:User {id: $userId})
                OPTIONAL MATCH (a)-[:FOLLOWS]->(:User)-[:FOLLOWS]->(b:User)
                OPTIONAL MATCH (a)-[:FRINEDS]->(:User)-[:FRIENDS]->(b1:User)
                OPTIONAL MATCH (a)-[:FRIENDS]->(:User)-[:FOLLOWS]->(b2:User)
                OPTIONAL MATCH (a)-[:INTERESTED]->(:Interest)<-[:INTERESTED]-(b3:User)
                WITH a, apoc.coll.toSet(collect(DISTINCT b)+collect(DISTINCT b1)+collect(DISTINCT b2)+collect(DISTINCT b3)) as suggestions
                UNWIND suggestions as user
                WITH a, user
                WHERE NOT (a)-[:FOLLOWS]->(user)
                SKIP toInteger($skip)
                LIMIT toInteger($limit)
                RETURN user
            `;
            const result = await session.run(query, { userId, skip: (page - 1) * limit, limit })
            return result.records.map(record => record.get('user').properties).map((user: any) => {
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image
                }
            }
            )
        } catch (error) {
            console.error("Error getting followers suggestions Graph", error)
            throw new InternalServerError()
        } finally {
            session.close()
        }
    }

    async getFollowersSuggestionsPages(userId: string, limit: number = 10) {
        const session = graph.getSession()
        try {
            const query = `
                MATCH (a:User {id: $userId})
                OPTIONAL MATCH (a)-[:FOLLOWS]->(:User)-[:FOLLOWS]->(b:User)
                OPTIONAL MATCH (a)-[:FRINEDS]->(:User)-[:FRIENDS]->(b1:User)
                OPTIONAL MATCH (a)-[:FRIENDS]->(:User)-[:FOLLOWS]->(b2:User)
                OPTIONAL MATCH (a)-[:INTERESTED]->(:Interest)<-[:INTERESTED]-(b3:User)
                OPTIONAL MATCH (a)-[:LIKES]->(:Post)<-[:POSTED]-(b4:User)
                OPTIONAL MATCH (a)-[:VIEWED]->(:Post)<-[:POSTED]-(b5:User)
                WITH a, apoc.coll.toSet(collect(DISTINCT b)+collect(DISTINCT b1)+collect(DISTINCT b2)+collect(DISTINCT b3)+collect(DISTINCT b4)+collect(DISTINCT b5)) as suggestions
                UNWIND suggestions as user
                WITH a, user
                WHERE NOT (a)-[:FOLLOWS]->(user)
                RETURN count(user) as count
            `
            const result = await session.run(query, { userId })
            const count = result.records[0]?.get('count').toNumber()
            return Math.ceil(count / limit)
        } catch (error) {
            console.error("Error getting followers suggestions pages Graph", error)
            throw new InternalServerError()
        } finally {
            session.close()
        }
    }

}

export const followerGraph = new FollowerGraph();