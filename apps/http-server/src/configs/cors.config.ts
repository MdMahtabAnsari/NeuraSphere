import serverConfig from "./server.config"
export const corsConfig = {
    origin: serverConfig.CORS_ORIGIN,
    credentials: serverConfig.CORS_CREDENTIALS,
    methods: serverConfig.CORS_METHODS,
    allowedHeaders: serverConfig.CORS_ALLOWED_HEADERS,
}