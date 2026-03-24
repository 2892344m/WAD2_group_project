import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { drizzle } from 'drizzle-orm/d1';
import { schema } from './schema';
import type { Env } from '@/interfaces';

let drizzleDB: DrizzleD1Database<typeof schema> | null = null;

export const initDB = (env: Env) => {
  if (!drizzleDB) {
    drizzleDB = drizzle(env.DB, { schema });
  }
  return drizzleDB;
};

export const getDB = (env: Env) => {
  if (!env.Test) {
    return drizzleDB ?? initDB(env);
  }
  return env.DB;
};
