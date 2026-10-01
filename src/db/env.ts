import "server-only";

export function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for server-side database access.");
  }

  return databaseUrl;
}
