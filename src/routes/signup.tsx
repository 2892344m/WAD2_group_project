import { Context } from 'hono';
import { getCurrentUser } from '@/auth';
import { getDB } from '@/models/db';
import { users } from '@/models/schema';
import { eq } from 'drizzle-orm';
import { getCookie } from 'hono/cookie';
import { getLandingPath } from '@/auth';

export const onRequestGet = async (c: Context) => {
  // Checks if user is admin
  const session = getCookie(c, 'session');
  
  if (session) {
    const landingPath = await getLandingPath(c);
    return c.redirect(landingPath);
  }

  // Gets success message from query params if present
  const url = new URL(c.req.url);
  const success = url.searchParams.get('success');
  const error = url.searchParams.get('error');

  return c.render(
    <div class="w-full max-w-4xl mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Sign up to equipment library</h1>
      
      {success && (
        <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-green-800 font-medium">✓  Account created successfully!</p>
        </div>
      )}
      
      {error && (
        <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-800 font-medium">✗ {decodeURIComponent(error)}</p>
        </div>
      )}

      <form method="POST" action="/signup" class="bg-white shadow-md rounded-lg p-8 space-y-6">
        {/* Item Type Information */}
        <div class="border-b pb-4 mb-4">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Account Information</h2>
          
          <div class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email <span class="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                class="w-full px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <textarea
                type="text"
                id="name"
                name="name"
                required
                class="w-full px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Password <span class="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                class="w-full px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            </div>
            </div>

        {/* Submit Button */}
        <div class="flex gap-4 pt-4">
          <button
            type="submit"
            class="flex-1 bg-[#003865] hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Create Account
          </button>
          <a
            href="/dashboard/items"
            class="flex-1 bg-white border-2 border-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200 text-center hover:bg-gray-50"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
    );
};

const encoder = new TextEncoder();

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 210_000,
      hash: "SHA-256",
    },
    key,
    256
  );
  const hashArray = new Uint8Array(derivedBits);
  return `${bufferToHex(salt)}:${bufferToHex(hashArray)}`;
}

function bufferToHex(buffer: Uint8Array) {
  return Array.from(buffer)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export const onRequestPost = async (c: Context) => {
  try {
    const formData = await c.req.parseBody();
    const email = formData.email as string;
    const name = (formData.name as string) || null;
    const password = formData.password as string;
    const hash = await hashPassword(password);


    // Validation
    if (!email || !name || !hash) {
      return c.redirect('/signup?error=Missing required fields');
    }

    const db = getDB(c.env);

    // Inserts new item
    await db.insert(users).values({
      email,
      name,
      password: hash,
    });

    // Redirect with success message
    return c.redirect('/signup?success=true');
    
  } catch (error) {
    console.error('Error adding user:', error);
    return c.redirect('/signup?error=An error occurred while adding the user');
  }
};