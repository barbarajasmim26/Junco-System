import { Router } from "express";
import { db } from "@workspace/db";
import { faqsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/faqs", async (req, res) => {
  try {
    const faqs = await db.select().from(faqsTable).orderBy(faqsTable.order);
    res.json(faqs);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/faqs", async (req, res) => {
  try {
    const [faq] = await db.insert(faqsTable).values(req.body).returning();
    res.status(201).json(faq);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/faqs/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [faq] = await db.update(faqsTable).set(req.body).where(eq(faqsTable.id, id)).returning();
    if (!faq) return res.status(404).json({ error: "Not found" });
    res.json(faq);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/faqs/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(faqsTable).where(eq(faqsTable.id, id));
    res.status(204).end();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
