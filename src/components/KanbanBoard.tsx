import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus, RepairOrder } from '../types';
import { 
  Inbox, 
  Search, 
  Clock, 
  Wrench, 
  CheckCircle2, 
  CheckCheck, 
  ChevronRight,
  Filter
} from 'lucide-react';

interface KanbanBoardProps {
  onOpenOrderModal: (orderId: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onOpenOrderModal }) => {
  const { orders, updateOrderStatus, role, technicians } = useApp();
  const [filterTech, setFilterTech] = useState<string>('all');

  const columns: { id: OrderStatus; label: string; color: string; icon: any }[] = [
    { id: 'recibido', label: '1. Recibidos', color: 'border-blue-400 bg-blue-50/50', icon: Inbox },
    { id: 'diagnostico', label: '2. En Diagnóstico', color: 'border-purple-400 bg-purple-50/50', icon: Search },
    { id: 'espera_refacciones', label: '3. Falta de Piezas', color: 'border-amber-400 bg-amber-50/50', icon: Clock },
    { id: 'en_reparacion', label: '4. En Reparación', color: 'border-sky-400 bg-sky-50/50', icon: Wrench },
    { id: 'reparado', label: '5. Listo para Entrega', color: 'border-emerald-400 bg-emerald-50/50', icon: CheckCircle2 },
    { id: 'cerrado', label: '6. Entregado y Cobrado', color: 'border-slate-300 bg-slate-50/50', icon: CheckCheck },
  ];

  const filteredOrders = orders.filter(o => {
    if (filterTech !== 'all' && o.technicianId !== filterTech) return false;
    return true;
  });

  const getOrdersForStatus = (status: OrderStatus) => {
    return filteredOrders.filter(o => o.status === status);
  };

  return (
    <div className="space-y-4 pb-20">
      
      {/* Top bar with technician filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Tablero Operativo del Taller (Kanban)
          </h1>
          <p className="text-xs text-slate-500">
            Flujo continuo de tarjetas desde el ingreso en mostrador hasta la entrega y cobro final.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterTech}
            onChange={(e) => setFilterTech(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-cyan-500 shadow-sm"
          >
            <option value="all">Todos los Técnicos</option>
            {technicians.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Columns (Horizontal scroll on mobile/tablet) */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x">
        {columns.map(col => {
          const colOrders = getOrdersForStatus(col.id);
          const Icon = col.icon;

          return (
            <div 
              key={col.id}
              className={`w-72 sm:w-80 shrink-0 rounded-2xl border p-3 flex flex-col max-h-[75vh] ${col.color} snap-start`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-slate-700" />
                  <span className="text-xs font-bold text-slate-900">{col.label}</span>
                </div>
                <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded-full bg-white text-slate-800 shadow-xs border border-slate-200">
                  {colOrders.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                {colOrders.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    Sin tarjetas en esta etapa
                  </div>
                ) : (
                  colOrders.map(order => (
                    <div
                      key={order.id}
                      onClick={() => onOpenOrderModal(order.id)}
                      className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-cyan-400 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono font-extrabold text-cyan-800">
                          {order.id}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-900">
                          ${order.finalRepairCost}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {order.brand} {order.model}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium truncate">
                        {order.customerName}
                      </p>

                      <p className="text-[10px] text-slate-600 line-clamp-2 mt-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                        {order.reportedFailure}
                      </p>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>Téc: {order.technicianName.split(' ')[0]}</span>
                        <span className="text-cyan-600 font-semibold group-hover:underline flex items-center gap-0.5">
                          Detalles <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
