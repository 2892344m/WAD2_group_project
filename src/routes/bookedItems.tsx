import { Context } from 'hono';
import { bookings } from '../models/schema';
import { like, and, eq } from 'drizzle-orm';
import { getDB } from '../models/db';
import { SmallPost } from '../views/components/smallPost';
import { PostFrame } from '../views/components/sections/Frames'


const fetchAndRenderBookings = async (c: Context, data: any) => {
  const db = getDB(c.env);
  let query = db
    .select()
    .from(bookings)
    .limit(50);

  const conditions = [];
  if (data.bookingID) {
    conditions.push(like(bookings.bookingID, `%${data.bookingID}%`));
  }
  if (data.itemID) {
    conditions.push(like(bookings.itemID, `%${data.itemID}%`));
  }
  if (data.uid) {
    conditions.push(like(bookings.uid, `%${data.uid}%`));
  }
  if (data.bookingDate) {
    conditions.push(like(bookings.bookingDate, `%${data.bookingDate}%`));
  }
  if (data.returnDate) {
    conditions.push(like(bookings.returnDate, `%${data.returnDate}%`));
  }
  if (data.status) {
    conditions.push(like(bookings.status, `%${data.status}%`));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const processedResults = await query.all();

  // Sort events by date
  processedResults.sort(
    (a, b) =>
      new Date(a.returnDate).getTime() -
      new Date(b.returnDate).getTime(),
  );

  const htmlOut: any[] = [];

  if (processedResults.length === 0) {
    return noResults("There are no bookings that match your search terms");
  }

  const displayedBookings: any = [];

  processedResults.forEach(booking => {
    displayedBookings.push(
      <SmallPost
      bookingID={booking.bookingID}
      itemID={booking.itemID}
      uid={booking.uid}
      bookingDate={booking.bookingDate}
      returnDate={booking.returnDate}
      status={booking.status}
      />,
    );
  });

  htmlOut.push(
    <PostFrame
      heading={"Bookings"}
      topOffset={"-40"}
      frameStyle="-lg:flex"
    >
      {displayedBookings}
    </PostFrame>,
  );

  return <>{htmlOut}</>;
};

export const onRequestPost = async (c: Context) => {
  try {
    const data = await c.req.parseBody();
    return c.render(await fetchAndRenderBookings(c, data));
  } catch (error) {
    console.error('Error executing query:', error);
    return c.json(
      { message: 'Error executing query', error: error.message },
      500,
    );
  }
};

export const onRequestGet = async (c: Context) => {
  try {
    const data = {};
    const bookings = await fetchAndRenderBookings(c, data);

    return c.render(
        <>
          <p>
            here are the bookings
            {bookings}
          </p>
        </>
    );
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return c.json({ message: '...', error: error.message }, 500);
  }
};