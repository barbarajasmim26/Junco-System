import { useListKnowledge, useCreateKnowledge, useDeleteKnowledge, getListKnowledgeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function KnowledgeBase() {
  const { data: entries, isLoading } = useListKnowledge();
  const deleteEntry = useDeleteKnowledge();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir este artigo?")) return;
    try {
      await deleteEntry.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListKnowledgeQueryKey() });
      toast({ title: "Artigo excluído" });
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao excluir" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Base de Conhecimento</h1>
          <p className="text-muted-foreground mt-1">Artigos para treinamento da IA e da equipe.</p>
        </div>
        <Button><Plus size={16} className="mr-2" /> Novo Artigo</Button>
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-12 float-right" /></TableCell>
                </TableRow>
              ))
            ) : entries?.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  <BookOpen size={16} className="text-muted-foreground" />
                  {entry.title}
                </TableCell>
                <TableCell>{entry.category}</TableCell>
                <TableCell>{entry.tags || "-"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(entry.id)}><Trash2 size={16} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
