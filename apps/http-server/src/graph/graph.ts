import neo4j, { Driver, Session } from "neo4j-driver";
import serverConfig from "../configs/server.config";

class Graph {
    private driver: Driver;

    constructor() {
        try {
            this.driver = neo4j.driver(serverConfig.NEO4J_URL, neo4j.auth.basic(serverConfig.NEO4J_USER, serverConfig.NEO4J_PASSWORD));
        }
        catch (error) {
            console.log("Error in connecting to Neo4j", error);
            throw error;
        }
    }

    getSession() {
        return this.driver.session();
    }

    async closeSession(session: Session) {
        try {
            await session.close();
        } catch (error) {
            console.error("Error in closing session", error);
            throw error;
        }
    }

    async close() {
        try {
            await this.driver.close();
        } catch (error) {
            console.error("Error in closing driver", error);
            throw error;
        }
    }

}


export const graph = new Graph();