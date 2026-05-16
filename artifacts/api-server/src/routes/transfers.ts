import { Router } from "express";
import { db } from "@workspace/db";
import { transfersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/transfers", async (req, res) => {
  try {
    const transfers = await db.select().from(transfersTable).orderBy(transfersTable.createdAt);
    res.json(transfers.map(t => ({ ...t, price: parseFloat(t.price) })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/transfers/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [transfer] = await db.select().from(transfersTable).where(eq(transfersTable.id, id));
    if (!transfer) return res.status(404).json({ error: "Not found" });
    res.json({ ...transfer, price: parseFloat(transfer.price) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/transfers", async (req, res) => {
  try {
    const [transfer] = await db.insert(transfersTable).values(req.body).returning();
    res.status(201).json({ ...transfer, price: parseFloat(transfer.price) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/transfers/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [transfer] = await db.update(transfersTable).set(req.body).where(eq(transfersTable.id, id)).returning();
    if (!transfer) return res.status(404).json({ error: "Not found" });
    res.json({ ...transfer, price: parseFloat(transfer.price) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/transfers/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(transfersTable).where(eq(transfersTable.id, id));
    res.status(204).end();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
