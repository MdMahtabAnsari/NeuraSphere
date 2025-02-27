import nodemailer from 'nodemailer';
import { emailConfig } from '../configs/email.config';
import { MJMLOtp,MJMLWelcome,emailTemplateService } from './emailTemplate.service';
import serverConfig from '../configs/server.config';

interface EmailData{
    to:string;
    template:MJMLOtp|MJMLWelcome;
}

class EmailService{
    private static transporter:nodemailer.Transporter;
    private readonly localTransporter:nodemailer.Transporter;
    constructor(){
        if(!EmailService.transporter){
            EmailService.transporter = nodemailer.createTransport(emailConfig);
        }
        this.localTransporter = EmailService.transporter;
        this.localTransporter.verify((error)=>{
            if(error){
                console.error(`Error in EmailService: ${error}`);
            }else{
                console.log('Email Service is ready');
            }
        });
    }

    async sendMail(data:EmailData){
        try{
            const html = await emailTemplateService.mjmlToHtml(data.template);
            await this.localTransporter.sendMail({
                from:serverConfig.SMTP_FROM,
                to:data.to,
                subject:data.template.templateName,
                html
            });
        }catch(error){
            console.error(`Error in sendMail Service: ${error}`);
            throw error;
        }
    }

}

export const emailService = new EmailService();