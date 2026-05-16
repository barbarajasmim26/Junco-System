import { pgTable, serial, text, integer, numeric, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const toursTable = pgTable("tours", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  duration: text("duration").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  maxPeople: integer("max_people").notNull().default(10),
  category: text("category").notNull().default("passeio"),
  imageUrl: text("image_url"),
  images: jsonb("images").$type<string[]>().default([]),
  highlights: jsonb("highlights").$type<string[]>().default([]),
  included: jsonb("included").$type<string[]>().default([]),
  meetingPoint: text("meeting_point"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTourSchema = createInsertSchema(toursTable).omit({ id: true, createdAt: true });
export type InsertTour = z.infer<typeof insertTourSchema>;
export type Tour = typeof toursTable.$inferSelect;
