import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { useListTours, useListTransfers, useCreateBooking, useCreateCustomer } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, ChevronRight, Calendar as CalendarIcon, MapPin, Users, Clock } from "lucide-react";

const customerSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone obrigatório"),
  guests: z.coerce.number().min(1, "Mínimo de 1 pessoa"),
});

export default function BookingFlow() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialTourId = searchParams.get("tour");
  const initialTransferId = searchParams.get("transfer");

  const { toast } = useToast();
  
  const { data: tours, isLoading: loadingTours } = useListTours();
  const { data: transfers, isLoading: loadingTransfers } = useListTransfers();
  const createBooking = useCreateBooking();
  const createCustomer = useCreateCustomer();

  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<"tour" | "transfer">(initialTransferId ? "transfer" : "tour");
  const [selectedItemId, setSelectedItemId] = useState<number | null>(
    initialTourId ? parseInt(initialTourId) : initialTransferId ? parseInt(initialTransferId) : null
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      guests: 1,
    },
  });

  const activeTours = tours?.filter(t => t.active) || [];
  const activeTransfers = transfers?.filter(t => t.active) || [];

  const selectedItem = selectedType === "tour" 
    ? activeTours.find(t => t.id === selectedItemId)
    : activeTransfers.find(t => t.id === selectedItemId);

  const handleNextStep = () => {
    if (step === 1 && !selectedItemId) {
      toast({ variant: "destructive", title: "Selecione um serviço" });
      return;
    }
    if (step === 2 && !selectedDate) {
      toast({ variant: "destructive", title: "Selecione uma data" });
      return;
    }
    setStep(s => s + 1);
  };

  const onSubmit = async (values: z.infer<typeof customerSchema>) => {
    if (!selectedItem || !selectedDate) return;

    try {
      // 1. Create or find customer (simplified here to always create, backend should handle upsert if needed)
      const customer = await createCustomer.mutateAsync({
        data: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          whatsapp: values.phone,
        }
      });

      // 2. Create Booking
      const totalPrice = selectedType === "tour" 
        ? selectedItem.price * values.guests
        : (selectedItem as any).pricePerPerson ? selectedItem.price * values.guests : selectedItem.price;

      await createBooking.mutateAsync({
        data: {
          type: selectedType,
          itemId: selectedItem.id,
          customerId: customer.id,
          date: format(selectedDate, "yyyy-MM-dd"),
          guests: values.guests,
          totalPrice,
          paymentMethod: "A combinar",
        }
      });

      setStep(4);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao processar reserva",
        description: "Por favor, tente novamente."
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-background pb-24 pt-12">
      <div className="container max-w-screen-md mx-auto px-4">
        
        {/* Progress Bar */}
        <div className="mb-12">
          <h1 className="text-3xl font-serif font-bold text-primary text-center mb-8">Agendar sua Experiência</h1>
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-border -z-10 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
            
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                  step >= i ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border-2 border-border"
                }`}
              >
                {step > i ? <CheckCircle2 size={20} /> : i}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs font-medium text-muted-foreground mt-3 px-2">
            <span>Serviço</span>
            <span>Data</span>
            <span>Dados</span>
            <span>Confirmação</span>
          </div>
        </div>

        <Card className="border-border shadow-md">
          <CardContent className="p-6 md:p-10">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Select Item */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex gap-4 p-1 bg-accent/30 rounded-lg">
                    <button 
                      className={`flex-1 py-3 text-sm font-bold rounded-md transition-colors ${selectedType === "tour" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                      onClick={() => { setSelectedType("tour"); setSelectedItemId(null); }}
                    >
                      Passeios
                    </button>
                    <button 
                      className={`flex-1 py-3 text-sm font-bold rounded-md transition-colors ${selectedType === "transfer" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                      onClick={() => { setSelectedType("transfer"); setSelectedItemId(null); }}
                    >
                      Transfers
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                    {selectedType === "tour" ? (
                      loadingTours ? <div className="p-4 text-center">Carregando...</div> :
                      activeTours.map(tour => (
                        <div 
                          key={tour.id}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedItemId === tour.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                          onClick={() => setSelectedItemId(tour.id)}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h3 className="font-bold text-foreground mb-1">{tour.name}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1"><Clock size={14}/> {tour.duration}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-bold text-primary">R$ {tour.price.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      loadingTransfers ? <div className="p-4 text-center">Carregando...</div> :
                      activeTransfers.map(transfer => (
                        <div 
                          key={transfer.id}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedItemId === transfer.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                          onClick={() => setSelectedItemId(transfer.id)}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h3 className="font-bold text-foreground mb-1">{transfer.name}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin size={14}/> {transfer.origin} → {transfer.destination}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-bold text-primary">R$ {transfer.price.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <Button onClick={handleNextStep} disabled={!selectedItemId} className="w-full h-12 text-lg">
                    Continuar <ChevronRight className="ml-2" size={20} />
                  </Button>
                </motion.div>
              )}

              {/* STEP 2: Select Date */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="p-4 bg-accent/30 rounded-xl mb-6 flex items-center gap-4">
                    <div className="bg-white p-3 rounded-lg"><CalendarIcon className="text-primary" /></div>
                    <div>
                      <p className="text-sm text-muted-foreground">Selecionado:</p>
                      <p className="font-bold">{selectedItem?.name}</p>
                    </div>
                  </div>

                  <div className="flex justify-center border border-border p-4 rounded-xl">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                      className="rounded-md"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep(1)} className="h-12 w-full">Voltar</Button>
                    <Button onClick={handleNextStep} disabled={!selectedDate} className="h-12 w-full">
                      Continuar <ChevronRight className="ml-2" size={20} />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Customer Info */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="bg-primary/5 p-4 rounded-xl mb-8 flex flex-col gap-2 border border-primary/20">
                    <div className="flex justify-between font-medium">
                      <span>Serviço:</span>
                      <span>{selectedItem?.name}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Data:</span>
                      <span>{selectedDate && format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
                    </div>
                  </div>

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
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="seu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>WhatsApp</FormLabel>
                              <FormControl>
                                <Input placeholder="(98) 90000-0000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="guests"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nº de Pessoas</FormLabel>
                              <FormControl>
                                <Input type="number" min={1} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-between items-center py-4 border-t border-b border-border mt-8">
                        <span className="font-bold text-lg">Total estimado:</span>
                        <span className="font-bold text-2xl text-primary">
                          R$ {selectedItem && form.watch("guests") ? (
                             selectedType === "tour" || (selectedItem as any).pricePerPerson 
                              ? (selectedItem.price * form.watch("guests")).toFixed(2)
                              : selectedItem.price.toFixed(2)
                          ) : "0.00"}
                        </span>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={() => setStep(2)} className="h-12 w-full">Voltar</Button>
                        <Button type="submit" className="h-12 w-full bg-secondary hover:bg-secondary/90 text-white" disabled={createBooking.isPending || createCustomer.isPending}>
                          {createBooking.isPending ? "Processando..." : "Confirmar Reserva"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </motion.div>
              )}

              {/* STEP 4: Success */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Reserva Confirmada!</h2>
                  <p className="text-muted-foreground mb-8">
                    Recebemos sua solicitação. Em breve nossa equipe entrará em contato via WhatsApp para confirmar os detalhes de pagamento.
                  </p>
                  <Button onClick={() => setLocation("/")} className="h-12 px-8">
                    Voltar para o Início
                  </Button>
                </motion.div>
              )}

            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
