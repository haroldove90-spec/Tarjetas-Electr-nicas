import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Kanban, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  MessageCircle, 
  Lightbulb, 
  ArrowUpRight, 
  FileText,
  Filter,
  User,
  Wrench,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { OrderStatus } from '../types';

interface WorkshopDashboardProps {
  onOpenOrderModal: (orderId: string) => void;
  onNewReception: () => void;
  onOpenKanban: () => void;
}

export const WorkshopDashboard: React.FC<WorkshopDashboardProps> = ({
  onOpenOrderModal,
  onNewReception,
  onOpenKanban,
}) => {
  const { 
    role, 
    orders, 
    metrics, 
    technicians, 
    selectedTechnicianId,
    searchQuery,
    setActiveTab
  } = useApp();

  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [showQuickTips, setShowQuickTips] = useState<boolean>(false);

  // Active user name for personalized greeting
  const activeTech = technicians.find(t => t.id === selectedTechnicianId);
  const userName = role === 'admin' 
    ? 'Director' 
    : role === 'reception' 
      ? 'Diana' 
      : activeTech ? activeTech.name.split(' ')[0] : 'Técnico';

  // Filter orders by search and status
  const filteredOrders = orders.filter(order => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        order.id.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.includes(q) ||
        order.brand.toLowerCase().includes(q) ||
        order.model.toLowerCase().includes(q) ||
        order.applianceType.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // Role-based visibility
    if (role === 'technician') {
      if (order.technicianId !== selectedTechnicianId) return false;
    }

    // Status filter
    if (selectedStatusFilter !== 'all') {
      return order.status === selectedStatusFilter;
    }

    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'recibido':
        return <span className="text-xs font-semibold text-blue-600">Recibido</span>;
      case 'diagnostico':
        return <span className="text-xs font-semibold text-purple-600">En Diagnóstico</span>;
      case 'espera_refacciones':
        return <span className="text-xs font-semibold text-amber-600">Falta de Piezas</span>;
      case 'en_reparacion':
        return <span className="text-xs font-semibold text-sky-600">En Reparación</span>;
      case 'reparado':
        return <span className="text-xs font-semibold text-emerald-600">Listo para Entrega</span>;
      case 'cerrado':
        return <span className="text-xs font-semibold text-slate-500">Cerrado / Cobrado</span>;
      default:
        return <span className="text-xs font-semibold text-slate-500">{status}</span>;
    }
  };

  return (
    <div className="space-y-5 pb-24 lg:pb-8">
      
      {/* 1. Header Banner (Matching screenshot: "Te quedan 10 días de prueba / Activar mi plan") */}
      <div className="bg-gradient-to-r from-sky-100 via-cyan-50 to-teal-50 border border-sky-200/80 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">⚡</span>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800">
              {role === 'technician' 
                ? `Mesa de Trabajo Digital · ${activeTech?.name}` 
                : 'Taller Conectado · 4 Técnicos y 3 Sucursales Activas'}
            </p>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              {role === 'technician' 
                ? 'Las tarjetas reparadas acumulan comisión automáticamente en tu corte semanal.'
                : 'Supervisión en tiempo real de recepciones, refacciones y entregas.'}
            </p>
          </div>
        </div>
        <button
          onClick={onOpenKanban}
          className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs transition-colors shrink-0 shadow-sm"
        >
          Ver Flujo
        </button>
      </div>

      {/* 2. Top Bar with Title, Greeting, and Action Buttons (Exact replicate of screenshot) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Panel del taller
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Hola {userName} 👋 <span className="text-slate-400">·</span> esto es lo que pasa hoy
          </p>
        </div>

        {/* Buttons right aligned */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenKanban}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 font-semibold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
          >
            <Kanban className="w-4 h-4 text-slate-600" />
            <span className="underline decoration-slate-400 decoration-1 underline-offset-2">
              Abrir tablero
            </span>
          </button>

          {/* New reception button (Only Reception & Admin, disabled or switchable for technician) */}
          <button
            onClick={onNewReception}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-cyan-600/25 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-white stroke-[2.5]" />
            <span>+ Nueva recepción</span>
          </button>
        </div>
      </div>

      {/* 3. Stat Cards Grid (Replicating exact 5 cards from screenshot) */}
      {/* 2 columns on mobile, 5 columns on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Card 1: ACTIVOS EN TALLER */}
        <div 
          onClick={() => setSelectedStatusFilter('all')}
          className={`bg-white rounded-2xl p-4 sm:p-5 border cursor-pointer transition-all ${
            selectedStatusFilter === 'all'
              ? 'border-cyan-400 ring-2 ring-cyan-400/20 shadow-md'
              : 'border-slate-200/80 hover:border-slate-300 shadow-sm'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            ACTIVOS EN TALLER
          </span>
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight block my-1 font-mono">
            {metrics.activosEnTaller}
          </span>
          <span className="text-xs text-slate-500 font-medium block">
            equipos en proceso
          </span>
        </div>

        {/* Card 2: RECIBIDOS */}
        <div 
          onClick={() => setSelectedStatusFilter('recibido')}
          className={`bg-white rounded-2xl p-4 sm:p-5 border cursor-pointer transition-all ${
            selectedStatusFilter === 'recibido'
              ? 'border-blue-400 ring-2 ring-blue-400/20 shadow-md'
              : 'border-slate-200/80 hover:border-slate-300 shadow-sm'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            RECIBIDOS
          </span>
          <span className="text-3xl sm:text-4xl font-extrabold text-blue-600 tracking-tight block my-1 font-mono">
            {metrics.recibidos}
          </span>
          <span className="text-xs text-slate-500 font-medium block">
            pendientes de revisar
          </span>
        </div>

        {/* Card 3: ESPERA APROBACIÓN */}
        <div 
          onClick={() => setSelectedStatusFilter('diagnostico')}
          className={`bg-white rounded-2xl p-4 sm:p-5 border cursor-pointer transition-all ${
            selectedStatusFilter === 'diagnostico'
              ? 'border-purple-400 ring-2 ring-purple-400/20 shadow-md'
              : 'border-slate-200/80 hover:border-slate-300 shadow-sm'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            ESPERA APROBACIÓN
          </span>
          <span className="text-3xl sm:text-4xl font-extrabold text-purple-600 tracking-tight block my-1 font-mono">
            {metrics.esperaAprobacion}
          </span>
          <span className="text-xs text-slate-500 font-medium block">
            cotizaciones enviadas
          </span>
        </div>

        {/* Card 4: FALTA DE PIEZAS */}
        <div 
          onClick={() => setSelectedStatusFilter('espera_refacciones')}
          className={`bg-white rounded-2xl p-4 sm:p-5 border cursor-pointer transition-all ${
            selectedStatusFilter === 'espera_refacciones'
              ? 'border-orange-400 ring-2 ring-orange-400/20 shadow-md'
              : 'border-slate-200/80 hover:border-slate-300 shadow-sm'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            FALTA DE PIEZAS
          </span>
          <span className="text-3xl sm:text-4xl font-extrabold text-orange-500 tracking-tight block my-1 font-mono">
            {metrics.faltaDePiezas}
          </span>
          <span className="text-xs text-slate-500 font-medium block">
            en pausa
          </span>
        </div>

        {/* Card 5: REPARADOS */}
        <div 
          onClick={() => setSelectedStatusFilter('reparado')}
          className={`col-span-2 md:col-span-1 bg-white rounded-2xl p-4 sm:p-5 border cursor-pointer transition-all ${
            selectedStatusFilter === 'reparado'
              ? 'border-emerald-400 ring-2 ring-emerald-400/20 shadow-md'
              : 'border-slate-200/80 hover:border-slate-300 shadow-sm'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            REPARADOS
          </span>
          <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 tracking-tight block my-1 font-mono">
            {metrics.reparados}
          </span>
          <span className="text-xs text-slate-500 font-medium block">
            listos para entregar
          </span>
        </div>

      </div>

      {/* 4. Appointments & Deliveries Card (From screenshot: "Citas de hoy") */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">📅</span>
            <h3 className="text-base font-bold text-slate-900">
              Citas y Entregas de hoy
            </h3>
          </div>
          <span className="text-xs font-medium text-slate-400">
            {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' })}
          </span>
        </div>

        {orders.filter(o => o.status === 'reparado').length === 0 ? (
          <p className="text-xs sm:text-sm text-slate-500">
            No hay citas agendadas para hoy.
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-slate-500 mb-2">
              Equipos reparados listos para entrega inmediata en mostrador:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {orders.filter(o => o.status === 'reparado').slice(0, 4).map(o => (
                <div 
                  key={o.id}
                  onClick={() => onOpenOrderModal(o.id)}
                  className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 hover:bg-emerald-50 cursor-pointer transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-emerald-950 font-mono">
                      {o.id} · {o.customerName}
                    </span>
                    <span className="text-[11px] text-slate-600">
                      {o.brand} {o.model}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 font-mono">
                    Resta: ${o.remainingBalance}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. Live Orders List with Actionable Details */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {role === 'technician' ? 'Mis Órdenes Asignadas' : 'Órdenes de Servicio en Taller'}
            </h3>
            <p className="text-xs text-slate-500">
              {filteredOrders.length} equipos registrados en este filtro
            </p>
          </div>

          {/* Quick status tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                selectedStatusFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos ({orders.length})
            </button>
            <button
              onClick={() => setSelectedStatusFilter('recibido')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                selectedStatusFilter === 'recibido'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Recibidos
            </button>
            <button
              onClick={() => setSelectedStatusFilter('en_reparacion')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                selectedStatusFilter === 'en_reparacion'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              En Reparación
            </button>
            <button
              onClick={() => setSelectedStatusFilter('reparado')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                selectedStatusFilter === 'reparado'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Reparados
            </button>
          </div>
        </div>

        {/* List of Orders */}
        <div className="divide-y divide-slate-100">
          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm font-medium">No se encontraron órdenes con los filtros seleccionados.</p>
              <button 
                onClick={() => setSelectedStatusFilter('all')}
                className="mt-2 text-xs text-cyan-600 font-semibold underline"
              >
                Ver todas las órdenes
              </button>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div
                key={order.id}
                onClick={() => onOpenOrderModal(order.id)}
                className="py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 -mx-2 px-2 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                    {order.photoUrl ? (
                      <img 
                        src={order.photoUrl} 
                        alt={order.brand} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Wrench className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900 font-mono">
                        {order.id}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs font-semibold text-slate-800">
                        {order.customerName}
                      </span>
                      <span className="hidden sm:inline text-slate-300">·</span>
                      <span className="hidden sm:inline text-xs text-slate-500">
                        {order.customerPhone}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-600 mt-0.5">
                      {order.brand} {order.model} <span className="text-slate-400 font-normal">({order.applianceType})</span>
                    </p>

                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      <strong className="font-semibold text-slate-700">Falla:</strong> {order.reportedFailure}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-15 sm:pl-0">
                  <div className="flex flex-col sm:text-right">
                    <div>{getStatusBadge(order.status)}</div>
                    <span className="text-xs text-slate-500 font-mono mt-0.5">
                      Téc: <strong className="text-slate-700">{order.technicianName.split(' ')[0]}</strong>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-slate-900 font-mono block">
                      ${order.finalRepairCost}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {order.remainingBalance > 0 ? `Resta: $${order.remainingBalance}` : 'Liquidado'}
                    </span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 6. Floating Action & Quick Guide Icons (Matching screenshot bottom-right lightbulb and chat bubbles) */}
      <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-30 flex flex-col items-end gap-2.5">
        
        {/* Lightbulb quick tips */}
        {showQuickTips && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xl max-w-xs text-xs text-slate-700 space-y-2 mb-1 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                💡 Atajos Rápidos
              </span>
              <button 
                onClick={() => setShowQuickTips(false)}
                className="text-slate-400 hover:text-slate-800"
              >
                ✕
              </button>
            </div>
            <p><strong>Recepción:</strong> Registra la orden y anticipo. Al entregar y cobrar, usa el botón "Cerrar y Entregar".</p>
            <p><strong>Técnico:</strong> Diagnostica y cambia a "Reparado". Tu comisión del 12-16% se calcula al instante.</p>
            <p><strong>Administrador:</strong> Reasigna técnicos, revisa cortes de caja y liquidación semanal.</p>
          </div>
        )}

        <button
          onClick={() => setShowQuickTips(!showQuickTips)}
          className="w-12 h-12 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-600 flex items-center justify-center shadow-lg border border-amber-300 transition-transform active:scale-90"
          title="Consejos y ayuda operativa"
        >
          <Lightbulb className="w-6 h-6" />
        </button>

        <button
          onClick={() => alert('Soporte interno de Taller: WhatsApp línea directa con Administración (55 4192 8801)')}
          className="w-13 h-13 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center shadow-xl shadow-cyan-600/30 transition-transform active:scale-90"
          title="Línea de soporte y chat interno"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
};
