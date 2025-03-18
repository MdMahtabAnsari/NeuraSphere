import { graph } from "./graph";
import { InternalServerError } from "../utils/errors";
interface Interest {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
class InterestGraph {
    async createUserInterests(userId: string, data: Interest[]) {
        const session = graph.getSession();
        try {
            const query = `
                MATCH (u:User {id: $userId})
                UNWIND $data as interest
                MERGE (i:Interest {id: interest.id})
                ON CREATE SET
                    i.name = interest.name,
                    i.createdAt = interest.createdAt,
                    i.updatedAt = interest.updatedAt
                MERGE (u)-[:INTERESTED]->(i)
                RETURN i
            `;
            const result = await session.run(query, {
                userId: userId,
                data: data.map(interest => ({
                    id: interest.id,
                    name: interest.name,
                    createdAt: interest.createdAt.toISOString(),
                    updatedAt: interest.updatedAt.toISOString()
                }))
            });
            console.log(result.records.map(record => record.get('i').properties));
            return result.records.map(record => record.get('i').properties);
        } catch (error) {
            console.error("Error in creating user interests", error);
            throw new InternalServerError("Error in creating user interests");
        } finally {
            graph.closeSession(session);
        }
    }
    async updateUserInterests(userId: string, data: Interest[]) {
        const session = graph.getSession();
        try {
            const query = `
                MATCH (u:User {id: $userId})-[r:INTERESTED]->(i:Interest)
                DELETE r
                WITH u
                UNWIND $data as interest
                MERGE (i:Interest {id: interest.id})
                ON CREATE SET
                    i.name = interest.name,
                    i.createdAt = interest.createdAt,
                    i.updatedAt = interest.updatedAt
                MERGE (u)-[:INTERESTED]->(i)
                RETURN i
            `;
            const result = await session.run(query, {
                userId: userId,
                data: data.map(interest => ({
                    id: interest.id,
                    name: interest.name,
                    createdAt: interest.createdAt.toISOString(),
                    updatedAt: interest.updatedAt.toISOString()
                }))
            });
            console.log(result.records.map(record => record.get('i').properties));
            return result.records.map(record => record.get('i').properties);
        } catch (error) {
            console.error("Error in updating user interests", error);
            throw new InternalServerError("Error in updating user interests");
        } finally {
            graph.closeSession(session);
        }
    }

    async deleteUserInterests(userId: string) {
        const session = graph.getSession();
        try {
            const query = `
                MATCH (u:User {id: $userId})-[r:INTERESTED]->(i:Interest)
                DELETE r
            `;
            await session.run(query, {
                userId: userId
            });
            return true;
        }
        catch (error) {
            console.error("Error in deleting user interests", error);
            throw new InternalServerError("Error in deleting user interests");
        } finally {
            graph.closeSession(session);
        }
    }
}

export const interestGraph = new InterestGraph();