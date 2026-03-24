import { Context } from 'hono';
import { users } from '../../models/schema';
import { getDB } from '../../models/db';
import { SmallPostUser } from '../../views/components/smallPostUser';
import { like, or } from 'drizzle-orm';

export const onRequestGet = async (c: Context) => {
  const db = getDB(c.env);
  const q = (c.req.query('q') || '').toString().trim();

  let query = db.select().from(users);

  if (q) {
    const maybeId = Number(q);
    query = query.where(
      Number.isFinite(maybeId) && q !== ''
        ? or(like(users.name, `%${q}%`), like(users.email, `%${q}%`)) // SQLite doesn't easily LIKE on ints, so we search name/email
        : or(like(users.name, `%${q}%`), like(users.email, `%${q}%`))
    );
  }

  const results = await query.limit(50).all();
  const isHX = c.req.header('HX-Request') === 'true';

  const gridContent = (
    <div id="users-grid" class="flex flex-wrap gap-3.5 pt-4">
      {results.length > 0 ? (
        results.map((u: any) => (
          <SmallPostUser key={u.uid} uid={u.uid.toString()} name={u.name} email={u.email} />
        ))
      ) : (
        <div class="w-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed">
          No users found for "{q}"
        </div>
      )}
    </div>
  );

  if (isHX) return c.html(gridContent);

  return c.render(
    <div class="min-h-screen bg-[#f6f7f9] pt-8 pb-16">
      <div class="mx-auto max-w-[1100px] px-[22px]">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 class="text-3xl font-bold text-[#003865]">User Management</h1>
            <p class="text-gray-600 mt-1">Manage system users and their roles.</p>
          </div>
        </div>

        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
          <form 
            hx-get="/dashboard/users" 
            hx-target="#users-grid" 
            hx-trigger="keyup changed delay:300ms from:input, change from:input" 
            hx-swap="outerHTML"
            class="flex items-center gap-4"
          >
            <div class="relative flex-1 max-w-md">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input
                type="search"
                name="q"
                value={q}
                placeholder="Search users by name or email..."
                class="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            {q && <a href="/dashboard/users" class="text-sm text-blue-600 hover:underline">Clear</a>}
          </form>
        </div>

        {gridContent}
      </div>
    </div>
  );
};