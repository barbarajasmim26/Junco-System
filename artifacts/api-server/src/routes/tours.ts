import { Router } from "express";
import { db } from "@workspace/db";
import { toursTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/tours", async (req, res) => {
  try {
    let tours = await db.select().from(toursTable).orderBy(toursTable.createdAt);
    if (req.query.active !== undefined) {
      tours = tours.filter(t => t.active === (req.query.active === "true"));
    }
    if (req.query.category) {
      tours = tours.filter(t => t.category === req.query.category);
    }
    res.json(tours.map(t => ({
      ...t,
      price: parseFloat(t.price),
    })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/tours/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [tour] = await db.select().from(toursTable).where(eq(toursTable.id, id));
    if (!tour) return res.status(404).json({ error: "Not found" });
    res.json({ ...tour, price: parseFloat(tour.price) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/tours", async (req, res) => {
  try {
    const [tour] = await db.insert(toursTable).values(req.body).returning();
    res.status(201).json({ ...tour, price: parseFloat(tour.price) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/tours/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [tour] = await db.update(toursTable).set(req.body).where(eq(toursTable.id, id)).returning();
    if (!tour) return res.status(404).json({ error: "Not found" });
    res.json({ ...tour, price: parseFloat(tour.price) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/tours/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(toursTable).where(eq(toursTable.id, id));
    res.status(204).end();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
