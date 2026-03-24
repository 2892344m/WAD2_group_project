import { Context } from 'hono';
import { getDB } from '../models/db';
import { users } from '../models/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from './signup';
import { Resend } from "resend";

export const onRequestGet = async (c: Context) => {
  return c.render(
    <div class="min-h-screen bg-[#f5f5f5] flex items-start justify-center pt-[60px]">
      <form method="POST" action="/forgot-password" class="w-full max-w-[400px] bg-white shadow-md rounded-lg p-8 space-y-4">
        <h2 class="text-center text-xl font-bold text-gray-800 mt-0">Forgot Password</h2>
        <p class="text-sm text-gray-600 text-center mb-6">Enter your email and we'll send you a reset link.</p>
        
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        
        <button
          type="submit"
          class="w-full py-2.5 bg-[#003865] text-white font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
        >
          Send Reset Link
        </button>

        <div class="text-center mt-4 pt-4 border-t border-gray-50">
          <a href="/login" class="text-sm text-[#003865] hover:underline font-semibold">Back to Login</a>
        </div>
      </form>
    </div>
  );
};

export const onRequestPost = async (c: Context) => {
  const db = getDB(c.env);
  const body = await c.req.parseBody();
  const email = body.email as string;

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (user) {
    const token = crypto.randomUUID();
    const tokenHash = await hashPassword(token);
    const expiry = Date.now() + 1000 * 60 * 60; // 1 hour expiry

    await db
      .update(users)
      .set({
        resetToken: tokenHash,
        resetTokenExpiry: expiry,
      })
      .where(eq(users.uid, user.uid));
      
    const resend = new Resend(c.env.RESEND_API_KEY);
    const resetUrl = `${new URL(c.req.url).origin}/reset-password?token=${token}`;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset your password",
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 1 hour.</p>
      `,
    });
  }

  // Themed Success Card matching the modern UI
  return c.render(
    <div class="min-h-screen bg-[#f5f5f5] flex items-start justify-center pt-[60px]">
      <div class="w-full max-w-[400px] bg-white shadow-md rounded-lg p-8 text-center space-y-4">
        <div class="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-800">Check Your Email</h2>
        <p class="text-sm text-gray-600">
            If an account exists for <strong>{email}</strong>, a reset link has been sent.
        </p>
        <div class="pt-4 border-t border-gray-50">
            <a href="/login" class="text-sm font-bold text-[#003865] hover:underline">Return to Login</a>
        </div>
      </div>
    </div>
  );
};