import { Service } from "typedi";
import nodemailer from "nodemailer";
import mjml2html from "mjml";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

@Service()
export class EmailService {
    private transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    public async sendConfirmationEmail(
        to: string,
        first_name: string,
        confirm_url: string,
    ) {
        const templatePath = path.join(
            __dirname,
            "templates",
            "email.mjml",
        );

        const mjmlTemplate = await fs.readFile(templatePath, "utf8");

        const mjmlWithVars = mjmlTemplate.replace(
            /{{\s*([a-zA-Z0-9_]+)\s*}}/g,
            (_, key) =>
                ({ first_name, confirm_url } as Record<string, string>)[key] ?? "",
        );

        const { html } = mjml2html(mjmlWithVars, {
            validationLevel: "soft",
        });

        await this.transporter.sendMail({
            from: `"Portfolio" <no-reply@example.com>`,
            to,
            subject: "Confirm your account",
            html,
        });
    }
}
