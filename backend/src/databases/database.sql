CREATE TABLE "user" (
  "user_id" SERIAL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "password_hash" TEXT NOT NULL,
  "is_verified" BOOLEAN NOT NULL DEFAULT FALSE
);
