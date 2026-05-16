import { Router } from "express";
import { db } from "@workspace/db";
import { conversationsTable, messagesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/conversations", async (req, res) => {
  try {
    let convs = await db.select().from(conversationsTable).orderBy(conversationsTable.updatedAt);
    convs = convs.reverse();
    if (req.query.status) convs = convs.filter(c => c.status === req.query.status);
    if (req.query.channel) convs = convs.filter(c => c.channel === req.query.channel);
    res.json(convs);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/conversations", async (req, res) => {
  try {
    const [conv] = await db.insert(conversationsTable).values(req.body).returning();
    res.status(201).json(conv);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/conversations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [conv] = await db.select().from(conversationsTable).where(eq(conversationsTable.id, id));
    if (!conv) return res.status(404).json({ error: "Not found" });
    const messages = await db.select().from(messagesTable).where(eq(messagesTable.conversationId, id)).orderBy(messagesTable.createdAt);
    // Reset unread count
    await db.update(conversationsTable).set({ unreadCount: 0 }).where(eq(conversationsTable.id, id));
    res.json({ ...conv, messages });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/conversations/:id/messages", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [message] = await db.insert(messagesTable).values({ ...req.body, conversationId: id }).returning();
    // Update conversation's last message and updatedAt
    await db.update(conversationsTable).set({
      lastMessage: req.body.content,
      updatedAt: new Date(),
    }).where(eq(conversationsTable.id, id));
    res.status(201).json(message);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
