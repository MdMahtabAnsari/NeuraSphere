import serverConfig from "./server.config";

export const emailConfig = {
    host: serverConfig.SMTP_HOST,
    port: serverConfig.SMTP_PORT,
    secure: serverConfig.EMAIL_SECURE,
    auth: {
        user: serverConfig.SMTP_USER,
        pass: serverConfig.SMTP_PASS,
    }
};
