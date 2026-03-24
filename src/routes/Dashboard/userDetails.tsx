import type { Context } from 'hono';
import { getDB } from '../../models/db';
import { users, admins } from '../../models/schema';
import { getCurrentUser } from '../../auth';
import { eq } from 'drizzle-orm';

export const onRequestGet = async (c: Context) => {
  const currentUser = await getCurrentUser(c);
  if (!currentUser?.user) return c.redirect('/login');
  if (!currentUser.admin) return c.redirect('/library');

  const db = getDB(c.env);

  const uidParam = (c.req.param('uid') ?? '').toString().trim();
  const uidNum = Number(uidParam);
  
  const url = new URL(c.req.url);
  const success = url.searchParams.get('success');
  const error = url.searchParams.get('error');

  if (!Number.isFinite(uidNum)) {
    return c.render(
      <div class="min-h-screen bg-[#f6f7f9]">
        <div class="mx-auto max-w-[1100px] px-[22px] pt-[22px] pb-[60px]">
          <div class="bg-white border border-gray-100 shadow-lg rounded-xl p-8">
            <h1 class="text-2xl font-bold text-[#003865]">User Details</h1>
            <p class="text-gray-600 mt-2">
              Invalid user id: <span class="font-mono">{uidParam}</span>
            </p>
            <a href="/dashboard/users" class="inline-block mt-6 text-blue-700 font-semibold hover:underline">
              ← Back to Users
            </a>
          </div>
        </div>
      </div>
    );
  }

  const user = await db.select().from(users).where(eq(users.uid, uidNum)).get();

  if (!user) {
    return c.render(
      <div class="min-h-screen bg-[#f6f7f9]">
        <div class="mx-auto max-w-[1100px] px-[22px] pt-[22px] pb-[60px]">
          <div class="bg-white border border-gray-100 shadow-lg rounded-xl p-8">
            <h1 class="text-2xl font-bold text-[#003865]">User not found</h1>
            <p class="text-gray-600 mt-2">
              No user exists with id <span class="font-mono">{uidNum}</span>.
            </p>
            <a href="/dashboard/users" class="inline-block mt-6 text-blue-700 font-semibold hover:underline">
              ← Back to Users
            </a>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = await db.select().from(admins).where(eq(admins.uid, uidNum)).get();

  const initials =
    (user.name || '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || 'U';

  return c.render(
    <div class="min-h-screen bg-[#f6f7f9]">
      <div class="mx-auto max-w-[1100px] px-[22px] pt-[22px] pb-[60px]">
        
        {success && (
          <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-green-800 font-medium">✓ {decodeURIComponent(success)}</p>
          </div>
        )}
        
        {error && (
          <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-800 font-medium">✗ {decodeURIComponent(error)}</p>
          </div>
        )}

        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
          <div>
            <h1 class="text-3xl font-bold text-[#003865]">User Details</h1>
            <p class="text-gray-600 mt-1">View information for a selected user.</p>
          </div>

          <a href="/dashboard/users" class="text-sm font-semibold text-blue-700 hover:underline">
            ← Back to Users
          </a>
        </div>

        <div class="flex justify-center">
          <div class="w-full max-w-[980px] grid md:grid-cols-2 gap-6 items-stretch">
            
            {/* Left card */}
            <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-8 h-full">
              <div class="flex items-center gap-4 pb-6 mb-6 border-b border-gray-100">
                <div class="h-14 w-14 rounded-2xl bg-[#003865] text-white flex items-center justify-center font-bold text-xl shrink-0">
                  {initials}
                </div>
                <div class="min-w-0">
                  <div class="text-xl font-bold text-gray-900">{user.name}</div>
                  <div class="text-gray-600 break-all">{user.email}</div>
                </div>
              </div>

              <h2 class="text-xl font-bold text-[#003865] mb-5 flex items-center gap-2">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Identity Information
              </h2>

              <div class="grid sm:grid-cols-2 gap-x-10 gap-y-8">
                <div>
                  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Name</p>
                  <p class="text-lg text-gray-900 font-medium leading-snug">{user.name}</p>
                </div>

                <div>
                  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Address</p>
                  <p class="text-lg text-gray-900 font-medium leading-snug break-all">{user.email}</p>
                </div>

                <div>
                  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">User ID</p>
                  <p class="text-lg font-mono text-gray-700 bg-gray-100 inline-block px-3 py-1 rounded-md border border-gray-200">
                    {user.uid}
                  </p>
                </div>

                <div>
                  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Role</p>
                  <div class="flex items-center gap-2">
                    <span class={`w-2.5 h-2.5 rounded-full ${isAdmin ? 'bg-purple-500' : 'bg-blue-500'}`}></span>
                    <p class="text-lg text-gray-900 font-medium leading-snug">{isAdmin ? 'Administrator' : 'Student'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right card */}
            <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-8 h-full flex flex-col">
              <div class="pb-4 mb-4 border-b border-gray-100">
                <h3 class="text-xl font-bold text-gray-900">Admin Tools</h3>
                <p class="text-sm text-gray-600 mt-1">Quick actions for admin navigation.</p>
              </div>

              <div class="flex flex-col gap-3">
                <form action="/dashboard/users" method="get">
                  <button type="submit" class="w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-[15px] font-semibold text-center leading-tight hover:bg-gray-50 transition duration-200">
                    Go to Users
                  </button>
                </form>

                <form action="/dashboard" method="get">
                  <button type="submit" class="w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-[15px] font-semibold text-center leading-tight hover:bg-gray-50 transition duration-200">
                    Go to Dashboard
                  </button>
                </form>

                <form action="/dashboard/profile" method="get">
                  <button type="submit" class="w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-[15px] font-semibold text-center leading-tight hover:bg-gray-50 transition duration-200">
                    Go to Profile
                  </button>
                </form>
              </div>

              <div class="mt-6 pt-6 border-t border-gray-100">
                <h4 class="font-bold text-gray-900 mb-3">Role Management</h4>
                
                <button
                  type="button"
                  onclick="document.getElementById('confirm_modal').showModal()"
                  class={`w-full rounded-lg px-5 py-3 text-[15px] font-semibold text-center transition duration-200 shadow-sm ${
                    isAdmin 
                      ? 'bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100' 
                      : 'bg-purple-50 text-purple-700 border-2 border-purple-200 hover:bg-purple-100'
                  }`}
                >
                  {isAdmin ? 'Demote to Student' : 'Promote to Admin'}
                </button>

                <dialog 
                  id="confirm_modal" 
                  class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] m-0 backdrop:bg-gray-900/50 backdrop:backdrop-blur-sm rounded-xl shadow-2xl p-0 border border-gray-200" 
                >
                  <div class="p-6 text-center bg-white rounded-xl">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Are you sure?</h3>
                    <p class="text-sm text-gray-500 mb-6 leading-relaxed">
                      {isAdmin
                        ? "This user will lose access to the Admin Dashboard and all administrative tools."
                        : "This user will gain full access to the Admin Dashboard, inventory management, and user roles."}
                    </p>
                    <div class="flex gap-6 justify-between mt-2">
                      <button type="button" onclick="document.getElementById('confirm_modal').close()" class="flex-1 px-5 py-3 text-[15px] bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition">
                        Cancel
                      </button>
                      <form action={`/dashboard/users/${user.uid}/${isAdmin ? 'demote' : 'promote'}`} method="post" class="flex-1 m-0">
                        <button type="submit" class={`w-full h-full px-5 py-3 text-[15px] text-black border-2 border-transparent rounded-lg font-semibold transition shadow-sm ${isAdmin ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'}`}>
                          Yes, {isAdmin ? 'Demote' : 'Promote'}
                        </button>
                      </form>
                    </div>
                  </div>
                </dialog>
              </div>

              <div class="mt-auto pt-6">
                {isAdmin ? (
                  <div class="bg-purple-50 rounded-xl border border-purple-100 p-6">
                    <h4 class="font-bold text-purple-900 mb-2">Account Status: Administrator</h4>
                    <p class="text-sm text-purple-800 leading-relaxed">
                      This account currently has <span class="font-semibold">Admin</span> privileges. They have full access to the Dashboard to manage inventory, oversee bookings, and modify user roles.
                    </p>
                  </div>
                ) : (
                  <div class="bg-blue-50 rounded-xl border border-blue-100 p-6">
                    <h4 class="font-bold text-blue-900 mb-2">Account Status: Student</h4>
                    <p class="text-sm text-blue-800 leading-relaxed">
                      This account is currently a <span class="font-semibold">Standard User</span>. They can browse the Library and make equipment reservations.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <a href={`/dashboard/users/${uidNum}/history`} class="signup-link">
            View item history
          </a>

          </div>
        </div>

      </div>
    </div>
  );
};

export const onRequestPost = async (c: Context) => {
  const currentUser = await getCurrentUser(c);
  if (!currentUser?.admin) return c.redirect('/dashboard/users?error=Unauthorized');

  const db = getDB(c.env);
  const uidNum = Number(c.req.param('uid'));

  if (!Number.isFinite(uidNum)) return c.redirect('/dashboard/users?error=Invalid+User+ID');

  try {
    const user = await db.select().from(users).where(eq(users.uid, uidNum)).get();
    if (!user) return c.redirect('/dashboard/users?error=User+not+found');

    const existing = await db.select().from(admins).where(eq(admins.uid, uidNum)).get();
    if (!existing) {
        await db.insert(admins).values({ uid: uidNum });
    }
    
    return c.redirect(`/dashboard/users/${uidNum}?success=User+successfully+promoted+to+Admin`);
  } catch (error) {
    console.error("Error promoting user:", error);
    return c.redirect(`/dashboard/users/${uidNum}?error=Failed+to+promote+user`);
  }
};

export const onRequestPostDemote = async (c: Context) => {
  const currentUser = await getCurrentUser(c);
  if (!currentUser?.admin) return c.redirect('/dashboard/users?error=Unauthorized');

  const db = getDB(c.env);
  const uidNum = Number(c.req.param('uid'));

  if (!Number.isFinite(uidNum)) return c.redirect('/dashboard/users?error=Invalid+User+ID');

  if (currentUser.user?.uid === uidNum) {
    return c.redirect(`/dashboard/users/${uidNum}?error=You+cannot+demote+yourself`);
  }

  try {
    await db.delete(admins).where(eq(admins.uid, uidNum));
    return c.redirect(`/dashboard/users/${uidNum}?success=User+successfully+demoted+to+Student`);
  } catch (error) {
    console.error("Error demoting user:", error);
    return c.redirect(`/dashboard/users/${uidNum}?error=Failed+to+demote+user`);
  }
};