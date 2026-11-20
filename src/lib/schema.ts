import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  newcomerTrack: integer("newcomer_track", { mode: "boolean" }).notNull().default(false),
  lastModule: text("last_module"),
  lastLesson: text("last_lesson"),
  createdAt: integer("created_at").notNull(),
});

export const sessions = sqliteTable("sessions", {
  tokenHash: text("token_hash").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at").notNull(),
});

export const lessonProgress = sqliteTable(
  "lesson_progress",
  {
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    moduleSlug: text("module_slug").notNull(),
    lessonSlug: text("lesson_slug").notNull(),
    completedAt: integer("completed_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.moduleSlug, t.lessonSlug] })],
);

export const quizResults = sqliteTable(
  "quiz_results",
  {
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    moduleSlug: text("module_slug").notNull(),
    correct: integer("correct").notNull(),
    total: integer("total").notNull(),
    answers: text("answers").notNull(),
    takenAt: integer("taken_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.moduleSlug] })],
);

export const teamMembers = sqliteTable("team_members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  firm: text("firm").notNull().default(""),
  role: text("role").notNull(),
  status: text("status").notNull().default("not_contacted"),
  notes: text("notes").notNull().default(""),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const scenarios = sqliteTable("scenarios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  inputs: text("inputs").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const checklistItems = sqliteTable(
  "checklist_items",
  {
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    itemKey: text("item_key").notNull(),
    checkedAt: integer("checked_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.itemKey] })],
);

export const newsReads = sqliteTable(
  "news_reads",
  {
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    itemId: text("item_id").notNull(),
    readAt: integer("read_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.itemId] })],
);

export const newsPrefs = sqliteTable("news_prefs", {
  userId: integer("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  topics: text("topics").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

/** Plain SQL used to create the schema. Kept beside the Drizzle definitions above. */
export const SCHEMA_SQL = `
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  newcomer_track INTEGER NOT NULL DEFAULT 0,
  last_module TEXT,
  last_lesson TEXT,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS lesson_progress (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_slug TEXT NOT NULL,
  lesson_slug TEXT NOT NULL,
  completed_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, module_slug, lesson_slug)
);
CREATE TABLE IF NOT EXISTS quiz_results (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_slug TEXT NOT NULL,
  correct INTEGER NOT NULL,
  total INTEGER NOT NULL,
  answers TEXT NOT NULL,
  taken_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, module_slug)
);
CREATE TABLE IF NOT EXISTS team_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  firm TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_contacted',
  notes TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS team_members_user ON team_members(user_id);
CREATE TABLE IF NOT EXISTS scenarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  inputs TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS scenarios_user ON scenarios(user_id);
CREATE TABLE IF NOT EXISTS checklist_items (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_key TEXT NOT NULL,
  checked_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, item_key)
);
CREATE TABLE IF NOT EXISTS news_reads (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  read_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, item_id)
);
CREATE TABLE IF NOT EXISTS news_prefs (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  topics TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
`;
