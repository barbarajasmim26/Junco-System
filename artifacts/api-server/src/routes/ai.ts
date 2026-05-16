import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { conversationsTable, messagesTable, knowledgeTable, settingsTable } from "@workspace/db";

const router = Router();

function getFallbackReply(message: string): string {
  const msg = message.toLowerCase();
  if (msg.includes("passeio") || msg.includes("tour")) {
    return "Temos passeios incríveis pelos Lençóis Maranhenses! Nossos principais passeios incluem o Lagoas do Peito de Moça, Lagoa Azul e muitos mais. Gostaria de saber mais sobre algum passeio específico?";
  }
  if (msg.includes("transfer") || msg.includes("transporte")) {
    return "Oferecemos transfers confortáveis de/para aeroporto, rodoviária e entre cidades. Qual é seu ponto de partida e destino?";
  }
  if (msg.includes("preço") || msg.includes("valor") || msg.includes("custa")) {
    return "Os preços variam conforme o passeio e a quantidade de pessoas. Para um orçamento personalizado, pode me dizer qual passeio te interessa e quantas pessoas serão?";
  }
  if (msg.includes("reserva") || msg.includes("agendar") || msg.includes("marcar")) {
    return "Que ótimo que quer fazer uma reserva! Você pode agendar diretamente pelo nosso site, escolhendo o passeio, a data e a quantidade de pessoas. Posso te ajudar com alguma dúvida sobre disponibilidade?";
  }
  if (msg.includes("contato") || msg.includes("telefone") || msg.includes("whatsapp")) {
    return "Nosso WhatsApp é (98) 98824-4342. Você também pode nos encontrar no Instagram @viladojuncoturismo. Estamos disponíveis para atendê-lo!";
  }
  return "Olá! Sou o assistente virtual da Vila do Junco Turismo. Posso te ajudar com informações sobre passeios, transfers e reservas pelos Lençóis Maranhenses. O que você gostaria de saber?";
}

router.post("/ai/chat", async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const [settings] = await db.select().from(settingsTable);

    if (!settings?.aiEnabled) {
      return res.json({ reply: "Atendimento automático desabilitado. Aguarde um atendente.", conversationId: conversationId || null });
    }

    const knowledge = await db.select().from(knowledgeTable).where(eq(knowledgeTable.active, true));
    const knowledgeContext = knowledge.map(k => `${k.title}: ${k.content}`).join("\n\n");

    const systemPrompt = settings?.aiPrompt ||
      "Você é um assistente virtual da Vila do Junco Turismo. Seja sempre cordial e informativo.";

    let reply = "";

    if (process.env.OPENAI_API_KEY) {
      try {
        const { default: OpenAI } = await import("openai");
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: `${systemPrompt}\n\nBase de conhecimento:\n${knowledgeContext}` },
            { role: "user", content: message }
          ],
          max_tokens: 500,
        });
        reply = completion.choices[0]?.message?.content || "Desculpe, não consegui processar sua mensagem.";
      } catch {
        reply = getFallbackReply(message);
      }
    } else {
      reply = getFallbackReply(message);
    }

    if (conversationId) {
      await db.insert(messagesTable).values({ conversationId, content: message, sender: "customer", isAi: false });
      await db.insert(messagesTable).values({ conversationId, content: reply, sender: "ai", isAi: true });
      await db.update(conversationsTable).set({ lastMessage: reply, updatedAt: new Date() }).where(eq(conversationsTable.id, conversationId));
    }

    res.json({ reply, conversationId: conversationId || null });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
