import { graph } from "./graph";
import { InternalServerError } from "../utils/errors";

class FriendGraph{
    async createFriendRequest(userId: string, friendId: string) {
        const session = graph.getSession();
        try {
            const query = `
                MATCH (u:User {id: $userId})
                MATCH (f:User {id: $friendId})
                OPTIONAL MATCH (u)-[s:BLOCKED]->(f)
                DELETE s
                WITH u,f
                OPTIONAL MATCH (u)-[r:REJECTED]->(f)
                DELETE r
                WITH u,f
                MERGE (u)-[:REQUESTED]->(f)
                RETURN u,f
            `;
            const result = await session.run(query, {
                userId,
                friendId
            });
            console.log(result.records[0]?.get('u').properties);
            return result.records[0]?.get('u').properties;
        } catch (error) {
            console.error("Error in creating friend request", error);
            throw new InternalServerError("Error in creating friend request");
        } finally {
            graph.closeSession(session);
        }
    }
    async acceptFriendRequest(userId: string, friendId: string) {
        const session = graph.getSession();
        try {
            const query = `
                MATCH (u:User {id: $userId})
                MATCH (f:User {id: $friendId})
                OPTIONAL MATCH (f)-[s:REQUESTED]->(u)
                DELETE s
                WITH u,f
                MERGE (u)-[:FRIENDS]->(f)
                MERGE (f)-[:FRIENDS]->(u)
                RETURN u,f
            `;
            const result = await session.run(query, {
                userId,
                friendId
            });
            console.log(result.records[0]?.get('u').properties);
            return result.records[0]?.get('u').properties;
        } catch (error) {
            console.error("Error in accepting friend request", error);
            throw new InternalServerError("Error in accepting friend request");
        } finally {
            graph.closeSession(session);
        }
    }

    async blockFriend(userId: string, friendId: string) {
        const session = graph.getSession();
        try {
            const query = `
                MATCH (u:User {id: $userId})
                MATCH (f:User {id: $friendId})
                OPTIONAL MATCH (u)-[r:REQUESTED]->(f)
                DELETE r
                WITH u,f
                OPTIONAL MATCH (f)-[s:REQUESTED]->(u)
                DELETE s
                WITH u,f
                OPTIONAL MATCH (u)-[x:FRIENDS]->(f)
                DELETE x
                WITH u,f
                OPTIONAL MATCH (f)-[y:FRIENDS]->(u)
                DELETE y
                WITH u,f
                MERGE (u)-[:BLOCKED]->(f)
                RETURN u,f
            `;
            const result = await session.run(query, {
                userId,
                friendId
            });
            console.log(result.records[0]?.get('u').properties);
            return result.records[0]?.get('u').properties;
        } catch (error) {
            console.error("Error in blocking friend", error);
            throw new InternalServerError("Error in blocking friend");
        } finally {
            graph.closeSession(session);
        }
    }
    async rejectFriendRequest(userId: string, friendId: string) {
        const session = graph.getSession();
        try {
            const query = `
                MATCH (u:User {id: $userId})
                MATCH (f:User {id: $friendId})
                OPTIONAL MATCH (f)-[s:REQUESTED]->(u)
                DELETE s
                WITH u,f
                MERGE (u)-[:REJECTED]->(f)
                RETURN u,f
            `;
            const result = await session.run(query, {
                userId,
                friendId
            });
            console.log(result.records[0]?.get('u').properties);
            return result.records[0]?.get('u').properties;
        } catch (error) {
            console.error("Error in rejecting friend request", error);
            throw new InternalServerError("Error in rejecting friend request");
        } finally {
            graph.closeSession(session);
        }
    }

    async unBlockFriend(userId: string, friendId: string) {
        const session = graph.getSession();
        try {
            const query = `
                MATCH (u:User {id: $userId})
                MATCH (f:User {id: $friendId})
                OPTIONAL MATCH (u)-[r:BLOCKED]->(f)
                DELETE r
                RETURN u,f
            `;
            const result = await session.run(query, {
                userId,
                friendId
            });
            console.log(result.records[0]?.get('u').properties);
            return result.records[0]?.get('u').properties;
        } catch (error) {
            console.error("Error in unblocking friend", error);
            throw new InternalServerError("Error in unblocking friend");
        } finally {
            graph.closeSession(session);
        }
    }

    async deleteFriend(userId: string, friendId: string) {
        const session = graph.getSession();
        try {
            const query = `
                MATCH (u:User {id: $userId})
                MATCH (f:User {id: $friendId})
                OPTIONAL MATCH (u)-[r:FRIENDS]->(f)
                DELETE r
                WITH u,f
                OPTIONAL MATCH (f)-[s:FRIENDS]->(u)
                DELETE s
                WITH u,f
                RETURN u,f
            `;
            const result = await session.run(query, {
                userId,
                friendId
            });
            console.log(result.records[0]?.get('u').properties);
            return result.records[0]?.get('u').properties;
        } catch (error) {
            console.error("Error in deleting friend", error);
            throw new InternalServerError("Error in deleting friend");
        } finally {
            graph.closeSession(session);
        }
    }

    async getMutualFriends(userId: string, friendId: string,page:number=1,limit:number=10) {
        const session = graph.getSession();
        try {
            const query = `
                MATCH (u:User {id: $userId})-[:FRIENDS]->(m:User)<-[:FRIENDS]-(f:User {id: $friendId})
                SKIP toInteger($skip)
                LIMIT toInteger($limit)
                RETURN m
            `;
            const result = await session.run(query, {
                userId,
                friendId,
                skip:(page-1)*limit,
                limit
            });
            console.log(result.records.map(record => record.get('m').properties));
            return result.records.map(record => record.get('m').properties);
        } catch (error) {
            console.error("Error in getting mutual friends", error);
            throw new InternalServerError("Error in getting mutual friends");
        } finally {
            graph.closeSession(session);
        }
    }

    async getMutualFriendsPages(userId: string, friendId: string,limit:number=10) {
        const session = graph.getSession();
        try {
            const query = `
                MATCH (u:User {id: $userId})-[:FRIENDS]->(m:User)<-[:FRIENDS]-(f:User {id: $friendId})
                RETURN COUNT(m) as count
            `;
            const result = await session.run(query, {
                userId,
                friendId
            });
            const count = result.records[0]?.get('count').toNumber();
            return Math.ceil(count/limit);
        } catch (error) {
            console.error("Error in getting mutual friends pages", error);
            throw new InternalServerError("Error in getting mutual friends pages");
        } finally {
            graph.closeSession(session);
        }
    }

    async getFriendSuggestions(userId: string,page:number=1,limit:number=10) {
        const session = graph.getSession();
        try {
            const query = `
                MATCH (u:User {id: $userId})
                OPTIONAL MATCH (u)-[:FRIENDS]->(:User)-[:FRIENDS]->(m:User)
                OPTIONAL MATCH (u)-[:INTERESTED]->(:Interest)<-[:INTERESTED_IN]-(m1:User)
                WITH u,apoc.coll.toSet(collect(DISTINCT m) + collect(DISTINCT m1)) as friends
                UNWIND friends as friend
                WITH u,friend
                WHERE NOT (u)-[:FRIENDS]->(friend)
                AND NOT (u)-[:REQUESTED]->(friend)
                AND NOT (u)-[:BLOCKED]->(friend)
                AND NOT (friend)-[:BLOCKED]->(u)
                AND NOT (u)-[:REQUESTED]->(friend)
                AND NOT (friend)-[:REQUESTED]->(u)
                AND friend.isVerified=true
                SKIP toInteger($skip)
                LIMIT toInteger($limit)
                RETURN friend
            `;
            const result = await session.run(query, {
                userId,
                skip:(page-1)*limit,
                limit
            });
            console.log(result.records.map(record => record.get('friend').properties));
            return result.records.map(record => record.get('friend').properties);
        } catch (error) {
            console.error("Error in getting friend suggestions", error);
            throw new InternalServerError("Error in getting friend suggestions");
        }
        finally {
            graph.closeSession(session);
        }
    }

    async getFriendSuggestionsPages(userId: string,limit:number=10) {
        const session = graph.getSession();
        try {
            const query = `
                MATCH (u:User {id: $userId})
                OPTIONAL MATCH (u)-[:FRIENDS]->(:User)-[:FRIENDS]->(m:User)
                OPTIONAL MATCH (u)-[:INTERESTED]->(:Interest)<-[:INTERESTED_IN]-(m1:User)
                WITH u,apoc.coll.toSet(collect(DISTINCT m) + collect(DISTINCT m1)) as friends
                UNWIND friends as friend
                WITH u,friend
                WHERE NOT (u)-[:FRIENDS]->(friend)
                AND NOT (u)-[:REQUESTED]->(friend)
                AND NOT (u)-[:BLOCKED]->(friend)
                AND NOT (friend)-[:BLOCKED]->(u)
                AND NOT (u)-[:REQUESTED]->(friend)
                AND NOT (friend)-[:REQUESTED]->(u)
                AND friend.isVerified=true
                RETURN COUNT(friend) as count
            `;
            const result = await session.run(query, {
                userId
            });
            const count = result.records[0]?.get('count').toNumber();
            return Math.ceil(count/limit);
        } catch (error) {
            console.error("Error in getting friend suggestions pages", error);
            throw new InternalServerError("Error in getting friend suggestions pages");
        }
        finally {
            graph.closeSession(session);
        }
    }

    async removeFriend(userId: string, friendId: string) {
        const session = graph.getSession();
        try {
            const query = `
                MATCH (u:User {id: $userId})
                MATCH (f:User {id: $friendId})
                OPTIONAL MATCH (u)-[r:FRIENDS]->(f)
                DELETE r
                WITH u,f
                OPTIONAL MATCH (f)-[s:FRIENDS]->(u)
                DELETE s
                RETURN u,f
            `;
            const result = await session.run(query, {
                userId,
                friendId
            });
            console.log(result.records[0]?.get('u').properties);
            return result.records[0]?.get('u').properties;
        } catch (error) {
            console.error("Error in removing friend", error);
            throw new InternalServerError("Error in removing friend");
        } finally {
            graph.closeSession(session);
        }
    }
}

export const friendGraph = new FriendGraph();