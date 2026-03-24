import type { Context } from 'hono';
import { getDB } from '../../models/db';
import { bookings } from '../../models/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '../../auth';

export const onRequestGet = async (c: Context) => {
  const currentUser = await getCurrentUser?.(c);
  if (!currentUser?.user) return c.redirect('/login');
  if (!currentUser.admin) return c.redirect('/library');

  const itemID = Number(c.req.param('itemID'));
  if (!Number.isFinite(itemID)) {
    return c.render(
      <div class="min-h-screen bg-[#f6f7f9]">
        <div class="mx-auto max-w-[900px] px-6 pt-6 pb-16">
          <p class="text-gray-600">Invalid item ID.</p>
        </div>
      </div>
    );
  }

  const db = getDB(c.env);
  const results = await db
    .select({
      bookingID: bookings.bookingID,
      itemID: bookings.itemID,
      uid: bookings.uid,
      bookingDate: bookings.bookingDate,
      returnDate: bookings.returnDate,
      status: bookings.status,
    })
    .from(bookings)
    .where(eq(bookings.itemID, itemID))
    .all();

  return c.render(
    <div class="min-h-screen bg-[#f6f7f9]">
      <div class="mx-auto max-w-[900px] px-6 pt-6 pb-16">
        <a href={`/dashboard/items/${itemID}`} class="text-sm font-semibold text-blue-700 hover:underline">
          ← Back to Item
        </a>
        <h1 class="text-2xl font-extrabold text-[#003865] mt-4 mb-4">
          Booking History — Item #{itemID}
        </h1>
        {results.length === 0 ? (
          <div class="bg-white rounded-xl border border-gray-100 shadow-lg p-8 text-center">
            <p class="text-gray-500">No booking history for this item.</p>
          </div>
        ) : (
          <div class="flex flex-col gap-4">
            {results.map((b: any) => (
              <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <div class="text-xs uppercase tracking-wide text-gray-400">
                      Booking #{b.bookingID}
                    </div>
                    <div class="text-sm font-semibold text-[#003865] mt-1">
                      User ID: {b.uid}
                    </div>
                  </div>
                  <span
                    class={`px-3 py-1 rounded-full text-xs font-semibold ${
                      b.status === 'Pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : b.status === 'Rejected'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : b.status === 'On Loan'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : b.status === 'Returned'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
                <div class="mt-3 text-sm space-y-1 text-gray-600">
                  <div><span class="font-semibold">Booked:</span> {b.bookingDate ?? '—'}</div>
                  <div><span class="font-semibold">Return date:</span> {b.returnDate ?? '—'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};