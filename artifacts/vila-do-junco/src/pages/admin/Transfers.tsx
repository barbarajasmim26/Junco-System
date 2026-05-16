import { useState } from "react";
import { useListTransfers, useCreateTransfer, useUpdateTransfer, useDeleteTransfer, getListTransfersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TransfersAdmin() {
  const { data: transfers, isLoading } = useListTransfers();
  const updateTransfer = useUpdateTransfer();
  const deleteTransfer = useDeleteTransfer();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    try {
      await updateTransfer.mutateAsync({ id, data: { active: !currentActive } });
      queryClient.invalidateQueries({ queryKey: getListTransfersQueryKey() });
      toast({ title: "Status atualizado" });
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao atualizar" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    try {
      await deleteTransfer.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListTransfersQueryKey() });
      toast({ title: "Transfer excluído" });
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao excluir" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transfers</h1>
          <p className="text-muted-foreground mt-1">Gerencie rotas e opções de transporte.</p>
        </div>
        <Button><Plus size={16} className="mr-2" /> Novo Transfer</Button>
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Origem → Destino</TableHead>
              <TableHead>Veículo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 float-right" /></TableCell>
                </TableRow>
              ))
            ) : transfers?.map((transfer) => (
              <TableRow key={transfer.id}>
                <TableCell className="font-medium">{transfer.name}</TableCell>
                <TableCell>{transfer.origin} → {transfer.destination}</TableCell>
                <TableCell>{transfer.vehicle || "-"}</TableCell>
                <TableCell className="font-bold text-primary">R$ {transfer.price.toFixed(2)} {transfer.pricePerPerson && <span className="text-xs font-normal text-muted-foreground">/p</span>}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch checked={transfer.active} onCheckedChange={() => handleToggleActive(transfer.id, transfer.active)} />
                    <span className="text-xs font-medium text-muted-foreground">{transfer.active ? "Ativo" : "Inativo"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Edit2 size={16} /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(transfer.id)}><Trash2 size={16} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
