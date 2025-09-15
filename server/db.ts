import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle, type NeonDatabase } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

export const createDbClient = (): NeonDatabase<typeof schema> => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set when using the 'postgres' DB_TYPE."
    );
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return drizzle({ client: pool, schema });
};
