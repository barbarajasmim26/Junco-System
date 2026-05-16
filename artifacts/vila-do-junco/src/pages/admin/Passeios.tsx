import { useState } from "react";
import { useListTours, useCreateTour, useUpdateTour, useDeleteTour, getListToursQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function PasseiosAdmin() {
  const { data: tours, isLoading } = useListTours();
  const updateTour = useUpdateTour();
  const deleteTour = useDeleteTour();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    try {
      await updateTour.mutateAsync({ id, data: { active: !currentActive } });
      queryClient.invalidateQueries({ queryKey: getListToursQueryKey() });
      toast({ title: "Status atualizado" });
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao atualizar" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    try {
      await deleteTour.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListToursQueryKey() });
      toast({ title: "Passeio excluído" });
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao excluir" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Passeios</h1>
          <p className="text-muted-foreground mt-1">Gerencie seu catálogo de tours e passeios.</p>
        </div>
        <Button><Plus size={16} className="mr-2" /> Novo Passeio</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-xl" />)
        ) : tours?.map((tour) => (
          <Card key={tour.id} className={`overflow-hidden flex flex-col ${!tour.active && "opacity-70 grayscale-[50%]"}`}>
            <div className="h-40 overflow-hidden relative">
              <img src={tour.imageUrl || "/tour-lagoons.png"} alt={tour.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-lg">{tour.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{tour.category} • {tour.duration}</p>
              
              <div className="mt-auto pt-4 border-t flex items-center justify-between">
                <span className="font-bold text-primary">R$ {tour.price.toFixed(2)}</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 mr-2">
                    <span className="text-xs font-medium text-muted-foreground">{tour.active ? "Ativo" : "Inativo"}</span>
                    <Switch checked={tour.active} onCheckedChange={() => handleToggleActive(tour.id, tour.active)} />
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Edit2 size={16} /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(tour.id)}><Trash2 size={16} /></Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
