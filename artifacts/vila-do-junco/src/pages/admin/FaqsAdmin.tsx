import { useListFaqs, useDeleteFaq, getListFaqsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FaqsAdmin() {
  const { data: faqs, isLoading } = useListFaqs();
  const deleteFaq = useDeleteFaq();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir esta FAQ?")) return;
    try {
      await deleteFaq.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListFaqsQueryKey() });
      toast({ title: "FAQ excluída" });
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao excluir" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">FAQs</h1>
          <p className="text-muted-foreground mt-1">Perguntas Frequentes exibidas no site.</p>
        </div>
        <Button><Plus size={16} className="mr-2" /> Nova FAQ</Button>
      </div>

      <div className="bg-white rounded-xl border p-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {faqs?.map((faq) => (
              <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                <div className="flex items-center">
                  <AccordionTrigger className="flex-1 text-left">{faq.question}</AccordionTrigger>
                  <div className="flex gap-2 pr-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Edit2 size={16} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(faq.id)}><Trash2 size={16} /></Button>
                  </div>
                </div>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                  <div className="mt-2 text-xs font-bold text-gray-400 uppercase">
                    Categoria: {faq.category || "Geral"}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}
