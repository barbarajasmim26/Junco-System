import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, MapPin, Users, CalendarDays, ArrowLeft } from "lucide-react";
import { useGetTour } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function TourDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  
  const { data: tour, isLoading } = useGetTour(id, {
    query: {
      enabled: !!id,
      queryKey: ["/api/tours", id]
    }
  });

  if (isLoading) {
    return (
      <div className="container max-w-screen-xl mx-auto px-4 py-16">
        <Skeleton className="h-[400px] w-full rounded-2xl mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-32 w-full mt-8" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Passeio não encontrado</h1>
        <Button asChild>
          <Link href="/passeios">Voltar para Passeios</Link>
        </Button>
      </div>
    );
  }

  const includesList = tour.includes ? tour.includes.split('\n').filter(Boolean) : [];
  const notIncludesList = tour.notIncludes ? tour.notIncludes.split('\n').filter(Boolean) : [];

  return (
    <div className="w-full pb-24 bg-background">
      <div className="container max-w-screen-xl mx-auto px-4 pt-8 mb-4">
        <Link href="/passeios" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Voltar para passeios
        </Link>
      </div>

      <div className="container max-w-screen-xl mx-auto px-4 mb-12">
        <div className="relative h-[40vh] min-h-[400px] md:h-[50vh] rounded-3xl overflow-hidden">
          <img 
            src={tour.imageUrl || "/tour-lagoons.png"} 
            alt={tour.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 w-full">
            <Badge className="bg-secondary text-white hover:bg-secondary/90 mb-4">{tour.category}</Badge>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2">{tour.name}</h1>
          </div>
        </div>
      </div>

      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-6 py-6 border-b border-border mb-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="text-primary" size={20} />
                <span className="font-medium">Duração: {tour.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="text-primary" size={20} />
                <span className="font-medium">Máx {tour.maxGuests} pessoas</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="text-primary" size={20} />
                <span className="font-medium">{tour.meetingPoint || "Saída de Barreirinhas"}</span>
              </div>
            </div>

            <div className="prose prose-lg prose-headings:font-serif prose-headings:text-primary max-w-none mb-12 text-muted-foreground">
              <h2>Sobre a Experiência</h2>
              <p className="whitespace-pre-wrap">{tour.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {includesList.length > 0 && (
                <div className="bg-primary/5 p-6 rounded-2xl">
                  <h3 className="font-serif font-bold text-lg mb-4 text-primary">O que está incluso</h3>
                  <ul className="space-y-3">
                    {includesList.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <Check className="text-green-600 mt-1 shrink-0" size={18} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {notIncludesList.length > 0 && (
                <div className="bg-destructive/5 p-6 rounded-2xl">
                  <h3 className="font-serif font-bold text-lg mb-4 text-destructive">Não inclui</h3>
                  <ul className="space-y-3">
                    {notIncludesList.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <X className="text-destructive mt-1 shrink-0" size={18} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-card border border-border rounded-2xl p-6 shadow-lg">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">A partir de</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-primary">R$ {tour.price.toFixed(2)}</span>
                  <span className="text-muted-foreground mb-1">/pessoa</span>
                </div>
                {tour.priceNote && <p className="text-sm text-muted-foreground mt-2">{tour.priceNote}</p>}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg text-sm text-foreground">
                  <CalendarDays size={18} className="text-primary" />
                  <span>Saídas diárias garantidas</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg text-sm text-foreground">
                  <Check size={18} className="text-primary" />
                  <span>Cancelamento gratuito até 48h</span>
                </div>
              </div>

              <Button asChild size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold text-lg h-14">
                <Link href={`/agendar?tour=${tour.id}`}>Agendar Passeio</Link>
              </Button>
              
              <p className="text-center text-sm text-muted-foreground mt-4">
                Não cobraremos nada agora.
              </p>

              <div className="mt-8 pt-6 border-t border-border">
                <p className="font-medium text-foreground mb-2">Precisa de ajuda?</p>
                <Button variant="outline" asChild className="w-full border-primary text-primary hover:bg-primary/5">
                  <a href={`https://wa.me/5598900000000?text=Olá, gostaria de tirar dúvidas sobre o passeio ${tour.name}`} target="_blank" rel="noreferrer">
                    Falar no WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
