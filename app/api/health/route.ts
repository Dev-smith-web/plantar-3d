import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  const checks: Record<string, string> = {};

  // Check env vars
  checks.TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL ? "set" : "MISSING";
  checks.TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN ? "set" : "MISSING";
  checks.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET ? "set" : "MISSING";

  // Check DB connection
  try {
    const result = await db.select({ count: sql<number>`count(*)` }).from(users);
    checks.database = `connected (${result[0]?.count ?? 0} users)`;
  } catch (e) {
    checks.database = `FAILED: ${e instanceof Error ? e.message : String(e)}`;
  }

  const healthy = !Object.values(checks).some(
    (v) => v === "MISSING" || v.startsWith("FAILED")
  );

  return Response.json({ healthy, checks }, { status: healthy ? 200 : 500 });
}
