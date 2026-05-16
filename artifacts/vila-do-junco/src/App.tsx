import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";

import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";

const Home = lazy(() => import("@/pages/public/Home"));
const Tours = lazy(() => import("@/pages/public/Tours"));
const TourDetail = lazy(() => import("@/pages/public/TourDetail"));
const Transfers = lazy(() => import("@/pages/public/Transfers"));
const Gallery = lazy(() => import("@/pages/public/Gallery"));
const Contact = lazy(() => import("@/pages/public/Contact"));
const BookingFlow = lazy(() => import("@/pages/public/BookingFlow"));
const CustomerArea = lazy(() => import("@/pages/public/CustomerArea"));
const Sobre = lazy(() => import("@/pages/public/Sobre"));

const AdminLogin = lazy(() => import("@/pages/admin/Login"));
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const Reservas = lazy(() => import("@/pages/admin/Reservas"));
const Passeios = lazy(() => import("@/pages/admin/Passeios"));
const TransfersAdmin = lazy(() => import("@/pages/admin/Transfers"));
const ClientesAdmin = lazy(() => import("@/pages/admin/Clientes"));
const LeadsAdmin = lazy(() => import("@/pages/admin/Leads"));
const ConversasAdmin = lazy(() => import("@/pages/admin/Conversas"));
const KnowledgeBase = lazy(() => import("@/pages/admin/KnowledgeBase"));
const GalleryAdmin = lazy(() => import("@/pages/admin/GalleryAdmin"));
const FaqsAdmin = lazy(() => import("@/pages/admin/FaqsAdmin"));
const Configuracoes = lazy(() => import("@/pages/admin/Configuracoes"));
const Relatorios = lazy(() => import("@/pages/admin/Relatorios"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/acesso">
              <AdminLogin />
            </Route>

            <Route path="/admin">
              <AdminLayout><Dashboard /></AdminLayout>
            </Route>
            <Route path="/admin/reservas">
              <AdminLayout><Reservas /></AdminLayout>
            </Route>
            <Route path="/admin/passeios">
              <AdminLayout><Passeios /></AdminLayout>
            </Route>
            <Route path="/admin/transfers">
              <AdminLayout><TransfersAdmin /></AdminLayout>
            </Route>
            <Route path="/admin/clientes">
              <AdminLayout><ClientesAdmin /></AdminLayout>
            </Route>
            <Route path="/admin/leads">
              <AdminLayout><LeadsAdmin /></AdminLayout>
            </Route>
            <Route path="/admin/conversas">
              <AdminLayout><ConversasAdmin /></AdminLayout>
            </Route>
            <Route path="/admin/knowledge">
              <AdminLayout><KnowledgeBase /></AdminLayout>
            </Route>
            <Route path="/admin/galeria">
              <AdminLayout><GalleryAdmin /></AdminLayout>
            </Route>
            <Route path="/admin/faqs">
              <AdminLayout><FaqsAdmin /></AdminLayout>
            </Route>
            <Route path="/admin/configuracoes">
              <AdminLayout><Configuracoes /></AdminLayout>
            </Route>
            <Route path="/admin/relatorios">
              <AdminLayout><Relatorios /></AdminLayout>
            </Route>

            <Route path="/passeios/:id">
              {(params) => (
                <PublicLayout><TourDetail /></PublicLayout>
              )}
            </Route>
            <Route path="/passeios">
              <PublicLayout><Tours /></PublicLayout>
            </Route>
            <Route path="/transfers">
              <PublicLayout><Transfers /></PublicLayout>
            </Route>
            <Route path="/galeria">
              <PublicLayout><Gallery /></PublicLayout>
            </Route>
            <Route path="/sobre">
              <PublicLayout><Sobre /></PublicLayout>
            </Route>
            <Route path="/contato">
              <PublicLayout><Contact /></PublicLayout>
            </Route>
            <Route path="/reservar">
              <PublicLayout><BookingFlow /></PublicLayout>
            </Route>
            <Route path="/area-cliente">
              <PublicLayout><CustomerArea /></PublicLayout>
            </Route>
            <Route path="/">
              <PublicLayout><Home /></PublicLayout>
            </Route>
          </Switch>
        </Suspense>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
