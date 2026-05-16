import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useListCustomers, getListCustomersQueryKey, useListBookings, getListBookingsQueryKey } from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, CalendarDays, Users, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CustomerArea() {
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: customers, isLoading: loadingCustomers } = useListCustomers(
    { search: email },
    { query: { enabled: !!email && email.length > 3, queryKey: getListCustomersQueryKey({ search: email }) } }
  );

  const { data: bookings, isLoading: loadingBookings } = useListBookings(
    { customerId: customerId || undefined },
    { query: { enabled: !!customerId, queryKey: getListBookingsQueryKey({ customerId: customerId || undefined }) } }
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate finding user by email
    const customer = customers?.find(c => c.email.toLowerCase() === email.toLowerCase());
    
    if (customer) {
      setCustomerId(customer.id);
      setIsLoggedIn(true);
      toast({ title: "Bem-vindo de volta!", description: "Acessando sua área." });
    } else {
      toast({ 
        variant: "destructive", 
        title: "Email não encontrado", 
        description: "Nenhuma reserva vinculada a este email." 
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      case "completed": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed": return "Confirmada";
      case "pending": return "Pendente";
      case "cancelled": return "Cancelada";
      case "completed": return "Concluída";
      default: return status;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="w-full min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="border-border shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-serif text-primary">Área do Cliente</CardTitle>
              <p className="text-muted-foreground text-sm mt-2">Acesse suas reservas informando o email usado no agendamento.</p>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Input 
                    type="email" 
                    placeholder="Seu email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>
                <Button type="submit" className="w-full h-12" disabled={loadingCustomers}>
                  Acessar Minhas Reservas <ArrowRight className="ml-2" size={16} />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const customerName = customers?.find(c => c.id === customerId)?.name || "Cliente";

  return (
    <div className="w-full min-h-screen bg-background pb-24">
      <div className="bg-primary/5 py-12 border-b border-border">
        <div className="container max-w-screen-xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Olá, {customerName}</h1>
            <p className="text-muted-foreground mt-1">Acompanhe seus passeios e transfers</p>
          </div>
          <Button variant="outline" onClick={() => setIsLoggedIn(false)}>Sair</Button>
        </div>
      </div>

      <div className="container max-w-screen-xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold font-serif mb-8">Minhas Reservas</h2>

        {loadingBookings ? (
          <div className="text-center py-12">Carregando reservas...</div>
        ) : !bookings || bookings.length === 0 ? (
          <div className="text-center py-24 bg-accent/30 rounded-2xl">
             <p className="text-lg text-muted-foreground mb-4">Você ainda não tem reservas.</p>
             <Button asChild>
                <a href="/passeios">Explorar Passeios</a>
             </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Badge variant="outline" className="mb-2 uppercase text-[10px] tracking-wider font-bold">
                        {booking.type === 'tour' ? 'Passeio' : 'Transfer'}
                      </Badge>
                      <h3 className="font-bold text-lg text-foreground">{booking.itemName}</h3>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {getStatusText(booking.status)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-muted-foreground gap-3">
                      <CalendarDays size={16} className="text-primary shrink-0" />
                      <span>{format(new Date(booking.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground gap-3">
                      <Users size={16} className="text-primary shrink-0" />
                      <span>{booking.guests} pessoa(s)</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="text-sm font-medium">Valor Total</span>
                    <span className="font-bold text-lg text-primary">R$ {booking.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
