import { Router } from "express";
import { db } from "@workspace/db";
import { knowledgeTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/knowledge", async (req, res) => {
  try {
    const entries = await db.select().from(knowledgeTable).orderBy(knowledgeTable.createdAt);
    res.json(entries);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/knowledge", async (req, res) => {
  try {
    const [entry] = await db.insert(knowledgeTable).values(req.body).returning();
    res.status(201).json(entry);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/knowledge/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [entry] = await db.update(knowledgeTable).set(req.body).where(eq(knowledgeTable.id, id)).returning();
    if (!entry) return res.status(404).json({ error: "Not found" });
    res.json(entry);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/knowledge/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(knowledgeTable).where(eq(knowledgeTable.id, id));
    res.status(204).end();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
