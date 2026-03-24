import { Context } from 'hono';
import { bookings } from '../../models/schema';
import { getDB } from '../../models/db';
import { SmallPost } from '../../views/components/smallPost';
import { SearchBar } from '../../views/components/SearchBar';
import { like, or, eq } from 'drizzle-orm';
import { getCurrentUser } from '../../auth';
import { admins } from '../../models/schema';
import { getCookie } from 'hono/cookie';


/**
 * Add `days` to a YYYY-MM-DD string.
 * Handles month/year rollovers correctly (e.g. Jan 31 + 2 = Feb 2).
 */
function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export const onRequestGet = async (c: Context) => {

  const db = getDB(c.env);
  const session = getCookie(c, 'session');
  if (!session) {
      return c.redirect('/login');
  }
  const admin = await db
      .select()
      .from(admins)
      .where(eq(admins.uid, Number(session)))
      .get();
  
  if (!admin) {
      return c.redirect('/library');
  }
  const currentUser = await getCurrentUser(c);
  if (!currentUser?.user) return c.redirect('/login');
  if (!currentUser?.admin) return c.redirect('/library');
  const isAdmin = !!currentUser.admin;

  // /dashboard/bookings?q=...
  const q = (c.req.query('q') ?? '').toString().trim();

  let query = db.select().from(bookings);
  if (q) {
    query = query.where(
      or(
        like(bookings.status, `%${q}%`),
        like(bookings.uid, `%${q}%`),
        like(bookings.itemID, `%${q}%`)
      )
    );
  }

  const results = await query.limit(50).all();

  // Server-side grace-period: admins see returnDate + 2 days
  const GRACE_DAYS = 2;

  const displayResults = results.map((b: any) => ({
    ...b,
    returnDate:
      isAdmin && b.returnDate
        ? addDays(b.returnDate, GRACE_DAYS)
        : b.returnDate,
  }));

  return c.render(
    <div class="min-h-screen bg-[#f6f7f9]">
      <div class="mx-auto max-w-[1100px] px-[22px] pt-[22px] pb-[60px]">
        <h1 class="text-[#003865] font-extrabold mb-2.5">
          Bookings
        </h1>

        {/* Admin-only grace period notice */}

        <SearchBar
          action="/dashboard/bookings"
          q={q}
          placeholder="Search bookings (status / uid / itemID)"
        />

        <div class="flex flex-wrap gap-3.5">
          {displayResults.length
            ? displayResults.map((b: any) => (
                <SmallPost
                  bookingID={b.bookingID}
                  itemID={b.itemID}
                  uid={b.uid}
                  bookingDate={b.bookingDate}
                  returnDate={b.returnDate}
                  status={b.status}
                />
              ))
            : (
                <p class="text-sm text-gray-400">
                  {q ? `No bookings found for "${q}".` : 'No bookings found.'}
                </p>
              )}
        </div>
      </div>
    </div>
  );
};