import { Context } from 'hono';
import { getDB } from '../models/db';
import { users, admins } from '../models/schema';
import { eq } from 'drizzle-orm';
import { setCookie, getCookie } from 'hono/cookie';

const renderLoginForm = (error: string | null = null, email: string = '') => {
  return (
    <div class="min-h-screen bg-[#f5f5f5] flex items-start justify-center pt-[60px]">
      <form method="POST" action="/login" class="w-full max-w-[400px] bg-white shadow-md rounded-lg p-8 space-y-4">
        <h2 class="text-center text-xl font-bold text-gray-800 mt-0">Login</h2>

        {error && (
          <div class="text-red-600 text-center font-bold text-sm bg-red-50 p-2 rounded-lg border border-red-100">{error}</div>
        )}

        <div class="space-y-4">
            <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={email}
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />

            <div class="space-y-1">
                <input
                type="password"
                name="password"
                placeholder="Password"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <div class="text-right">
                    <a href="/forgot-password" class="text-xs text-[#003865] hover:underline font-semibold">Forgot password?</a>
                </div>
            </div>
        </div>

        <button
          type="submit"
          class="w-full py-2.5 bg-[#003865] text-white font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
        >
          Log in
        </button>

        <div class="pt-4 border-t border-gray-50 text-center">
            <p class="text-sm text-gray-500">Don't have an account?</p>
            <a href="/signup" class="inline-block no-underline text-[#003865] text-sm font-bold hover:underline mt-1">
            Create an account
            </a>
        </div>
      </form>
    </div>
  );
};

export const onRequestGet = async (c: Context) => {
  const session = getCookie(c, 'session');
  if (session) return c.redirect('/library');
  return c.render(renderLoginForm());
};

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  const salt = hexToBuffer(saltHex);
  const originalHash = hexToBuffer(hashHex);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), { name: "PBKDF2" }, false, ["deriveBits"]);
  const derivedBits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 210_000, hash: "SHA-256" }, key, 256);
  const newHash = new Uint8Array(derivedBits);
  return timingSafeEqual(newHash, originalHash);
}

function hexToBuffer(hex: string) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a[i] ^ b[i];
  return result === 0;
}

export const onRequestPost = async (c: Context) => {
  const db = getDB(c.env);
  const body = await c.req.parseBody();
  const email = body.email as string;
  const password = body.password as string;

  const user = await db.select().from(users).where(eq(users.email, email)).get();
  const isValid = user ? await verifyPassword(password, user.password) : false;

  if (!isValid) return c.render(renderLoginForm("Invalid email or password", email));

  setCookie(c, 'session', user.uid.toString(), { httpOnly: true, secure: false, sameSite: 'Lax', path: '/', maxAge: 60 * 60 * 24 });

  const admin = await db.select().from(admins).where(eq(admins.uid, Number(user.uid))).get();
  return c.redirect(admin ? '/dashboard' : '/library');
};