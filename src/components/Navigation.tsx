import React, { useState } from 'react';
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
  CalendarCheck,
  X,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { 
    role, 
    activeTab, 
    setActiveTab, 
    metrics, 
    setShowRoleSelector 
  } = useApp();

  const [showMoreModal, setShowMoreModal] = useState(false);

  // Bottom Navigation tabs for Mobile & Tablet (matching sample screenshot)
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
  }

  interface NavSection {
    section: string;
    items: NavItem[];
  }

  // ALL modules are now active and visible across all roles as requested
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
        { id: 'finanzas', label: 'Cortes de Caja y Finanzas', icon: DollarSign, badge: null },
        { id: 'comisiones', label: 'Nómina y Comisiones', icon: CalendarCheck, badge: null },
        { id: 'sucursales', label: 'Supervisión de Sucursales', icon: Building2, badge: null },
      ]
    }
  ];

  // Additional modules accessible from "Más" on mobile/tablet
  const moreModules = [
    { id: 'kanban', label: 'Tablero Kanban', desc: 'Flujo visual de etapas en taller', icon: KanbanSquare, color: 'text-sky-600 bg-sky-50' },
    { id: 'inventario', label: 'Inventario & Refacciones', desc: 'Existencias, costos y pedidos', icon: Package, color: 'text-amber-600 bg-amber-50' },
    { id: 'finanzas', label: 'Cortes de Caja y Finanzas', desc: 'Cortes día, semana y mes', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'comisiones', label: 'Nómina y Comisiones', desc: 'Cálculo semanal por técnico', icon: CalendarCheck, color: 'text-purple-600 bg-purple-50' },
    { id: 'sucursales', label: 'Supervisión de Sucursales', desc: 'Taller matriz y puntos móviles', icon: Building2, color: 'text-cyan-600 bg-cyan-50' },
  ];

  const handleBottomTabClick = (tabId: string) => {
    if (tabId === 'mas') {
      setShowMoreModal(true);
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <>
      {/* 1. DESKTOP SIDEBAR (Visible on lg: screens >= 1024px) */}
      <aside 
        className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 shrink-0 text-slate-300 min-h-[calc(100vh-4rem)] transition-all select-none"
      >
        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          {desktopNavItems.map((group, idx) => (
            <div key={idx} className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
                {group.section}
              </p>
              <div className="space-y-0.5">
                {group.items.map(item => {
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
          ))}
        </div>

        {/* Bottom user role strip in desktop sidebar */}
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

      {/* 2. MOBILE & TABLET BOTTOM BAR (Fixed at bottom - No redundant hamburger) */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg safe-bottom"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="grid grid-cols-7 items-center h-16 max-w-lg mx-auto px-1">
          {bottomNavItems.map(item => {
            const Icon = item.icon;
            const isTabActive = activeTab === item.id || (item.id === 'mas' && ['kanban', 'finanzas', 'comisiones', 'inventario', 'sucursales'].includes(activeTab));

            return (
              <button
                key={item.id}
                onClick={() => handleBottomTabClick(item.id)}
                className={`flex flex-col items-center justify-center py-1 relative min-h-[44px] transition-colors ${
                  isTabActive 
                    ? 'text-teal-600 dark:text-cyan-400 font-semibold' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {/* Active indicator bar at top of icon */}
                {isTabActive && (
                  <span className="absolute top-0 w-8 h-1 bg-teal-500 rounded-b-full shadow-sm shadow-teal-500/50" />
                )}

                <div className="relative mt-0.5">
                  <Icon className={`w-5 h-5 ${isTabActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>

                <span className="text-[9px] sm:text-[10px] tracking-tight mt-1 leading-none truncate max-w-[44px] sm:max-w-none text-center">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. "MÁS MÓDULOS" QUICK HUB SHEET (For Mobile and Tablet) */}
      {showMoreModal && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
          <div 
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
          >
            {/* Sheet grab handle on mobile */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto sm:hidden" />

            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Módulos del Taller</h3>
                <p className="text-xs text-slate-500">Acceso a todas las herramientas operativas y administrativas</p>
              </div>
              <button
                onClick={() => setShowMoreModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of modules */}
            <div className="space-y-2">
              {moreModules.map(mod => {
                const Icon = mod.icon;
                const isSelected = activeTab === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      setActiveTab(mod.id);
                      setShowMoreModal(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-50/50 shadow-xs'
                        : 'border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mod.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{mod.label}</h4>
                        <p className="text-[11px] text-slate-500">{mod.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                );
              })}
            </div>

            {/* Role switch action in More modal */}
            <div className="pt-2 border-t">
              <button
                onClick={() => {
                  setShowMoreModal(false);
                  setShowRoleSelector(true);
                }}
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-cyan-400 font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Cambiar Rol / Perfil de Usuario</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
