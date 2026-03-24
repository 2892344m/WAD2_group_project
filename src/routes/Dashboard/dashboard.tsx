import { Context } from 'hono';
import { getCookie } from 'hono/cookie';
import { users } from '../../models/schema';
import { admins } from '../../models/schema';
import { getDB } from '../../models/db';
import { eq } from 'drizzle-orm';

const DashboardTile = ({
  href,
  label,
  icon,
  bgClass,
}: {
  href: string;
  label: string;
  bgClass: string;
  icon: any;
}) => (
  <a
    href={href}
    class="flex flex-col items-center no-underline group"
  >
    <div
      class={`w-[240px] h-[140px] ${bgClass} rounded-[18px] flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:-translate-y-1`}
    >
      {icon}
    </div>

    <div class="mt-2.5 text-sm font-semibold text-gray-900">
      {label}
    </div>
  </a>
);

export const onRequestGet = async (c: Context) => {

  const session = getCookie(c, 'session');

  if (!session) {
    return c.redirect('/login');
  }

  const db = getDB(c.env);
  const admin = await db
    .select()
    .from(admins)
    .where(eq(admins.uid, Number(session)))
    .get();

  if (!admin) {
    return c.redirect('/library');
  }
  return c.render(
    <div class="bg-[#f6f7f9] min-h-screen">
      <div class="max-w-[1100px] mx-auto px-[22px] pt-[22px] pb-[60px]">
        <div class="text-[#003865] font-extrabold mb-2.5">
          Admin Dashboard
        </div>

        <div class="flex justify-center gap-[50px] flex-wrap pt-[60px] pb-[22px]">
          <DashboardTile
            href="/dashboard/items"
            label="Item Library"
            bgClass="bg-[#1f5aa6]"
            icon={
              <svg width="70" height="70" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 19V6a2 2 0 0 1 2-2h6v15H6a2 2 0 0 0-2 2Zm8 0V4h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2h-6Z"
                  stroke="white"
                  stroke-width="2.2"
                  stroke-linejoin="round"
                />
              </svg>
            }
          />

          <DashboardTile
            href="/dashboard/users"
            label="Find User"
            bgClass="bg-[#c05a00]"
            icon={
              <svg width="70" height="70" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2v4M12 18v4M2 12h4M18 12h4"
                  stroke="white"
                  stroke-width="2.2"
                  stroke-linecap="round"
                />
                <circle cx="12" cy="12" r="6" stroke="white" stroke-width="2.2" />
                <circle cx="12" cy="12" r="1.5" fill="white" />
              </svg>
            }
          />

          <DashboardTile
            href="/dashboard/bookings"
            label="Borrowed Items"
            bgClass="bg-[#b00020]"
            icon={
              <svg width="70" height="70" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 7 12 2 3 7v10l9 5 9-5V7Z"
                  stroke="white"
                  stroke-width="2.2"
                  stroke-linejoin="round"
                />
                <path
                  d="M3 7l9 5 9-5"
                  stroke="white"
                  stroke-width="2.2"
                  stroke-linejoin="round"
                />
              </svg>
            }
          />

          <DashboardTile
            href="/dashboard/addNewItem"
            label="Add a new Item"
            bgClass="bg-[#8C0E7A]"
            icon={
              <svg width="76" height="76" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="16" height="16" rx="3" stroke="white" stroke-width="2.3" />
                <path
                  d="M12 8v8M8 12h8"
                  stroke="white"
                  stroke-width="2.3"
                  stroke-linecap="round"
                />
              </svg>
            }
          />

          <DashboardTile
            href="/dashboard/requests"
            label="Requests"
            bgClass="bg-[#5C4E97]"
            icon={
              <svg width="76" height="76" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 7l7-4 7 4-7 4-7-4Z"
                  stroke="white"
                  stroke-width="2.3"
                  stroke-linejoin="round"
                />
                <path
                  d="M5 7v10l7 4 7-4V7"
                  stroke="white"
                  stroke-width="2.3"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 11v10"
                  stroke="white"
                  stroke-width="2.3"
                  stroke-linecap="round"
                />
              </svg>
            }
          />

          <DashboardTile
            href="/dashboard/profile"
            label="Profile"
            bgClass="bg-[#176B2D]"
            icon={
              <svg width="76" height="76" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                  stroke="white"
                  stroke-width="2.3"
                />
                <path
                  d="M19 22a7 7 0 0 0-14 0"
                  stroke="white"
                  stroke-width="2.3"
                  stroke-linecap="round"
                />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
};