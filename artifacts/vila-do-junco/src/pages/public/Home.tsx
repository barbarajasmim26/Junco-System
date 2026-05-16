import { Link } from "wouter";
  import { motion } from "framer-motion";
  import { Button } from "@/components/ui/button";
  import { ArrowRight, Star, MapPin, Clock } from "lucide-react";
  import { useListTours } from "@workspace/api-client-react";
  import { Skeleton } from "@/components/ui/skeleton";

  const HERO_IMAGE = "https://res.cloudinary.com/dijdpkxi8/image/upload/v1778873451/viladojunco/passeios/agqzvotkdq8qiyu29uib.png";
  const ABOUT_LEFT = "https://res.cloudinary.com/dijdpkxi8/image/upload/v1778760883/viladojunco/passeios/braardrvp2eqhgwlgftu.png";
  const ABOUT_RIGHT = "https://res.cloudinary.com/dijdpkxi8/image/upload/v1778762961/viladojunco/passeios/tec2wkeilsqeeuzkp7nf.png";
  const TRANSFER_IMG = "https://res.cloudinary.com/dijdpkxi8/image/upload/v1778762975/viladojunco/passeios/vy7anmzojwb8f43eq2ru.jpg";

  export default function Home() {
    const { data: tours, isLoading } = useListTours();
    const featuredTours = tours?.filter(t => t.active).slice(0, 3) || [];

    return (
      <div className="w-full">
        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={HERO_IMAGE}
              alt="Lençóis Maranhenses — Lagoas de Betânia"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative z-10 container max-w-screen-xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
                A magia dos Lençóis Maranhenses espera por você
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-10 font-medium">
                Passeios únicos em Santo Amaro — lagoas cristalinas, dunas brancas e experiências inesquecíveis.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg h-14 px-8 w-full sm:w-auto">
                  <Link href="/passeios">Explorar Passeios</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="bg-white/10 text-white border-white/30 hover:bg-white/20 text-lg h-14 px-8 w-full sm:w-auto">
                  <Link href="/agendar">Agendar Agora</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-24 bg-background">
          <div className="container max-w-screen-xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                  Descubra a Vila do Junco
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Estamos em Santo Amaro do Maranhão, às margens do Lago de Santo Amaro, dentro dos Lençóis Maranhenses. Nossa pousada e operadora oferecem acesso privilegiado a lagoas, dunas e roteiros que a maioria dos turistas nunca vê.
                </p>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Nossos guias são locais, apaixonados pela região, e garantem segurança, conforto e experiências autênticas em cada saída.
                </p>
                <Button asChild variant="link" className="text-secondary hover:text-secondary/80 p-0 text-lg font-medium">
                  <Link href="/contato" className="flex items-center gap-2">
                    Fale com nossa equipe <ArrowRight size={20} />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-2 gap-4"
              >
                <img src={ABOUT_LEFT} alt="Lagoa da América — Santos Amaro" className="w-full h-64 object-cover rounded-2xl" />
                <img src={ABOUT_RIGHT} alt="Revoada dos Guarás — Rio Periá" className="w-full h-64 object-cover rounded-2xl mt-8" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Tours */}
        <section className="py-24 bg-accent/30">
          <div className="container max-w-screen-xl mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Passeios em Destaque</h2>
                <p className="text-lg text-muted-foreground">As experiências mais procuradas pelos nossos viajantes.</p>
              </div>
              <Button asChild variant="outline" className="hidden md:flex">
                <Link href="/passeios">Ver todos</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex flex-col space-y-4">
                    <Skeleton className="h-64 w-full rounded-2xl" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ))
              ) : (
                featuredTours.map((tour, index) => (
                  <motion.div
                    key={tour.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={tour.imageUrl || HERO_IMAGE}
                        alt={tour.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-foreground">
                        {tour.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold font-serif mb-2 text-foreground">{tour.name}</h3>
                      <p className="text-muted-foreground line-clamp-2 mb-6">{tour.shortDescription || tour.description}</p>
                      <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1"><Clock size={16} /> {tour.duration}</div>
                        <div className="flex items-center gap-1"><MapPin size={16} /> Santo Amaro</div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <p className="text-sm text-muted-foreground">A partir de</p>
                          <p className="text-2xl font-bold text-primary">R$ {Number(tour.price).toFixed(2)}</p>
                        </div>
                        <Button asChild className="bg-secondary hover:bg-secondary/90 text-white">
                          <Link href={`/passeio/${tour.id}`}>Ver Detalhes</Link>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Button asChild variant="outline" className="w-full">
                <Link href="/passeios">Ver todos os passeios</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Transfers Preview */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container max-w-screen-xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Chegue com Conforto e Segurança</h2>
                <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed">
                  Transfers de São Luís, do aeroporto e de Barreirinhas até Santo Amaro. Veículos modernos, motoristas experientes e pontualidade garantida.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-primary-foreground/90">
                    <div className="bg-white/20 p-2 rounded-full"><Star size={16} /></div>
                    Van executiva e 4x4 para Atins
                  </li>
                  <li className="flex items-center gap-3 text-primary-foreground/90">
                    <div className="bg-white/20 p-2 rounded-full"><Star size={16} /></div>
                    Embarque no aeroporto com placa
                  </li>
                  <li className="flex items-center gap-3 text-primary-foreground/90">
                    <div className="bg-white/20 p-2 rounded-full"><Star size={16} /></div>
                    Disponibilidade diária
                  </li>
                </ul>
                <Button asChild variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Link href="/transfers">Reservar Transfer</Link>
                </Button>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-white/10 rounded-3xl transform rotate-3"></div>
                <img src={TRANSFER_IMG} alt="Transfer Vila do Junco — Rio Alegre" className="relative z-10 w-full h-auto rounded-2xl shadow-2xl object-cover" />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
  