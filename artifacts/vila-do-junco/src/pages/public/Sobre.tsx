import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Award, Leaf, Phone, ArrowRight } from "lucide-react";

const values = [
  {
    icon: Leaf,
    title: "Ecoturismo Responsável",
    desc: "Preservamos os Lençóis Maranhenses respeitando a natureza e as comunidades locais em cada passeio.",
  },
  {
    icon: Award,
    title: "Experiência Premium",
    desc: "Guias certificados, veículos confortáveis e roteiros exclusivos pensados para superar suas expectativas.",
  },
  {
    icon: Users,
    title: "Atendimento Personalizado",
    desc: "Cada viajante é único. Adaptamos itinerários, horários e grupos para a sua melhor experiência.",
  },
  {
    icon: MapPin,
    title: "Conhecimento Local",
    desc: "Somos de Barreirinhas. Conhecemos cada lagoa, duna e trilha — e compartilhamos esse amor com você.",
  },
];

const numbers = [
  { value: "7+", label: "Anos de experiência" },
  { value: "5.000+", label: "Turistas atendidos" },
  { value: "7", label: "Passeios exclusivos" },
  { value: "4.9★", label: "Avaliação média" },
];

export default function Sobre() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative h-72 md:h-96 flex items-center justify-center overflow-hidden">
        <img
          src="/hero-bg.png"
          alt="Lençóis Maranhenses"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-serif font-bold text-white mb-3"
          >
            Sobre a Vila do Junco
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-lg text-white/85 max-w-xl mx-auto"
          >
            Apaixonados pelo Maranhão, dedicados à sua melhor viagem.
          </motion.p>
        </div>
      </section>

      {/* Nossa história */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">
                Nossa História
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
                Nascemos do amor pelos Lençóis Maranhenses
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                A Vila do Junco surgiu do desejo de mostrar ao mundo a beleza única de Barreirinhas e dos Lençóis Maranhenses. Fundada por moradores locais que cresceram entre as dunas brancas e as lagoas cristalinas, nossa operadora nasceu com um propósito claro: proporcionar experiências autênticas, seguras e inesquecíveis.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Ao longo dos anos, construímos uma equipe de guias apaixonados e experientes, investimos em veículos modernos e desenvolvemos roteiros que respeitam a natureza e valorizam a cultura maranhense. Cada passeio é planejado com cuidado para que você leve para casa muito mais do que fotos — leve memórias que duram para sempre.
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6">
                <Link href="/passeios" className="flex items-center gap-2">
                  Conhecer nossos passeios <ArrowRight size={18} />
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
              <img src="/tour-lagoons.png" alt="Lagoas" className="w-full h-60 object-cover rounded-2xl" />
              <img src="/tour-sunset.png" alt="Dunas" className="w-full h-60 object-cover rounded-2xl mt-8" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Números */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {numbers.map((n, i) => (
              <motion.div
                key={n.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <p className="text-4xl md:text-5xl font-serif font-bold mb-2">{n.value}</p>
                <p className="text-primary-foreground/80 text-sm font-medium">{n.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">
              Nossos Valores
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              O que nos move
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <v.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Pronto para viver essa experiência?
          </h2>
          <p className="text-gray-500 mb-8 text-lg">
            Entre em contato com nossa equipe ou agende seu passeio agora mesmo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 py-3 text-base">
              <Link href="/agendar">Agendar Agora</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl px-8 py-3 text-base border-gray-300">
              <Link href="/contato" className="flex items-center gap-2">
                <Phone size={16} /> Falar com a equipe
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
