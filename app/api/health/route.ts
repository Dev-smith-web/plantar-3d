import { createClient } from "@libsql/client/web";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function GET() {
  const checks: Record<string, string> = {};

  // Check env vars (show URL prefix to verify format)
  const url = process.env.TURSO_DATABASE_URL ?? "";
  checks.TURSO_DATABASE_URL = url ? `set (${url.substring(0, 20)}...)` : "MISSING";
  checks.TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN ? `set (${process.env.TURSO_AUTH_TOKEN.substring(0, 10)}...)` : "MISSING";
  checks.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET ? "set" : "MISSING";

  // Test raw libsql connection first
  try {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    const raw = await client.execute("SELECT 1 as test");
    checks.raw_libsql = `OK: ${JSON.stringify(raw.rows[0])}`;
  } catch (e) {
    checks.raw_libsql = `FAILED: ${e instanceof Error ? `${e.message} | ${e.stack?.split("\n")[1]?.trim()}` : String(e)}`;
  }

  // Test drizzle query
  try {
    const result = await db.select({ count: sql<number>`count(*)` }).from(users);
    checks.drizzle_query = `connected (${result[0]?.count ?? 0} users)`;
  } catch (e) {
    checks.drizzle_query = `FAILED: ${e instanceof Error ? `${e.message} | ${e.stack?.split("\n")[1]?.trim()}` : String(e)}`;
  }

  const healthy = !Object.values(checks).some(
    (v) => v.includes("MISSING") || v.includes("FAILED")
  );

  return Response.json({ healthy, checks }, { status: healthy ? 200 : 500 });
}
