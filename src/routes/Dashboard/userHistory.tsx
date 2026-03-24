import type { Context } from 'hono';
import { getDB } from '../../models/db';
import { bookings } from '../../models/schema';
import { like } from 'drizzle-orm';
import { SmallPost } from '../../views/components/smallPost';
import { getCookie } from 'hono/cookie';
import { admins } from '../../models/schema';
import { eq } from 'drizzle-orm';


export const onRequestGet = async (c: Context) => {
    const session = getCookie(c, 'session');
    const db = getDB(c.env);
    
    if (!session) {
        return c.redirect('/login');
    }
    const admin = await db
        .select()
        .from(admins)
        .where(eq(admins.uid, Number(session)))
        .get();
    
    if (!admin) {
        return c.redirect('/login');
    }

    const uid = c.req.param('uid');

    let query = db.select().from(bookings);
    query = query.where(
        like(bookings.uid, `%${uid}%`)
    )
  
    const results = await query.limit(50).all();

  return c.render(
    <div>
        <a href={`/dashboard/users/${uid}`} class="signup-link">
          Back
        </a>
      <h1>Item History</h1>
      <p>Blank page for item history: {uid}</p>
              <div style="display:flex; flex-wrap:wrap; gap: 14px;">
                {results.length
                  ? results.map((b: any) => (
                      <SmallPost
                        bookingID={b.bookingID}
                        itemID={b.itemID}
                        uid={b.uid}
                        bookingDate={b.bookingDate}
                        returnDate={b.returnDate}
                        status={b.status}
                      />
                    ))
                  : (uid ? `No bookings found for "${uid}".` : 'No bookings found.')}
              </div>
    </div>
    
  );
};