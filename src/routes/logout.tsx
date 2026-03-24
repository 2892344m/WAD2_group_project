import { deleteCookie } from 'hono/cookie';
import type { Context } from 'hono';

export const onRequestGet = async (c: Context) => {
  deleteCookie(c, 'session', { path: '/' });
  return c.redirect('/login');
};