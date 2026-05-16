import { Router } from "express";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db";

const router = Router();

router.post("/admin/login", async (req, res) => {
  try {
    const { password } = req.body;
    const [settings] = await db.select().from(settingsTable);
    const adminPassword = settings?.adminPassword || "admin123";
    if (password === adminPassword) {
      res.json({ success: true, token: "admin-token-" + Date.now() });
    } else {
      res.status(401).json({ success: false, token: "" });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
