import type { Context } from 'hono';

export const onRequestGet = async (c: Context) => {
  const bookingID = c.req.param('bookingID');

  return c.render(
    <div>
      <h1>Booking Details</h1>
      <p>Blank page for booking ID: {bookingID}</p>
    </div>
  );
};