import Redis from "ioredis";
import serverConfig from "../configs/server.config";

class RedisClient {
    private static client: Redis;
    private readonly instance: Redis;

    constructor() {
        if(!RedisClient.client){
            RedisClient.client = new Redis(serverConfig.REDIS_URL);
        }
        this.instance = RedisClient.client;
        this.instance.on('error', (error) => {
            console.error('Error connecting to redis',error);
        });
        this.instance.on('connect', () => {
            console.log('Connected to redis');
        });
    }

    get client() {
        return this.instance;
    }
}

export const redisClient = new RedisClient().client;


