import "reflect-metadata";
import express from "express";
import cors from "cors";
import { Container } from "typedi";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { EmailService } from "./services/email/EmailService";
import { db } from "./databases/db";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.post("/auth/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body as {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  };

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const existing = await db.query(
    `SELECT "user_id" FROM "user" WHERE "email" = $1`,
    [email],
  );

  if (existing.rowCount && existing.rowCount > 0) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.query(
    `
    INSERT INTO "user" ("email", "first_name", "last_name", "password_hash", "is_verified")
    VALUES ($1, $2, $3, $4, FALSE)
    `,
    [email, firstName, lastName, passwordHash],
  );

  const token = crypto.randomBytes(32).toString("hex");

  const baseUrl = process.env.APP_BASE_URL || "http://localhost:5173";
  const confirmUrl = `${baseUrl}/confirm?token=${token}`;

  const emailService = Container.get(EmailService);

  await emailService.sendConfirmationEmail(
    email,
    `${firstName} ${lastName}`,
    confirmUrl,
  );

  return res.json({ ok: true });
});

app.listen(3000);
