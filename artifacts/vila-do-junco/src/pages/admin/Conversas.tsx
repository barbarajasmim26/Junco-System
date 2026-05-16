import { useState } from "react";
import { useListConversations, useGetConversation, getGetConversationQueryKey, useAddMessage, useAiChat } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, UserCheck, MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

export default function ConversasAdmin() {
  const { data: conversations, isLoading: loadingConversations } = useListConversations();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const { data: conversationDetail, isLoading: loadingDetail } = useGetConversation(
    selectedId || 0,
    { query: { enabled: !!selectedId, queryKey: getGetConversationQueryKey(selectedId || 0) } }
  );
  
  const addMessage = useAddMessage();
  const aiChat = useAiChat();
  
  const [draft, setDraft] = useState("");

  const handleSend = async () => {
    if (!draft.trim() || !selectedId) return;
    
    const content = draft;
    setDraft("");
    
    await addMessage.mutateAsync({
      id: selectedId,
      data: {
        content,
        sender: "agent",
        isAi: false
      }
    });
  };

  const handleAiReply = async () => {
    if (!selectedId) return;
    
    // Simplistic AI integration
    await aiChat.mutateAsync({
      data: {
        message: "Gerar resposta sugerida",
        conversationId: selectedId
      }
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex border rounded-xl overflow-hidden bg-white">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-border flex flex-col bg-gray-50/50">
        <div className="p-4 border-b border-border bg-white">
          <h2 className="font-bold text-lg">Conversas</h2>
        </div>
        <ScrollArea className="flex-1">
          {loadingConversations ? (
            <div className="p-4 space-y-4">
              {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
            </div>
          ) : conversations?.map(conv => (
            <div 
              key={conv.id}
              onClick={() => setSelectedId(conv.id)}
              className={`p-4 border-b border-border cursor-pointer hover:bg-white transition-colors ${selectedId === conv.id ? "bg-white border-l-4 border-l-primary" : ""}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-sm text-foreground">{conv.customerName}</span>
                <span className="text-xs text-muted-foreground uppercase">{conv.channel}</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">{conv.lastMessage || "Nenhuma mensagem"}</p>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedId ? (
          loadingDetail ? (
            <div className="flex-1 flex items-center justify-center">Carregando...</div>
          ) : (
            <>
              {/* Header */}
              <div className="p-4 border-b border-border flex justify-between items-center bg-white">
                <div>
                  <h3 className="font-bold text-lg">{conversationDetail?.customerName}</h3>
                  <p className="text-xs text-muted-foreground">{conversationDetail?.customerPhone || "Sem telefone"}</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleAiReply} disabled={aiChat.isPending}>
                  <Bot size={16} className="mr-2 text-primary" />
                  {aiChat.isPending ? "Gerando..." : "Sugerir Resposta AI"}
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-6 flex flex-col">
                  {conversationDetail?.messages.map((msg) => {
                    const isCustomer = msg.sender === "customer";
                    return (
                      <div key={msg.id} className={`flex ${isCustomer ? "justify-start" : "justify-end"}`}>
                        <div className={`max-w-[70%] rounded-2xl p-3 ${
                          isCustomer 
                            ? "bg-gray-100 text-gray-900 rounded-tl-sm" 
                            : msg.isAi 
                              ? "bg-primary/10 text-primary-foreground border border-primary/20 rounded-tr-sm"
                              : "bg-primary text-primary-foreground rounded-tr-sm"
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          <div className={`text-[10px] mt-1 flex items-center gap-1 opacity-70 ${isCustomer ? "justify-start" : "justify-end"}`}>
                            {msg.isAi && <Bot size={10} />}
                            {format(new Date(msg.createdAt), "HH:mm")}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-border bg-gray-50 flex gap-2">
                <Input 
                  placeholder="Digite sua mensagem..." 
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  className="bg-white"
                />
                <Button onClick={handleSend} disabled={!draft.trim() || addMessage.isPending}>
                  <Send size={18} />
                </Button>
              </div>
            </>
          )
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-4">
            <MessageSquare size={48} className="text-gray-200" />
            <p>Selecione uma conversa para começar</p>
          </div>
        )}
      </div>
    </div>
  );
}
