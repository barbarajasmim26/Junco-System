import { Router } from "express";
import { db } from "@workspace/db";
import { leadsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/leads", async (req, res) => {
  try {
    let leads = await db.select().from(leadsTable).orderBy(leadsTable.createdAt);
    if (req.query.status) leads = leads.filter(l => l.status === req.query.status);
    res.json(leads);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/leads", async (req, res) => {
  try {
    const [lead] = await db.insert(leadsTable).values(req.body).returning();
    res.status(201).json(lead);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/leads/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [lead] = await db.update(leadsTable).set(req.body).where(eq(leadsTable.id, id)).returning();
    if (!lead) return res.status(404).json({ error: "Not found" });
    res.json(lead);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
