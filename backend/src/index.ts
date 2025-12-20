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

  const created = await db.query(
    `
    INSERT INTO "user" ("email", "first_name", "last_name", "password_hash", "is_verified")
    VALUES ($1, $2, $3, $4, FALSE)
    RETURNING "user_id"
    `,
    [email, firstName, lastName, passwordHash],
  );

  const userId = created.rows[0].user_id;

  const token = crypto.randomBytes(32).toString("hex");

  await db.query(
    `
    INSERT INTO "email_verification" ("user_id", "token", "expires_at")
    VALUES ($1, $2, NOW() + INTERVAL '24 hours')
    `,
    [userId, token],
  );

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

app.get("/auth/confirm", async (req, res) => {
  const token = String(req.query.token || "");

  if (!token) {
    return res.status(400).json({ ok: false, error: "Missing token" });
  }

  const found = await db.query(
    `
    SELECT "email_verification_id", "user_id", "expires_at", "used_at"
    FROM "email_verification"
    WHERE "token" = $1
    `,
    [token],
  );

  if (!found.rowCount) {
    return res.status(400).json({ ok: false, error: "Invalid token" });
  }

  const row = found.rows[0];

  if (row.used_at) {
    return res.json({ ok: true });
  }

  if (new Date(row.expires_at).getTime() < Date.now()) {
    return res.status(400).json({ ok: false, error: "Token expired" });
  }

  await db.query(
    `UPDATE "user" SET "is_verified" = TRUE WHERE "user_id" = $1`,
    [row.user_id],
  );

  await db.query(
    `
    UPDATE "email_verification"
    SET "used_at" = NOW()
    WHERE "email_verification_id" = $1
    `,
    [row.email_verification_id],
  );

  return res.json({ ok: true });
});

app.listen(3000);
