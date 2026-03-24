import { Context } from 'hono';
import { getDB } from '../models/db';
import { users } from '../models/schema';
import { eq, gt } from 'drizzle-orm';
import { hashPassword } from './signup'
import { verifyPassword } from './login'

export const onRequestGet = async (c: Context) => {
  const token = c.req.query("token");

  return c.render(
    <div class="min-h-screen bg-[#f5f5f5] flex items-start justify-center pt-[60px]">
      <form method="POST" class="w-full max-w-[400px] bg-white shadow-md rounded-lg p-8 space-y-4">
        <h2 class="text-center text-xl font-bold text-gray-800 mt-0">Reset Password</h2>
        <input type="hidden" name="token" value={token} />
        
        <div class="space-y-1">
          <label class="text-xs font-bold text-gray-400 uppercase tracking-wider">New Password</label>
          <input 
            type="password" 
            name="password" 
            placeholder="••••••••" 
            required 
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button 
          type="submit" 
          class="w-full py-2.5 bg-[#003865] text-white font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export const onRequestPost = async (c: Context) => {
  const db = getDB(c.env);
  const body = await c.req.parseBody();
  const token = body.token as string;
  const newPassword = body.password as string;
  const candidates = await db
    .select()
    .from(users)
    .where(gt(users.resetTokenExpiry, Date.now()))
    .all();

  let user = null;
  for (const u of candidates) {
    if (u.resetToken && await verifyPassword(token, u.resetToken)) {
      user = u;
      break;
    }
  }
  if (!user) {
    return c.text("Invalid or expired token", 400);
  }

  const hashed = await hashPassword(newPassword);

  await db
    .update(users)
    .set({
      password: hashed,
      resetToken: null,
      resetTokenExpiry: null,
    })
    .where(eq(users.uid, user.uid));

  return c.redirect("/login");
};