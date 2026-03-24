import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export type User = typeof users.$inferSelect;
export type Admin = typeof admins.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
export type Types = typeof types.$inferSelect;
export type Items = typeof items.$inferSelect;
export type Bookings = typeof bookings.$inferSelect;

export const users = sqliteTable('users', {
  uid: integer('uid').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text("name").notNull(),
  password: text('password').notNull(),
  resetToken: text("resetToken"),
  resetTokenExpiry: integer("resetTokenExpiry"),
});

export const admins = sqliteTable('admins', {
  uid: integer('uid').primaryKey().notNull().references(() => users.uid, { onDelete: 'cascade' }),
});

export const types = sqliteTable('types', {
  name: text('name').primaryKey().notNull(),
  manual: text('manual').notNull(),
  ImageDir: text('imageDir'),
  description: text('description'),
  availability: text('availability'),
});


export const items = sqliteTable('items', {
  itemID: integer('itemID').primaryKey().notNull(),
  status: text('status').notNull(),
  name: text('name').notNull().references(() => types.name, { onDelete: 'cascade' }),
});

export const bookings = sqliteTable('bookings', {
  bookingID: integer('bookingID').primaryKey().notNull(),
  itemID: integer('itemID').notNull().references(() => items.itemID, { onDelete: 'cascade' }),
  uid: integer('uid').notNull().references(() => users.uid, { onDelete: 'cascade' }),
  bookingDate: text("bookingDate"),
  returnDate: text("returnDate"),
  status: text("status"),
});


export const schema = {
  users,
  admins,
  types,
  items,
  bookings,
};
