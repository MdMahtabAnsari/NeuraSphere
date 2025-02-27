import Handlebars from "handlebars";
import mjml2html from 'mjml';
import fs from 'fs';
import path from 'path';

export interface MJMLOtp{
    templateName:'otp';
    data:{
        name:string;
        otp:string;
        expiresIn:number;
    }
}
export interface MJMLWelcome{
    templateName:'welcome';
    data:{
        name:string;
    }
}


class EmailTemplateService{

    async mjmlToHtml(template:MJMLOtp|MJMLWelcome){
        try{
            const templatePath = path.join(__dirname,`../../email-templates/${template.templateName}.mjml`);
            const mjmlTemplate = await fs.promises.readFile(templatePath,'utf-8');
            const mjml = Handlebars.compile(mjmlTemplate)(template.data);
            const {html} = mjml2html(mjml);
            return html;
        }catch(error){
            console.log(`Error in mjmlToHtml Services: ${error}`);
            throw error;
        }

    }
}


export const emailTemplateService = new EmailTemplateService();