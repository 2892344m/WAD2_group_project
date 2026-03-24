import type { Context } from 'hono';
import { getDB } from '../../models/db';
import { items, types, bookings } from '../../models/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '../../auth';

// ── GET  /dashboard/items/:itemID ──────────────────────────────────
export const onRequestGet = async (c: Context) => {
  const currentUser = await getCurrentUser(c);
  if (!currentUser?.user) return c.redirect('/login');

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

  const item = await db
    .select({
      itemID: items.itemID,
      name: items.name,
      status: items.status,
      description: types.description,
      imageDir: types.ImageDir,
      manual: types.manual,
    })
    .from(items)
    .innerJoin(types, eq(items.name, types.name))
    .where(eq(items.itemID, itemID))
    .get();

  if (!item) {
    return c.render(
      <div class="min-h-screen bg-[#f6f7f9]">
        <div class="mx-auto max-w-[900px] px-6 pt-6 pb-16">
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h1 class="text-2xl font-bold text-[#003865]">Item not found</h1>
            <p class="text-gray-600 mt-2">
              No item exists with ID <span class="font-mono">{itemID}</span>.
            </p>
            <a
              href={currentUser.admin ? '/dashboard/items' : '/library'}
              class="inline-block mt-6 text-sm font-semibold text-blue-700 hover:underline"
            >
              ← Back to Library
            </a>
          </div>
        </div>
      </div>
    );
  }

  const url = new URL(c.req.url);
  const success = url.searchParams.get('success');
  const error = url.searchParams.get('error');
  const today = new Date().toISOString().slice(0, 10);

  const isAvailable = item.status === 'available';

  // Check if this user already has a pending request for this item
  const existingRequest = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.itemID, itemID),
        eq(bookings.uid, currentUser.user.uid.toString()),
        eq(bookings.status, 'Pending')
      )
    )
    .get();

  return c.render(
    <div class="min-h-screen bg-[#f6f7f9]">
      <div class="mx-auto max-w-[900px] px-6 pt-6 pb-16">

        {/* ── Back link ─────────────────────────────── */}
        <a
          href={currentUser.admin ? '/dashboard/items' : '/library'}
          class="text-sm font-semibold text-blue-700 hover:underline"
        >
          ← Back to Library
        </a>

        {/* ── Item detail card ──────────────────────── */}
        <div class="mt-4 bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          {item.imageDir && (
            <div class="mb-6">
              <img
                src={`/statics/${item.imageDir}`}
                alt={item.name}
                class="w-40 h-40 object-cover rounded-xl border-2 border-[#003865]"
              />
            </div>
          )}
          <h1 class="text-3xl font-bold text-[#003865]">{item.name}</h1>
          <p class="mt-2 text-gray-600">{item.description ?? 'No description available.'}</p>

          {/* Status pill */}
          <div class="mt-4 flex items-center gap-3">
            <span class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Status</span>
            <span
              class={`px-3 py-1 rounded-full text-xs font-semibold ${
                isAvailable
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {item.status}
            </span>
          </div>

          {/* Item ID badge */}
          <div class="mt-4">
            <span class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Item ID</span>
            <p class="text-lg font-mono text-gray-700 bg-gray-100 inline-block px-3 py-1 rounded-md border border-gray-200 mt-1">
              {item.itemID}
            </p>
          </div>
        </div>

        {/* ── Flash messages ────────────────────────── */}
        {success && (
          <div class="mt-4 rounded-xl bg-green-50 border border-green-200 p-4 text-green-800 text-sm font-medium">
            ✅ {success}
          </div>
        )}
        {error && (
          <div class="mt-4 rounded-xl bg-red-50 border border-red-200 p-4 text-red-800 text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* ── Borrow request form (only when Available) ────── */}
        {isAvailable ? (
          existingRequest ? (
            <div class="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-6">
              <p class="text-amber-800 text-sm font-medium">
                ⏳ You already have a pending borrow request for this item. An admin will review it shortly.
              </p>
            </div>
          ) : (
            <div class="mt-6 bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h2 class="text-2xl font-bold text-[#003865] mb-2">Request to Borrow</h2>
              <p class="text-gray-600 text-sm mb-6">
                Select a return date below. Your request will be sent to an admin for approval.
              </p>

              <form method="POST" action={`/dashboard/items/${item.itemID}`}>
                <label class="block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Return Date
                </label>
                <input
                  type="date"
                  name="returnDate"
                  min={today}
                  required
                  class="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                />

                <button
                  type="submit"
                  class="mt-6 bg-[#003865] text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors shadow-sm"
                >
                  Request Borrow
                </button>
              </form>
            </div>
          )
        ) : (
          <div class="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-6">
            <p class="text-amber-800 text-sm font-medium">
              This item is currently on loan and cannot be borrowed right now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── POST  /dashboard/items/:itemID  (create borrow REQUEST) ───────
export const onRequestPost = async (c: Context) => {
  const currentUser = await getCurrentUser(c);
  if (!currentUser?.user) return c.redirect('/login');

  const itemID = Number(c.req.param('itemID'));
  if (!Number.isFinite(itemID)) {
    return c.redirect(`/dashboard/items/${itemID}?error=Invalid item ID`);
  }

  const db = getDB(c.env);

  // Re-check the item is still available
  const item = await db
    .select()
    .from(items)
    .where(eq(items.itemID, itemID))
    .get();

  if (!item || item.status !== 'available') {
    return c.redirect(
      `/dashboard/items/${itemID}?error=Item is no longer available`
    );
  }

  // Check if user already has a pending request for this item
  const existingRequest = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.itemID, itemID),
        eq(bookings.uid, currentUser.user.uid.toString()),
        eq(bookings.status, 'Pending')
      )
    )
    .get();

  if (existingRequest) {
    return c.redirect(
      `/dashboard/items/${itemID}?error=You already have a pending request for this item`
    );
  }

  const body = await c.req.parseBody();
  const returnDate = (body.returnDate as string) ?? '';

  if (!returnDate) {
    return c.redirect(
      `/dashboard/items/${itemID}?error=Please select a return date`
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  // Insert a PENDING booking request (item stays available)
  await db.insert(bookings).values({
    itemID: itemID,
    uid: currentUser.user.uid.toString(),
    bookingDate: today,
    returnDate: returnDate,
    status: 'Pending',
  });

  return c.redirect(
    `/dashboard/items/${itemID}?success=Borrow request submitted! An admin will review it shortly.`
  );
};