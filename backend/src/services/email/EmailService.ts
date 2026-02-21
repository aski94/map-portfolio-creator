import { Service } from "typedi";
import { Resend } from "resend";
import mjml2html from "mjml";
import fs from "fs/promises";
import path from "path";

@Service()
export class EmailService {
    private resend: Resend;

    constructor() {
        const key = process.env.RESEND_API_KEY;
        if (!key) throw new Error("RESEND_API_KEY is missing");
        this.resend = new Resend(key);
    }

    public async sendConfirmationEmail(
        to: string,
        first_name: string,
        confirm_url: string
    ) {
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
            (_, key) =>
                ({ first_name, confirm_url } as Record<string, string>)[key] ?? ""
        );

        const { html } = mjml2html(mjmlWithVars, { validationLevel: "soft" });

        const from = process.env.DEFAULT_FROM || "Portfable <no-reply@portfable.xyz>";

        await this.resend.emails.send({
            from,
            to,
            subject: "Confirm your account",
            html,
        });
    }
}