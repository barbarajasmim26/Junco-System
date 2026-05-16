import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { useCreateLead } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Instagram, Send } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

export default function Contact() {
  const { toast } = useToast();
  const createLead = useCreateLead();

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof contactSchema>) {
    createLead.mutate({
      data: {
        name: values.name,
        email: values.email,
        phone: values.phone,
        whatsapp: values.phone,
        message: values.message,
        source: "Site Contato",
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Mensagem enviada com sucesso!",
          description: "Em breve nossa equipe entrará em contato.",
        });
        form.reset();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Erro ao enviar mensagem",
          description: "Tente novamente mais tarde ou contate-nos via WhatsApp.",
        });
      }
    });
  }

  return (
    <div className="w-full min-h-screen bg-background pb-24">
      <section className="bg-primary/5 py-16 md:py-24 border-b border-border">
        <div className="container max-w-screen-xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">Fale Conosco</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Estamos aqui para ajudar a planejar a viagem dos seus sonhos para os Lençóis Maranhenses.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container max-w-screen-xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-serif font-bold text-foreground mb-8">Envie uma mensagem</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input placeholder="seu@email.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone / WhatsApp</FormLabel>
                        <FormControl>
                          <Input placeholder="(98) 90000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Como podemos ajudar?</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detalhes sobre a viagem que você deseja fazer..." 
                          className="min-h-[150px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-white" disabled={createLead.isPending}>
                  {createLead.isPending ? "Enviando..." : (
                    <>
                      <Send className="mr-2" size={18} />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6, delay: 0.4 }}
             className="space-y-12"
          >
            <div>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-8">Informações de Contato</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">Endereço</h3>
                    <p className="text-muted-foreground">Barreirinhas, Maranhão<br/>CEP 65590-000, Brasil</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">Telefone / WhatsApp</h3>
                    <p className="text-muted-foreground">+55 (98) 90000-0000</p>
                    <a href="https://wa.me/5598900000000" target="_blank" rel="noreferrer" className="text-secondary font-medium text-sm mt-1 inline-block hover:underline">
                      Chamar no WhatsApp
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">E-mail</h3>
                    <p className="text-muted-foreground">contato@viladojunco.com.br</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent/30 p-8 rounded-2xl">
              <h3 className="font-serif font-bold text-xl mb-4">Siga-nos nas Redes Sociais</h3>
              <p className="text-muted-foreground mb-6">Acompanhe nosso dia a dia e fotos incríveis dos nossos passeios.</p>
              <div className="flex gap-4">
                <a href="#" className="bg-white p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors shadow-sm">
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
