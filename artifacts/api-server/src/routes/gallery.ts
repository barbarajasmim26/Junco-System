import { Router } from "express";
import { db } from "@workspace/db";
import { galleryTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/gallery", async (req, res) => {
  try {
    let images = await db.select().from(galleryTable).orderBy(galleryTable.order);
    if (req.query.category) images = images.filter(i => i.category === req.query.category);
    res.json(images);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/gallery", async (req, res) => {
  try {
    const [image] = await db.insert(galleryTable).values(req.body).returning();
    res.status(201).json(image);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/gallery/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(galleryTable).where(eq(galleryTable.id, id));
    res.status(204).end();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
