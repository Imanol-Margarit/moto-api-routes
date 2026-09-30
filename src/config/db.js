import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

export const pool = new Pool({ connectionString });

export async function connectDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS routes (
      id UUID PRIMARY KEY,
      title VARCHAR(120) NOT NULL,
      region VARCHAR(80) NOT NULL,
      "distanceKm" NUMERIC(6, 2) NOT NULL CHECK ("distanceKm" >= 0),
      difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('facil', 'media', 'dificil')),
      description VARCHAR(500),
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  console.log("PostgreSQL connected");
}

export async function closeDB() {
  await pool.end();
}
