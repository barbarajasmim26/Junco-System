import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db";

const router = Router();

async function ensureSettings() {
  const existing = await db.select().from(settingsTable);
  if (existing.length === 0) {
    await db.insert(settingsTable).values({
      businessName: "Vila do Junco Turismo",
      phone: "+55 98 98824-4342",
      email: "contato@viladojunco.com.br",
      whatsapp: "+55 98 98824-4342",
      instagram: "@viladojuncoturismo",
      facebook: "viladojuncoturismo",
      aiEnabled: true,
      aiPrompt: "Você é um assistente virtual da Vila do Junco Turismo, especializada em passeios e transfers na região dos Lençóis Maranhenses. Seja sempre cordial, informativo e incentive o cliente a realizar uma reserva.",
      adminPassword: "admin123",
    });
  }
}

router.get("/settings", async (req, res) => {
  try {
    await ensureSettings();
    const [settings] = await db.select().from(settingsTable);
    res.json(settings);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/settings", async (req, res) => {
  try {
    await ensureSettings();
    const [existing] = await db.select().from(settingsTable);
    const [settings] = await db.update(settingsTable)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(settingsTable.id, existing.id))
      .returning();
    res.json(settings);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
