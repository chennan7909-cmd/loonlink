import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { getDatabaseUrl } from "@/db/env";
import * as schema from "@/db/schema";

const queryClient = postgres(getDatabaseUrl(), {
  max: 1,
  prepare: false,
});

export const database = drizzle(queryClient, { schema });
