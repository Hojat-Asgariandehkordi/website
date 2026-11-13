import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import * as schema from "./schema";

export type DB = BetterSQLite3Database<typeof schema>;

/** Open a database at the given path (or ":memory:") and make sure the schema exists. */
export function openDb(dbPath: string): DB {
  if (dbPath !== ":memory:") {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.exec(schema.SCHEMA_SQL);
  return drizzle(sqlite, { schema });
}

const globalForDb = globalThis as unknown as { __nextownerDb?: DB };

/** Shared app database. Path comes from DATABASE_PATH, defaulting to data/nextowner.db. */
export function getDb(): DB {
  if (!globalForDb.__nextownerDb) {
    const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "nextowner.db");
    globalForDb.__nextownerDb = openDb(dbPath);
  }
  return globalForDb.__nextownerDb;
}
