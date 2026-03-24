// src/routes/Dashboard/EditItem.tsx
import { Context } from 'hono';
import { getCurrentUser } from '@/auth';
import { getDB } from '@/models/db';
import { types, items } from '@/models/schema';
import { eq } from 'drizzle-orm';
import { ItemForm } from '@/views/components/ItemForm';

export const onRequestGet = async (c: Context) => {
  const { admin } = await getCurrentUser(c) ?? { user: null, admin: null };
  if (!admin) return c.redirect('/dashboard');

  const itemID = parseInt(c.req.param('itemID'));
  if (isNaN(itemID)) return c.redirect('/dashboard/items?error=Invalid ID');

  const db = getDB(c.env);
  const result = await db
    .select({
      itemID: items.itemID, status: items.status, name: items.name, 
      description: types.description, manual: types.manual,
      imageDir: types.ImageDir, availability: types.availability,
    })
    .from(items)
    .innerJoin(types, eq(items.name, types.name))
    .where(eq(items.itemID, itemID)).get();

  if (!result) return c.redirect('/dashboard/items?error=Not found');

  const url = new URL(c.req.url);
  return c.render(
    <ItemForm 
      action={`/dashboard/items/${itemID}/edit`} 
      mode="edit" 
      defaultValues={{ ...result, itemID: result.itemID.toString() }} 
      success={url.searchParams.get('success')}
      error={url.searchParams.get('error')}
    />
  );
};

export const onRequestPost = async (c: Context) => {
  const { admin } = await getCurrentUser(c) ?? { user: null, admin: null };
  if (!admin) return c.redirect('/dashboard?error=Unauthorized');

  const itemID = parseInt(c.req.param('itemID'));
  const formData = await c.req.parseBody();
  
  // Re-render helper for errors
  const renderError = (msg: string) => c.render(
    <ItemForm 
      action={`/dashboard/items/${itemID}/edit`} 
      mode="edit" 
      defaultValues={{
        name: formData.name as string,
        itemID: itemID.toString(),
        status: formData.status as string,
        description: formData.description as string,
        manual: formData.manual as string,
        imageDir: formData.imageDir as string,
        availability: formData.availability as string
      }} 
      error={msg} 
    />
  );

  try {
    const db = getDB(c.env);
    await db.update(items).set({ status: formData.status as string }).where(eq(items.itemID, itemID));
    await db.update(types).set({
      description: formData.description as string,
      manual: formData.manual as string,
      ImageDir: formData.imageDir as string,
      availability: formData.availability as string
    }).where(eq(types.name, formData.name as string));

    return c.redirect(`/dashboard/items/${itemID}/edit?success=true`);
  } catch (error) {
    return renderError("Update failed");
  }
};