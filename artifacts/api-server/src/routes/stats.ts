import { Router } from "express";
import { db } from "@workspace/db";
import { bookingsTable, customersTable, conversationsTable } from "@workspace/db";

const router = Router();

router.get("/stats/dashboard", async (req, res) => {
  try {
    const bookings = await db.select().from(bookingsTable).orderBy(bookingsTable.createdAt);
    const customers = await db.select().from(customersTable);
    const conversations = await db.select().from(conversationsTable);

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === "pending").length;
    const confirmedBookings = bookings.filter(b => b.status === "confirmed").length;
    const totalRevenue = bookings
      .filter(b => b.status !== "cancelled")
      .reduce((sum, b) => sum + parseFloat(b.totalPrice), 0);
    const totalCustomers = customers.length;
    const activeConversations = conversations.filter(c => c.status === "open").length;
    const recentBookings = bookings.slice(-5).reverse().map(b => ({ ...b, totalPrice: parseFloat(b.totalPrice) }));

    const bookingsByStatus: Record<string, number> = {};
    bookings.forEach(b => {
      bookingsByStatus[b.status] = (bookingsByStatus[b.status] || 0) + 1;
    });

    // Revenue by month (last 6 months)
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const revenueByMonth = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const monthBookings = bookings.filter(b => b.date.startsWith(monthStr));
      const revenue = monthBookings.filter(b => b.status !== "cancelled").reduce((sum, b) => sum + parseFloat(b.totalPrice), 0);
      revenueByMonth.push({
        month: monthNames[d.getMonth()],
        revenue,
        bookings: monthBookings.length,
      });
    }

    res.json({
      totalBookings,
      pendingBookings,
      confirmedBookings,
      totalRevenue,
      totalCustomers,
      activeConversations,
      recentBookings,
      bookingsByStatus,
      revenueByMonth,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
