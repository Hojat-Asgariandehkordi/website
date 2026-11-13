/**
 * npm run setup
 * Creates the local SQLite database and seeds one demo account.
 * The demo password is never printed. It is taken from DEMO_PASSWORD if set,
 * otherwise generated and written to data/demo-credentials.txt (git-ignored).
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { eq } from "drizzle-orm";
import { openDb } from "../src/lib/db";
import { users } from "../src/lib/schema";
import { createUser, markLessonComplete, saveScenario, setChecklistItem, addTeamMember } from "../src/lib/repo";
import { DEFAULT_INPUTS } from "../src/lib/calculator";

const DEMO_EMAIL = "demo@nextowner.local";

async function main() {
  const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "nextowner.db");
  const db = openDb(dbPath);
  console.log(`Database ready at ${path.relative(process.cwd(), dbPath) || dbPath}`);

  if (db.select().from(users).where(eq(users.email, DEMO_EMAIL)).get()) {
    console.log("Demo account already exists. Nothing to seed.");
    return;
  }

  const password = process.env.DEMO_PASSWORD || crypto.randomBytes(12).toString("base64url");
  const id = await createUser(db, { email: DEMO_EMAIL, name: "Demo Buyer", password });
  markLessonComplete(db, id, "is-buying-right-for-me", "what-is-eta");
  saveScenario(db, id, "Example: $1M service business", DEFAULT_INPUTS);
  setChecklistItem(db, id, "fit-statement", true);
  addTeamMember(db, id, { name: "Sample Mentor", firm: "", role: "mentor", status: "talking", notes: "Example entry. Edit or remove it." });

  if (!process.env.DEMO_PASSWORD) {
    const credFile = path.join(path.dirname(dbPath === ":memory:" ? "data/x" : dbPath), "demo-credentials.txt");
    fs.writeFileSync(credFile, `email: ${DEMO_EMAIL}\npassword: ${password}\n`, { mode: 0o600 });
    console.log(`Demo account created (${DEMO_EMAIL}). Its password was written to ${path.relative(process.cwd(), credFile)}.`);
  } else {
    console.log(`Demo account created (${DEMO_EMAIL}) with the password from DEMO_PASSWORD.`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
