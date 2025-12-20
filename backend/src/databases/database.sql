CREATE TABLE "user" (
  "user_id" SERIAL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "password_hash" TEXT NOT NULL,
  "is_verified" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE "email_verification" (
  "email_verification_id" SERIAL PRIMARY KEY,
  "user_id" INT NOT NULL REFERENCES "user"("user_id") ON DELETE CASCADE,
  "token" TEXT NOT NULL UNIQUE,
  "expires_at" TIMESTAMP NOT NULL,
  "used_at" TIMESTAMP
);

CREATE INDEX "idx_email_verification_user_id"
  ON "email_verification"("user_id");