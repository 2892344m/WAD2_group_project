import type { Context } from 'hono';
import { getDB } from '../../models/db';
import { bookings, items, users } from '../../models/schema';
import { eq, and } from 'drizzle-orm';
import { admins } from '../../models/schema';
import { getCookie } from 'hono/cookie';
import { getCurrentUser } from '../../auth';


// ── GET  /dashboard/requests ───────────────────────────────────────
export const onRequestGet = async (c: Context) => {
  const currentUser = await getCurrentUser(c);
  if (!currentUser?.user) return c.redirect('/login');

  const db = getDB(c.env);
  const isAdmin = !!currentUser.admin;

  const session = getCookie(c, 'session');

  const url = new URL(c.req.url);
  const success = url.searchParams.get('success');
  const error = url.searchParams.get('error');

  const admin = await db
  .select()
  .from(admins)
  .where(eq(admins.uid, Number(session)))
  .get();

if (!admin) {
  return c.redirect('/login');
}
  // Admins see all pending requests; users see only their own
  let results;
  if (isAdmin) {
    results = await db
      .select({
        bookingID: bookings.bookingID,
        itemID: bookings.itemID,
        uid: bookings.uid,
        bookingDate: bookings.bookingDate,
        returnDate: bookings.returnDate,
        status: bookings.status,
        itemName: items.name,
        userName: users.name,
      })
      .from(bookings)
      .innerJoin(items, eq(bookings.itemID, items.itemID))
      .innerJoin(users, eq(bookings.uid, users.uid))
      .where(eq(bookings.status, 'Pending'))
      .all();
  } else {
    results = await db
      .select({
        bookingID: bookings.bookingID,
        itemID: bookings.itemID,
        uid: bookings.uid,
        bookingDate: bookings.bookingDate,
        returnDate: bookings.returnDate,
        status: bookings.status,
        itemName: items.name,
        userName: users.name,
      })
      .from(bookings)
      .innerJoin(items, eq(bookings.itemID, items.itemID))
      .innerJoin(users, eq(bookings.uid, users.uid))
      .where(eq(bookings.uid, currentUser.user.uid.toString()))
      .all();
  }

  return c.render(
    <div class="min-h-screen bg-[#f6f7f9]">
      <div class="mx-auto max-w-[1100px] px-6 pt-6 pb-16">
        <h1 class="text-2xl font-extrabold text-[#003865] mb-4">
          {isAdmin ? 'Borrow Requests' : 'My Requests'}
        </h1>

        {/* Flash messages */}
        {success && (
          <div class="mb-4 rounded-xl bg-green-50 border border-green-200 p-4 text-green-800 text-sm font-medium">
            ✅ {success}
          </div>
        )}
        {error && (
          <div class="mb-4 rounded-xl bg-red-50 border border-red-200 p-4 text-red-800 text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {results.length === 0 ? (
          <div class="bg-white rounded-xl border border-gray-100 shadow-lg p-8 text-center">
            <p class="text-gray-500">
              {isAdmin ? 'No pending requests.' : 'You have no requests yet.'}
            </p>
          </div>
        ) : (
          <div class="flex flex-col gap-4">
            {results.map((r: any) => (
              <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <div class="text-xs uppercase tracking-wide text-gray-400">
                      Request #{r.bookingID}
                    </div>
                    <div class="text-lg font-bold text-[#003865] mt-1">
                      {r.itemName}
                    </div>
                    <div class="text-sm text-gray-500 mt-0.5">
                      Item ID: <span class="font-mono">{r.itemID}</span>
                    </div>
                  </div>

                  {/* Status pill */}
                  <span
                    class={`px-3 py-1 rounded-full text-xs font-semibold ${
                      r.status === 'Pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : r.status === 'Rejected'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : r.status === 'On Loan'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>

                <div class="mt-3 text-sm space-y-1 text-gray-600">
                  <div>
                    <span class="font-semibold">Requested by:</span> {r.userName} (uid: {r.uid})
                  </div>
                  <div>
                    <span class="font-semibold">Requested on:</span> {r.bookingDate}
                  </div>
                  <div>
                    <span class="font-semibold">Return date:</span> {r.returnDate}
                  </div>
                </div>

                {/* Admin approve/reject buttons */}
                {isAdmin && r.status === 'Pending' && (
                  <div class="mt-4 flex gap-3">
                    <form method="POST" action="/dashboard/requests">
                      <input type="hidden" name="bookingID" value={r.bookingID.toString()} />
                      <input type="hidden" name="action" value="approve" />
                      <button
                        type="submit"
                        class="bg-green-600 text-black px-6 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
                      >
                        Approve
                      </button>
                    </form>
                    <form method="POST" action="/dashboard/requests">
                      <input type="hidden" name="bookingID" value={r.bookingID.toString()} />
                      <input type="hidden" name="action" value="reject" />
                      <button
                        type="submit"
                        class="bg-red-600 text-black px-6 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm"
                      >
                        Reject
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── POST  /dashboard/requests  (approve / reject) ─────────────────
export const onRequestPost = async (c: Context) => {
  const currentUser = await getCurrentUser(c);
  if (!currentUser?.user) return c.redirect('/login');

  // Only admins can approve/reject
  if (!currentUser.admin) {
    return c.redirect('/dashboard/requests?error=Only admins can manage requests');
  }

  const body = await c.req.parseBody();
  const bookingID = Number(body.bookingID);
  const action = (body.action as string) ?? '';

  if (!Number.isFinite(bookingID) || !['approve', 'reject'].includes(action)) {
    return c.redirect('/dashboard/requests?error=Invalid request');
  }

  const db = getDB(c.env);

  // Get the booking
  const booking = await db
    .select()
    .from(bookings)
    .where(eq(bookings.bookingID, bookingID))
    .get();

  if (!booking || booking.status !== 'Pending') {
    return c.redirect('/dashboard/requests?error=Request not found or already processed');
  }

  if (action === 'approve') {
    // Check item is still available
    const item = await db
      .select()
      .from(items)
      .where(eq(items.itemID, booking.itemID))
      .get();

    if (!item || item.status !== 'available') {
      // Reject the request since item is no longer available
      await db
        .update(bookings)
        .set({ status: 'Rejected' })
        .where(eq(bookings.bookingID, bookingID));

      return c.redirect(
        '/dashboard/requests?error=Item is no longer available. Request has been rejected.'
      );
    }

    // Approve: update booking status and mark item as On Loan
    await db
      .update(bookings)
      .set({ status: 'On Loan' })
      .where(eq(bookings.bookingID, bookingID));

    await db
      .update(items)
      .set({ status: 'On Loan' })
      .where(eq(items.itemID, booking.itemID));

    // Reject any other pending requests for the same item
    await db
      .update(bookings)
      .set({ status: 'Rejected' })
      .where(
        and(
          eq(bookings.itemID, booking.itemID),
          eq(bookings.status, 'Pending')
        )
      );

    return c.redirect('/dashboard/requests?success=Request approved! Item is now on loan.');
  }

  if (action === 'reject') {
    await db
      .update(bookings)
      .set({ status: 'Rejected' })
      .where(eq(bookings.bookingID, bookingID));

    return c.redirect('/dashboard/requests?success=Request rejected.');
  }

  return c.redirect('/dashboard/requests');
};
