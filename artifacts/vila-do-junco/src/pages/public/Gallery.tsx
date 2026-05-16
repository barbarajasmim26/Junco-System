import { useState } from "react";
import { motion } from "framer-motion";
import { useListGallery } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Gallery() {
  const { data: gallery, isLoading } = useListGallery();
  const [filter, setFilter] = useState("all");

  const categories = gallery ? ["all", ...new Set(gallery.map(img => img.category))] : ["all"];
  
  const filteredGallery = filter === "all" 
    ? gallery 
    : gallery?.filter(img => img.category === filter);

  return (
    <div className="w-full min-h-screen bg-background pb-24">
      <section className="bg-primary/5 py-16 md:py-24 border-b border-border">
        <div className="container max-w-screen-xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">Galeria</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sinta a energia dos Lençóis Maranhenses através dos nossos registros.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container max-w-screen-xl mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? "default" : "outline"}
              className={filter === cat ? "bg-secondary text-white hover:bg-secondary/90" : ""}
              onClick={() => setFilter(cat)}
            >
              {cat === "all" ? "Todas" : cat}
            </Button>
          ))}
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className={`w-full rounded-2xl ${i % 2 === 0 ? 'h-64' : 'h-96'} mb-6`} />
            ))
          ) : filteredGallery?.map((img, index) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: (index % 10) * 0.1 }}
              className="break-inside-avoid"
            >
              <div className="relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <img
                  src={img.url}
                  alt={img.alt || img.title || "Vila do Junco Galeria"}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  {img.title && <h3 className="text-white font-bold text-lg">{img.title}</h3>}
                </div>
              </div>
            </motion.div>
          ))}
          
          {!isLoading && filteredGallery?.length === 0 && (
             <div className="col-span-full py-12 text-center text-muted-foreground w-full flex justify-center">
                Nenhuma foto encontrada para esta categoria.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
