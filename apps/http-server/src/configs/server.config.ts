import {config} from "dotenv";
config();

const serverConfig = {
    PORT: process.env.PORT || "3001",
    JWT_SECRET: process.env.JWT_SECRET || "9c74004e273ddfbaab097e2a40cffdb572ecd355a4c212d5b752dd5f5d365dd1",
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    NODE_ENV: process.env.NODE_ENV || "development",
    SMTP_HOST: process.env.SMTP_HOST || "smtp-relay.brevo.com",
    SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    SMTP_USER: process.env.SMTP_USER || "dummyUser",
    SMTP_PASS: process.env.SMTP_PASS || "dummyPass",
    SMTP_FROM: process.env.SMTP_FROM || "m.a.raj58232@gmail.com",
    EMAIL_SECURE: process.env.EMAIL_SECURE === "true",
    OTP_EXPIRES_IN: process.env.OTP_EXPIRES_IN || "10m",
    REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
}

export default serverConfig;