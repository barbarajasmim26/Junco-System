import { useGetDashboardStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, DollarSign, Users, MessageSquare, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <Skeleton className="h-96 w-full rounded-xl" />
           <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!stats) return <div>Erro ao carregar dados do dashboard.</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visão geral do seu negócio de turismo.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Faturamento Mês</CardTitle>
            <div className="p-2 bg-green-100 text-green-700 rounded-md">
              <DollarSign size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.monthRevenue?.toFixed(2) || "0.00"}</div>
            <p className="text-xs text-muted-foreground mt-1">Total: R$ {stats.totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reservas Ativas</CardTitle>
            <div className="p-2 bg-blue-100 text-blue-700 rounded-md">
              <CalendarDays size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmedBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.pendingBookings} pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Novos Clientes Mês</CardTitle>
            <div className="p-2 bg-purple-100 text-purple-700 rounded-md">
              <Users size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newCustomersMonth || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Base: {stats.totalCustomers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Leads Abertos</CardTitle>
            <div className="p-2 bg-orange-100 text-orange-700 rounded-md">
              <MessageSquare size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openLeads || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.openConversations || 0} conversas ativas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Bookings */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Reservas Recentes</CardTitle>
            <a href="/admin/reservas" className="text-sm font-medium text-primary flex items-center hover:underline">
              Ver todas <ArrowUpRight size={14} className="ml-1" />
            </a>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentBookings?.slice(0, 5).map(booking => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{booking.customerName}</p>
                    <div className="flex gap-2 text-xs text-gray-500 mt-1">
                      <span>{booking.itemName}</span>
                      <span>•</span>
                      <span>{format(new Date(booking.date), "dd/MM/yyyy")}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-gray-900">R$ {booking.totalPrice.toFixed(2)}</p>
                    <Badge variant="outline" className="text-[10px] mt-1 uppercase font-bold">
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {(!stats.recentBookings || stats.recentBookings.length === 0) && (
                <p className="text-center text-sm text-gray-500 py-4">Nenhuma reserva recente.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Tours */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Passeios Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topTours?.map((stat, i) => (
                <div key={stat.tourId} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">{stat.tourName}</span>
                      <span className="font-bold text-sm">R$ {stat.revenue.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${Math.max(10, (stat.bookingCount / (stats.topTours?.[0]?.bookingCount || 1)) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{stat.bookingCount} reservas</p>
                  </div>
                </div>
              ))}
              {(!stats.topTours || stats.topTours.length === 0) && (
                <p className="text-center text-sm text-gray-500 py-4">Sem dados suficientes.</p>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
