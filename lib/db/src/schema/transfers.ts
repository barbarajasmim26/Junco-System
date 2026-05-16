import { pgTable, serial, text, integer, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const transfersTable = pgTable("transfers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  pricePerPerson: boolean("price_per_person").notNull().default(false),
  maxPeople: integer("max_people").notNull().default(6),
  duration: text("duration").notNull(),
  imageUrl: text("image_url"),
  vehicleType: text("vehicle_type").notNull().default("van"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTransferSchema = createInsertSchema(transfersTable).omit({ id: true, createdAt: true });
export type InsertTransfer = z.infer<typeof insertTransferSchema>;
export type Transfer = typeof transfersTable.$inferSelect;
