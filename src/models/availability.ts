import { Context } from 'hono';
import { items, types, bookings } from './schema';
import { eq, sql } from 'drizzle-orm';
import { getDB } from './db';

type AvailabilityOptions = {
  typeName: string;
  start: string; // e.g. '2025-12-01'
  end: string;   // e.g. '2025-12-05'
};

export async function getAvailableItemsForRange(
  c: Context,
  options: AvailabilityOptions,
) {
  const { typeName, start, end } = options;
  const db = getDB(c.env);

  const rows = await db
    .select()
    .from(items)
    .innerJoin(types, eq(items.name, types.name))
    .where(
      sql`
        ${types.name} = ${typeName}
        AND NOT EXISTS (
          SELECT 1
          FROM ${bookings}
          WHERE ${bookings.itemID} = ${items.itemID}
            AND NOT (
              ${bookings.returnDate} < ${start}
              OR ${bookings.bookingDate} > ${end}
            )
        )
      `,
    );

  return rows;
}
