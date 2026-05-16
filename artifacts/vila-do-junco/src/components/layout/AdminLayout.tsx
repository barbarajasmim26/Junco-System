import { Link, useLocation, useRouter } from "wouter";
import { LayoutDashboard, CalendarDays, Map, Truck, Users, MessageSquare, BookOpen, Settings, LogOut, Image as ImageIcon, HelpCircle, BarChart3, Menu, X, TrendingUp } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/reservas", icon: CalendarDays, label: "Reservas" },
  { href: "/admin/passeios", icon: Map, label: "Passeios" },
  { href: "/admin/transfers", icon: Truck, label: "Transfers" },
  { href: "/admin/clientes", icon: Users, label: "Clientes" },
  { href: "/admin/leads", icon: TrendingUp, label: "Leads Funnel" },
  { href: "/admin/conversas", icon: MessageSquare, label: "Conversas" },
  { href: "/admin/base-conhecimento", icon: BookOpen, label: "Base Conhecimento" },
  { href: "/admin/galeria", icon: ImageIcon, label: "Galeria" },
  { href: "/admin/faqs", icon: HelpCircle, label: "FAQs" },
  { href: "/admin/relatorios", icon: BarChart3, label: "Relatórios" },
  { href: "/admin/configuracoes", icon: Settings, label: "Configurações" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const { isAuthenticated, logout } = useAdminAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/acesso");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/acesso");
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const NavContent = () => (
    <>
      <div className="h-16 flex items-center px-5 border-b border-sidebar-border shrink-0">
        <span className="font-serif text-xl font-bold text-sidebar-primary">Vila do Junco</span>
        <span className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
          Admin
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            location === item.href ||
            (item.href !== "/admin" && location.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon
                size={17}
                className={isActive ? "text-white" : "text-sidebar-foreground/60"}
              />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-sidebar-border shrink-0 space-y-1">
        <a
          href="/"
          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Ver site público
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={15} />
          Sair
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-60 bg-sidebar border-r border-sidebar-border hidden md:flex flex-col">
        <NavContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative w-60 bg-sidebar flex flex-col h-full z-10 shadow-xl">
            <NavContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 shrink-0">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <Menu size={20} />
          </button>
          <span className="font-serif text-base font-bold text-gray-900">Vila do Junco Admin</span>
          <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
            <LogOut size={18} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
