import { useListGallery, useDeleteGalleryImage, getListGalleryQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

export default function GalleryAdmin() {
  const { data: images, isLoading } = useListGallery();
  const deleteImage = useDeleteGalleryImage();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir esta imagem?")) return;
    try {
      await deleteImage.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() });
      toast({ title: "Imagem excluída" });
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao excluir" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Galeria de Fotos</h1>
          <p className="text-muted-foreground mt-1">Gerencie as imagens exibidas no site público.</p>
        </div>
        <Button><Plus size={16} className="mr-2" /> Adicionar Foto</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array(8).fill(0).map((_, i) => <Skeleton key={i} className="aspect-square w-full rounded-xl" />)
        ) : images?.map((img) => (
          <Card key={img.id} className="overflow-hidden group relative">
            <div className="aspect-square">
              <img src={img.url} alt={img.title || "Galeria"} className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
              <div className="flex justify-end">
                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(img.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
              <div>
                <p className="text-white text-xs font-bold truncate">{img.category}</p>
                <p className="text-white/80 text-xs truncate">{img.title}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
