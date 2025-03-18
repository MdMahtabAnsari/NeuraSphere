import { graph } from "./graph";
import { InternalServerError} from "../utils/errors";

class ViewsGraph {

    async createView(userId: string, postId: string) {
        const session = graph.getSession();
        try {

            const query = `
                MATCH (u:User {id: $userId})
                MATCH (p:Post {id: $postId})
                MERGE (u)-[:VIEWED]->(p)
                RETURN p
            `;
            const result = await session.run(query, {
                userId: userId,
                postId: postId
            });
            console.log(result.records[0]?.get('p').properties);
            return result.records[0]?.get('p').properties;
        } catch (error) {
            console.error("Error in creating view", error);
            throw new InternalServerError("Error in creating view");
        }
    }
}

export const viewsGraph = new ViewsGraph();