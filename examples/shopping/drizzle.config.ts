import type { Config } from "drizzle-kit";

export default {
  schema: ".trigs/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: "postgresql://postgres:postgres@localhost:2345/postgres",
  },
} satisfies Config;
