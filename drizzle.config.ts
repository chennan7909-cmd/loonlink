import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

loadEnvConfig(process.cwd());

const offlineCommands = new Set(["generate", "check"]);
const isOfflineCommand = process.argv.some((argument) => offlineCommands.has(argument));
const migrationUrl = process.env.DATABASE_MIGRATION_URL;

if (!migrationUrl && !isOfflineCommand) {
  throw new Error(
    "DATABASE_MIGRATION_URL is required for database commands that connect to PostgreSQL.",
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    // Schema generation and validation do not connect to this fallback URL.
    url: migrationUrl ?? "postgresql://localhost:5432/loonlink_schema_generation",
  },
  migrations: {
    schema: "drizzle",
    table: "__loonlink_migrations",
  },
  strict: true,
  verbose: true,
});
