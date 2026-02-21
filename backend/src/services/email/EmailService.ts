import { Service } from "typedi";
import nodemailer from "nodemailer";
import mjml2html from "mjml";
import fs from "fs/promises";
import path from "path";

@Service()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        const host = process.env.SMTP_HOST;
        const port = Number(process.env.SMTP_PORT || "587");
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;

        if (!host) throw new Error("SMTP_HOST is missing");
        if (!user) throw new Error("SMTP_USER is missing");
        if (!pass) throw new Error("SMTP_PASS is missing");

        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
            requireTLS: port === 587,
            tls: { minVersion: "TLSv1.2" },
        });
    }

    public async sendConfirmationEmail(to: string, first_name: string, confirm_url: string) {
        await this.transporter.verify();

        const templatePath = path.join(
            process.cwd(),
            "src",
            "services",
            "email",
            "templates",
            "email.mjml"
        );

        const mjmlTemplate = await fs.readFile(templatePath, "utf8");

        const mjmlWithVars = mjmlTemplate.replace(
            /{{\s*([a-zA-Z0-9_]+)\s*}}/g,
            (_, key) => ({ first_name, confirm_url } as Record<string, string>)[key] ?? ""
        );

        const { html } = mjml2html(mjmlWithVars, { validationLevel: "soft" });

        const from = process.env.DEFAULT_FROM || process.env.SMTP_USER;
        if (!from) throw new Error("DEFAULT_FROM or SMTP_USER must be set");

        await this.transporter.sendMail({
            from: `"Portfolio" <${from}>`,
            to,
            subject: "Confirm your account",
            html,
        });
    }
}