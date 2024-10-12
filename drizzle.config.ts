import { type Config } from "drizzle-kit";

export default {
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/schema.ts",
  breakpoints: true,
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
    ssl: true,
  },
} satisfies Config;
