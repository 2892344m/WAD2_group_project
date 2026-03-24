import { Context } from 'hono';
import { items, types } from '../../models/schema';
import { getDB } from '../../models/db';
import { SmallPostItem } from '../../views/components/smallPostItem';
import { SearchBar } from '../../views/components/SearchBar';
import { eq, like, or } from 'drizzle-orm';

export const onRequestGet = async (c: Context) => {
  const db = getDB(c.env);
  const q = (c.req.query('q') || '').toString().trim();

  let query = db
    .select({
      itemID: items.itemID,
      name: items.name,
      status: items.status,
      imageDir: types.ImageDir,
    })
    .from(items)
    .innerJoin(types, eq(items.name, types.name));

  // Filter by item name (contains) OR itemID (exact match)
  if (q) {
    const maybeId = Number(q);
    const isIdSearch = Number.isFinite(maybeId) && q !== '';

    query = query.where(
      isIdSearch
        ? or(eq(items.itemID, maybeId), like(items.name, `%${q}%`))
        : like(items.name, `%${q}%`)
    );
  }

  const results = await query.limit(50).all();

  return c.render(
    <div class="min-h-screen bg-[#f6f7f9]">
      <div class="mx-auto max-w-[1200px] px-[22px] pt-[22px] pb-[60px]">
        <h1 class="mb-4 text-2xl font-semibold tracking-tight capitalize text-[#003865]">
          Item Library
        </h1>

        <SearchBar
          action="/dashboard/items"
          q={q}
          placeholder="Search items by name or ID (e.g., Camera or 12)"
          clearHref="/dashboard/items"
        />

        <div class="grid grid-cols-[repeat(auto-fill,170px)] gap-3.5 items-start">
          {results.length
            ? results.map((it: any) => (
                <SmallPostItem
                  key={it.itemID}
                  itemID={it.itemID}
                  name={it.name}
                  status={it.status}
                  imageDir={it.imageDir}
                  showEdit={true}
                  showHistory={it.admin}
                />
              ))
            : (q ? `No items found for "${q}".` : 'No items found.')}
        </div>
      </div>
    </div>
  );
};