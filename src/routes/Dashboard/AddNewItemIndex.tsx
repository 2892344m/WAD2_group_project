import { Context } from 'hono';
import { getCurrentUser } from '@/auth';
import { getDB } from '@/models/db';
import { types, items } from '@/models/schema';
import { eq } from 'drizzle-orm';
import { ItemForm } from '@/views/components/ItemForm';

export const onRequestGet = async (c: Context) => {
  const { admin } = await getCurrentUser(c) ?? { user: null, admin: null };
  if (!admin) return c.redirect('/dashboard');

  const url = new URL(c.req.url);
  return c.render(
    <ItemForm 
      action="/dashboard/addNewItem" 
      mode="add" 
      success={url.searchParams.get('success')} 
      error={url.searchParams.get('error')} 
    />
  );
};

export const onRequestPost = async (c: Context) => {
  const { admin } = await getCurrentUser(c) ?? { user: null, admin: null };
  if (!admin) return c.redirect('/dashboard?error=Unauthorized');

  const formData = await c.req.parseBody();
  const name = formData.name as string;
  const manual = formData.manual as string;
  const itemIDStr = formData.itemID as string;
  const itemID = parseInt(itemIDStr);
  const status = formData.status as string;
  const imageDir = (formData.imageDir as string) || null;

  // Object to preserve data on re-render
  const currentValues = {
    name, manual, itemID: itemIDStr, status, 
    description: formData.description as string,
    imageDir,
    availability: formData.availability as string
  };

  const renderError = (msg: string) => c.render(
    <ItemForm action="/dashboard/addNewItem" mode="add" defaultValues={currentValues} error={msg} />
  );

  try {
    if (!name || !manual || !itemIDStr || !status) return renderError("Missing required fields");
    if (isNaN(itemID)) return renderError("Invalid Item ID");

    const db = getDB(c.env);
    const existingItem = await db.select().from(items).where(eq(items.itemID, itemID)).get();
    if (existingItem) return renderError(`Item ID ${itemID} already exists`);

    // Insert or Update Type logic
    const existingType = await db.select().from(types).where(eq(types.name, name)).get();
    if (!existingType) {
      await db.insert(types).values({
        name, manual, 
        ImageDir: imageDir,
        description: currentValues.description || null,
        availability: currentValues.availability || null,
      });
    } else {
      await db.update(types).set({
        manual,
        ImageDir: imageDir || existingType.ImageDir,
        description: currentValues.description || existingType.description,
        availability: currentValues.availability || existingType.availability,
      }).where(eq(types.name, name));
    }

    await db.insert(items).values({ itemID, status, name });
    return c.redirect('/dashboard/addNewItem?success=true');
  } catch (err) {
    return renderError("An error occurred while adding the item");
  }
};