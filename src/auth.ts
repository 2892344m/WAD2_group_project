import { getCookie } from 'hono/cookie';
import { getDB } from '@/models/db';
import { users } from '@/models/schema';
import { admins } from '@/models/schema';
import { eq } from 'drizzle-orm';
import type { Context } from 'hono';

export async function getCurrentUser(c: Context) {
  const session = getCookie(c, 'session');
  if (!session) return null;

  const db = getDB(c.env);
  const user = await db
    .select()
    .from(users)
    .where(eq(users.uid, session))
    .get();

    const admin = await db
        .select()
        .from(admins)
        .where(eq(admins.uid, session))
        .get();

  return {
    user: user ?? null,
    admin: admin ?? null,
  };
}

export async function getLibraryPath(c: Context) {
  const currentUser = await getCurrentUser(c);
  return currentUser?.admin ? '/dashboard/items' : '/library';
}

export async function getLandingPath(c: Context) {
  const currentUser = await getCurrentUser(c);
  return currentUser?.admin ? '/dashboard' : '/library';
}