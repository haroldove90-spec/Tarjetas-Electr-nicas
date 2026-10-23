import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  Inbox, 
  ClipboardList, 
  Wrench, 
  ShoppingCart, 
  Users, 
  MoreHorizontal, 
  KanbanSquare, 
  DollarSign, 
  Package, 
  ShieldCheck, 
  Building2,
  CalendarCheck
} from 'lucide-react';

interface NavigationProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  isSidebarOpen, 
  setIsSidebarOpen 
}) => {
  const { 
    role, 
    activeTab, 
    setActiveTab, 
    metrics, 
    setShowRoleSelector 
  } = useApp();

  // Bottom Navigation tabs for Mobile & Tablet (matching screenshot exactly)
  const bottomNavItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'recepcion', label: 'Recepción', icon: Inbox, badge: metrics.recibidos > 0 ? `${metrics.recibidos}+` : undefined },
    { id: 'ordenes', label: 'Órdenes', icon: ClipboardList },
    { id: 'servicios', label: 'Servicios', icon: Wrench },
    { id: 'venta', label: 'Venta', icon: ShoppingCart },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'mas', label: 'Más', icon: MoreHorizontal },
  ];

  interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
    badge: string | null;
    adminOnly?: boolean;
  }

  interface NavSection {
    section: string;
    items: NavItem[];
  }

  // Full Sidebar Items for Desktop
  const desktopNavItems: NavSection[] = [
    { 
      section: 'OPERACIÓN DEL TALLER', 
      items: [
        { id: 'inicio', label: 'Panel del taller', icon: Home, badge: null },
        { id: 'recepcion', label: 'Recepción / Mostrador', icon: Inbox, badge: `${metrics.recibidos} nuevos` },
        { id: 'ordenes', label: 'Órdenes de Servicio', icon: ClipboardList, badge: `${metrics.activosEnTaller}` },
        { id: 'kanban', label: 'Tablero Kanban', icon: KanbanSquare, badge: null },
        { id: 'servicios', label: 'Taller & Diagnóstico', icon: Wrench, badge: null },
      ]
    },
    { 
      section: 'VENTAS Y CLIENTES', 
      items: [
        { id: 'venta', label: 'Notas de Remisión', icon: ShoppingCart, badge: null },
        { id: 'clientes', label: 'Directorio de Clientes', icon: Users, badge: null },
        { id: 'inventario', label: 'Inventario de Refacciones', icon: Package, badge: metrics.faltaDePiezas > 0 ? `${metrics.faltaDePiezas} faltantes` : null },
      ]
    },
    { 
      section: 'ADMINISTRACIÓN & MÉTRICAS', 
      items: [
        { id: 'finanzas', label: 'Cortes de Caja y Finanzas', icon: DollarSign, badge: null, adminOnly: true },
        { id: 'comisiones', label: 'Nómina y Comisiones', icon: CalendarCheck, badge: null },
        { id: 'sucursales', label: 'Supervisión de Sucursales', icon: Building2, badge: null, adminOnly: true },
      ]
    }
  ];

  return (
    <>
      {/* 1. DESKTOP SIDEBAR (Visible on lg: screens) */}
      <aside 
        className={`hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 shrink-0 text-slate-300 min-h-[calc(100vh-4rem)] transition-all select-none`}
      >
        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          {desktopNavItems.map((group, idx) => {
            // Filter section items based on user role
            const visibleItems = group.items.filter(item => !item.adminOnly || role === 'admin');
            if (visibleItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
                  {group.section}
                </p>
                <div className="space-y-0.5">
                  {visibleItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-teal-500/20 to-sky-500/10 text-cyan-300 font-semibold border-l-2 border-cyan-400'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-cyan-900/50">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom user role strip in sidebar */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white capitalize">{role}</span>
                <span className="text-[10px] text-slate-400">Taller Activo</span>
              </div>
            </div>
            <button
              onClick={() => setShowRoleSelector(true)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium px-2 py-1 rounded-lg hover:bg-slate-800"
            >
              Cambiar
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MOBILE DRAWER OVERLAY (When user taps hamburger on mobile/tablet) */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-slate-900 border-r border-slate-800 flex flex-col h-full z-10 p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <img src="/icon.svg" alt="Logo" className="w-8 h-8 rounded-lg bg-white p-1" />
                <span className="text-sm font-bold text-white">Tarjetas Electrónicas</span>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="text-slate-400 hover:text-white p-1.5"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {desktopNavItems.map((group, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                    {group.section}
                  </p>
                  {group.items.filter(i => !i.adminOnly || role === 'admin').map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium ${
                          isActive
                            ? 'bg-cyan-950 text-cyan-300 font-bold border-l-2 border-cyan-400'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-cyan-300">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowRoleSelector(true);
                  setIsSidebarOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 text-cyan-400 text-xs font-semibold flex items-center justify-center gap-2"
              >
                Cambiar Rol de Usuario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MOBILE & TABLET BOTTOM BAR (Fixed at bottom as requested) */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg safe-bottom"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="grid grid-cols-7 items-center h-16 max-w-lg mx-auto px-1">
          {bottomNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 relative min-h-[44px] transition-colors ${
                  isActive 
                    ? 'text-teal-600 dark:text-cyan-400 font-semibold' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {/* Active indicator bar at top of icon (matching screenshot) */}
                {isActive && (
                  <span className="absolute top-0 w-8 h-1 bg-teal-500 rounded-b-full shadow-sm shadow-teal-500/50" />
                )}

                <div className="relative mt-0.5">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>

                <span className="text-[10px] tracking-tight mt-1 leading-none">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
