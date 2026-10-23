import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Phone, Search, ChevronRight, FileText } from 'lucide-react';

interface CustomerModuleProps {
  onOpenOrderModal: (orderId: string) => void;
}

export const CustomerModule: React.FC<CustomerModuleProps> = ({ onOpenOrderModal }) => {
  const { orders } = useApp();
  const [clientSearch, setClientSearch] = useState('');

  // Extract unique customers from orders
  const customersMap = new Map<string, {
    name: string;
    phone: string;
    orders: typeof orders;
    totalSpent: number;
  }>();

  orders.forEach(order => {
    const key = order.customerName.toLowerCase().trim();
    if (!customersMap.has(key)) {
      customersMap.set(key, {
        name: order.customerName,
        phone: order.customerPhone,
        orders: [],
        totalSpent: 0,
      });
    }
    const entry = customersMap.get(key)!;
    entry.orders.push(order);
    entry.totalSpent += order.finalRepairCost;
  });

  const customerList = Array.from(customersMap.values()).filter(c => {
    if (!clientSearch.trim()) return true;
    const q = clientSearch.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q);
  });

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Directorio de Clientes
          </h1>
          <p className="text-xs text-slate-500">
            Historial de tarjetas ingresadas, teléfonos de contacto y total acumulado de reparaciones.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={clientSearch}
            onChange={e => setClientSearch(e.target.value)}
            placeholder="Buscar por cliente o teléfono..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customerList.map((client, idx) => (
          <div key={idx} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold text-sm">
                {client.name.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                ${client.totalSpent} MXN
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">{client.name}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {client.phone}
              </p>
            </div>

            <div className="pt-2 border-t space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Historial de Órdenes ({client.orders.length})
              </span>
              {client.orders.map(o => (
                <div
                  key={o.id}
                  onClick={() => onOpenOrderModal(o.id)}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-cyan-50 cursor-pointer text-xs transition-colors"
                >
                  <span className="font-mono font-bold text-cyan-800">{o.id}</span>
                  <span className="text-[11px] text-slate-600 truncate max-w-[140px]">{o.brand} {o.model}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
