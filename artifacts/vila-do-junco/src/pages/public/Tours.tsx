import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, MapPin } from "lucide-react";
import { useListTours } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function Tours() {
  const { data: tours, isLoading } = useListTours();
  const [filter, setFilter] = useState<string>("all");

  const activeTours = tours?.filter(t => t.active) || [];
  
  const categories = ["all", ...new Set(activeTours.map(t => t.category))];

  const filteredTours = filter === "all" ? activeTours : activeTours.filter(t => t.category === filter);

  return (
    <div className="w-full">
      <section className="bg-primary/5 py-16 md:py-24 border-b border-border">
        <div className="container max-w-screen-xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">Passeios</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore as maravilhas dos Lençóis Maranhenses. De dunas imensas a rios serenos, temos a aventura perfeita para você.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container max-w-screen-xl mx-auto px-4">
          
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={filter === cat ? "default" : "outline"}
                className={filter === cat ? "bg-secondary text-white hover:bg-secondary/90" : ""}
                onClick={() => setFilter(cat)}
              >
                {cat === "all" ? "Todos os Passeios" : cat}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col space-y-4">
                  <Skeleton className="h-64 w-full rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))
            ) : (
              filteredTours.map((tour, index) => (
                <motion.div 
                  key={tour.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full"
                >
                  <div className="relative h-64 overflow-hidden shrink-0">
                    <img 
                      src={tour.imageUrl || "/tour-lagoons.png"} 
                      alt={tour.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-4 right-4 bg-white/90 text-foreground hover:bg-white/90">
                      {tour.category}
                    </Badge>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold font-serif mb-2 text-foreground">{tour.name}</h3>
                    <p className="text-muted-foreground line-clamp-3 mb-6 flex-1">{tour.shortDescription || tour.description}</p>
                    
                    <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground shrink-0">
                      <div className="flex items-center gap-1"><Clock size={16} /> {tour.duration}</div>
                      <div className="flex items-center gap-1"><MapPin size={16} /> {tour.meetingPoint || "Barreirinhas"}</div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border shrink-0">
                      <div>
                        <p className="text-sm text-muted-foreground">Valor por pessoa</p>
                        <p className="text-2xl font-bold text-primary">R$ {tour.price.toFixed(2)}</p>
                      </div>
                      <Button asChild className="bg-secondary hover:bg-secondary/90 text-white">
                        <Link href={`/passeio/${tour.id}`}>Agendar</Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            
            {!isLoading && filteredTours.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <p className="text-muted-foreground text-lg">Nenhum passeio encontrado para esta categoria.</p>
                <Button variant="link" onClick={() => setFilter("all")} className="mt-4">
                  Ver todos os passeios
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
