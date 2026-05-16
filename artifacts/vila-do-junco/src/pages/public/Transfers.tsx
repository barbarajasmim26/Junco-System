import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useListTransfers } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Clock, Users, ArrowRight } from "lucide-react";

export default function Transfers() {
  const { data: transfers, isLoading } = useListTransfers();
  const activeTransfers = transfers?.filter(t => t.active) || [];

  return (
    <div className="w-full bg-background min-h-screen">
      <section className="bg-primary py-16 md:py-24 text-primary-foreground overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="container max-w-screen-xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Transfers e Deslocamentos</h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Chegue com segurança e conforto. Veículos novos, motoristas experientes e rotas otimizadas para as principais portas de entrada dos Lençóis Maranhenses.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="border border-border rounded-2xl p-6 flex flex-col sm:flex-row gap-6">
                  <Skeleton className="h-32 w-full sm:w-1/3 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-4 py-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-1/2 mt-4" />
                  </div>
                </div>
              ))
            ) : activeTransfers.length === 0 ? (
               <div className="col-span-full py-12 text-center text-muted-foreground">
                  Nenhum transfer disponível no momento.
               </div>
            ) : (
              activeTransfers.map((transfer, index) => (
                <motion.div 
                  key={transfer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 md:gap-8 hover:shadow-lg transition-all"
                >
                  <div className="w-full sm:w-1/3 shrink-0">
                    <img 
                      src={transfer.imageUrl || "/transfer-van.png"} 
                      alt={transfer.name}
                      className="w-full h-48 sm:h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-sm font-medium text-primary mb-3">
                        <span>{transfer.origin}</span>
                        <ArrowRight size={16} />
                        <span>{transfer.destination}</span>
                      </div>
                      <h3 className="text-xl font-bold font-serif mb-2 text-foreground">{transfer.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{transfer.description}</p>
                      
                      <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center gap-2"><Clock size={16}/> {transfer.duration}</div>
                        {transfer.vehicle && <div className="flex items-center gap-2"><Users size={16}/> {transfer.vehicle}</div>}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                      <div>
                        <span className="text-2xl font-bold text-foreground">R$ {transfer.price.toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground block">{transfer.pricePerPerson ? "por pessoa" : "por veículo"}</span>
                      </div>
                      <Button asChild className="bg-secondary hover:bg-secondary/90 text-white">
                        <Link href={`/agendar?transfer=${transfer.id}`}>Reservar</Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          
          <div className="mt-16 bg-accent/30 rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-serif font-bold text-foreground mb-4">Precisa de um roteiro personalizado?</h3>
            <p className="text-muted-foreground mb-8">
              Atendemos grupos fechados, rotas exclusivas e viagens corporativas. Entre em contato para um orçamento sob medida.
            </p>
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5">
              <Link href="/contato">Solicitar Orçamento</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
