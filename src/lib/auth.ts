import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { sessions } from "./schema";
import { getUser } from "./repo";

const COOKIE = "no_session";
const MAX_AGE_S = 60 * 60 * 24 * 30;

const hashToken = (t: string) => crypto.createHash("sha256").update(t).digest("hex");

export async function startSession(userId: number) {
  const token = crypto.randomBytes(32).toString("base64url");
  getDb().insert(sessions).values({ tokenHash: hashToken(token), userId, expiresAt: Date.now() + MAX_AGE_S * 1000 }).run();
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_S,
  });
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) getDb().delete(sessions).where(eq(sessions.tokenHash, hashToken(token))).run();
  jar.delete(COOKIE);
}

/** Current signed-in user, or null. */
export async function currentUser() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const db = getDb();
  const s = db.select().from(sessions).where(eq(sessions.tokenHash, hashToken(token))).get();
  if (!s || s.expiresAt < Date.now()) return null;
  return getUser(db, s.userId);
}

export async function requireUser(next = "/dashboard") {
  const u = await currentUser();
  if (!u) redirect(`/sign-in?next=${encodeURIComponent(next)}`);
  return u;
}
