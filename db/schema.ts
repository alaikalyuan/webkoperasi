import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
  completed: integer("completed", { mode: "boolean" }).default(false),
});

export const activities = sqliteTable("activities", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  imageUrl: text("imageUrl"),
});

export const members = sqliteTable("members", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  joinDate: text("joinDate").notNull(),
});

export const financial = sqliteTable("financial", {
  id: integer("id").primaryKey(),
  date: text("date").notNull(),
  category: text("category").notNull(),
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
});

export const cooperative = sqliteTable("cooperative", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
});

export const staff = sqliteTable("staff", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  position: text("position").notNull(),
  category: text("category").notNull(), // "pengurus" or "dewan_pengawas"
  imageUrl: text("imageUrl"),
});