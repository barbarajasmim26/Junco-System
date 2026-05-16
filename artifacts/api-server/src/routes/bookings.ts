import { Router } from "express";
import { db } from "@workspace/db";
import { bookingsTable, toursTable, transfersTable } from "@workspace/db";
import { eq, and, gte, lte } from "drizzle-orm";

const router = Router();

router.get("/bookings", async (req, res) => {
  try {
    let bookings = await db.select().from(bookingsTable).orderBy(bookingsTable.createdAt);
    if (req.query.status) bookings = bookings.filter(b => b.status === req.query.status);
    if (req.query.type) bookings = bookings.filter(b => b.type === req.query.type);
    if (req.query.customerId) bookings = bookings.filter(b => b.customerId === parseInt(req.query.customerId as string));
    if (req.query.dateFrom) bookings = bookings.filter(b => b.date >= (req.query.dateFrom as string));
    if (req.query.dateTo) bookings = bookings.filter(b => b.date <= (req.query.dateTo as string));
    res.json(bookings.map(b => ({ ...b, totalPrice: parseFloat(b.totalPrice) })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/bookings/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id));
    if (!booking) return res.status(404).json({ error: "Not found" });
    res.json({ ...booking, totalPrice: parseFloat(booking.totalPrice) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/bookings", async (req, res) => {
  try {
    // Auto-fill itemName if not provided
    const body = { ...req.body };
    if (!body.itemName && body.itemId) {
      if (body.type === "tour") {
        const [tour] = await db.select().from(toursTable).where(eq(toursTable.id, body.itemId));
        if (tour) body.itemName = tour.name;
      } else if (body.type === "transfer") {
        const [transfer] = await db.select().from(transfersTable).where(eq(transfersTable.id, body.itemId));
        if (transfer) body.itemName = transfer.name;
      }
    }
    if (!body.itemName) body.itemName = "Item";
    const [booking] = await db.insert(bookingsTable).values(body).returning();
    res.status(201).json({ ...booking, totalPrice: parseFloat(booking.totalPrice) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/bookings/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [booking] = await db.update(bookingsTable).set(req.body).where(eq(bookingsTable.id, id)).returning();
    if (!booking) return res.status(404).json({ error: "Not found" });
    res.json({ ...booking, totalPrice: parseFloat(booking.totalPrice) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/bookings/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(bookingsTable).where(eq(bookingsTable.id, id));
    res.status(204).end();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/availability", async (req, res) => {
  try {
    const year = parseInt(req.query.year as string);
    const month = parseInt(req.query.month as string);
    // Get number of days in month
    const daysInMonth = new Date(year, month, 0).getDate();
    const bookings = await db.select().from(bookingsTable);
    const result = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dayBookings = bookings.filter(b => b.date === dateStr);
      result.push({ date: dateStr, bookingsCount: dayBookings.length, available: dayBookings.length < 10 });
    }
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
