import "reflect-metadata";
import express from "express";
import cors from "cors";
import { Container } from "typedi";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { EmailService } from "./services/email/EmailService";
import { db } from "./databases/db";

const app = express();

app.use(cors());
app.use(express.json());


function signToken(payload: { user_id: number; email: string }) {
  const secret = process.env.JWT_SECRET as Secret;
  if (!secret) throw new Error("JWT_SECRET is missing");

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
}

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const header = String(req.headers.authorization || "");
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return res.status(401).json({ ok: false, error: "Missing token" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).json({ ok: false, error: "Server misconfigured" });

  try {
    const decoded = jwt.verify(token, secret) as { user_id: number; email: string };
    (req as any).auth = decoded;
    return next();
  } catch {
    return res.status(401).json({ ok: false, error: "Invalid token" });
  }
}

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

  await db.query(
    `INSERT INTO "portfolio" ("user_id", "data") VALUES ($1, $2)`,
    [userId, JSON.stringify({})],
  );

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

  await emailService.sendConfirmationEmail(email, `${firstName} ${lastName}`, confirmUrl);

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

  if (!row.used_at && new Date(row.expires_at).getTime() < Date.now()) {
    return res.status(400).json({ ok: false, error: "Token expired" });
  }

  if (!row.used_at) {
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
  }

  return res.json({ ok: true });
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ ok: false, error: "Missing email or password" });
  }

  const result = await db.query(
    `
    SELECT "user_id", "email", "password_hash", "is_verified", "first_name", "last_name"
    FROM "user"
    WHERE "email" = $1
    `,
    [email],
  );

  if (!result.rowCount) {
    return res.status(401).json({ ok: false, error: "Invalid credentials" });
  }

  const user = result.rows[0];

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return res.status(401).json({ ok: false, error: "Invalid credentials" });
  }

  if (!user.is_verified) {
    return res.status(403).json({ ok: false, error: "Please confirm your email first" });
  }

  const token = signToken({ user_id: user.user_id, email: user.email });

  return res.json({
    ok: true,
    token,
    user: {
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    },
  });
});

app.get("/auth/me", requireAuth, async (req, res) => {
  return res.json({ ok: true, auth: (req as any).auth });
});

app.get("/protected", requireAuth, async (_, res) => {
  return res.json({ ok: true });
});

app.get("/portfolio/me", requireAuth, async (req, res) => {
  const auth = (req as any).auth as { user_id: number };

  const result = await db.query(
    `SELECT "data" FROM "portfolio" WHERE "user_id" = $1`,
    [auth.user_id],
  );

  if (!result.rowCount) {
    return res.json({ ok: true, data: null });
  }

  return res.json({ ok: true, data: result.rows[0].data });
});

app.put("/portfolio/me", requireAuth, async (req, res) => {
  const auth = (req as any).auth as { user_id: number };
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ ok: false, error: "Invalid data" });
  }

  await db.query(
    `
    INSERT INTO "portfolio" ("user_id", "data")
    VALUES ($1, $2)
    ON CONFLICT ("user_id")
    DO UPDATE SET "data" = EXCLUDED."data"
    `,
    [auth.user_id, JSON.stringify(data)],
  );

  return res.json({ ok: true });
});
app.listen(3000);
