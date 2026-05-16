import { useListLeads, useUpdateLead, getListLeadsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const stages = [
  { id: "novo", label: "Novo" },
  { id: "contatado", label: "Contatado" },
  { id: "proposta", label: "Proposta" },
  { id: "fechado", label: "Fechado" },
  { id: "perdido", label: "Perdido" },
];

export default function LeadsAdmin() {
  const { data: leads, isLoading } = useListLeads();
  const updateLead = useUpdateLead();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateLead.mutateAsync({ id, data: { status: newStatus } });
      queryClient.invalidateQueries({ queryKey: getListLeadsQueryKey() });
      toast({ title: "Lead movido com sucesso" });
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao mover lead" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map(stage => (
            <div key={stage.id} className="w-80 shrink-0 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-6rem)]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Leads</h1>
        <p className="text-muted-foreground mt-1">Acompanhe o funil de vendas e contatos do site.</p>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 flex-1 items-start">
        {stages.map(stage => {
          const stageLeads = leads?.filter(l => l.status === stage.id) || [];
          return (
            <div key={stage.id} className="w-[320px] shrink-0 flex flex-col max-h-full">
              <div className="flex items-center justify-between mb-4 bg-gray-200/50 p-3 rounded-lg border border-gray-200">
                <h3 className="font-bold text-gray-700">{stage.label}</h3>
                <Badge variant="secondary" className="bg-white">{stageLeads.length}</Badge>
              </div>
              
              <div className="space-y-3 overflow-y-auto pr-1">
                {stageLeads.map(lead => (
                  <Card key={lead.id} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm">{lead.name}</span>
                        <span className="text-[10px] text-muted-foreground">{format(new Date(lead.createdAt), "dd/MM", { locale: ptBR })}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{lead.email}</p>
                      {lead.message && (
                        <p className="text-xs bg-gray-50 p-2 rounded line-clamp-2 mb-3 border border-gray-100">{lead.message}</p>
                      )}
                      <Select 
                        defaultValue={lead.status} 
                        onValueChange={(val) => handleStatusChange(lead.id, val)}
                      >
                        <SelectTrigger className="w-full h-8 text-xs bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {stages.map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
