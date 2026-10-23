import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wrench, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileCheck, 
  Lock, 
  DollarSign, 
  ChevronRight, 
  Save, 
  Cpu, 
  HelpCircle,
  TrendingUp,
  Percent
} from 'lucide-react';
import { OrderStatus, RepairOrder } from '../types';

interface TechnicianModuleProps {
  onOpenOrderModal: (orderId: string) => void;
}

export const TechnicianModule: React.FC<TechnicianModuleProps> = ({ onOpenOrderModal }) => {
  const { 
    orders, 
    technicians, 
    selectedTechnicianId, 
    setSelectedTechnicianId,
    updateOrderStatus,
    role
  } = useApp();

  const [selectedOrder, setSelectedOrder] = useState<RepairOrder | null>(null);
  const [techDiagnosis, setTechDiagnosis] = useState('');
  const [techComponents, setTechComponents] = useState('');
  const [techStatus, setTechStatus] = useState<OrderStatus>('en_reparacion');
  const [techNotes, setTechNotes] = useState('');

  const currentTechnician = technicians.find(t => t.id === selectedTechnicianId) || technicians[0];

  // Technician's specific assigned orders
  const techOrders = orders.filter(o => o.technicianId === currentTechnician.id);
  const inProgressOrders = techOrders.filter(o => o.status !== 'cerrado');
  const completedOrders = techOrders.filter(o => o.status === 'reparado' || o.status === 'cerrado');

  // Weekly commission calculations
  const totalCommissionEarned = completedOrders.reduce((sum, o) => sum + (o.commissionAmount || 0), 0);
  const estimatedCommissionPending = inProgressOrders
    .filter(o => o.status !== 'reparado')
    .reduce((sum, o) => sum + (o.commissionAmount || 0), 0);

  const handleOpenEdit = (order: RepairOrder) => {
    setSelectedOrder(order);
    setTechDiagnosis(order.technicalDiagnosis || '');
    setTechComponents(order.componentsUsed || '');
    setTechStatus(order.status);
    setTechNotes(order.internalNotes || '');
  };

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    // Explicit technician security check: cannot set to 'cerrado'
    if (techStatus === 'cerrado') {
      alert('🔒 Restricción de Seguridad: Como técnico puedes avanzar la tarjeta hasta "Reparado / Listo para entrega". El cierre formal y entrega con cobro lo realiza Recepción.');
      return;
    }

    updateOrderStatus(
      selectedOrder.id,
      techStatus,
      techDiagnosis,
      techComponents,
      techNotes
    );

    alert(`Orden ${selectedOrder.id} actualizada correctamente.`);
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6 pb-24">
      
      {/* Header with Technician Switcher & Commission Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              Mesa de Banco de Trabajo
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">Tablet & Móvil</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Área de Reparación y Diagnóstico
          </h1>
        </div>

        {/* Technician profile selector */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <img
            src={currentTechnician.avatar}
            alt={currentTechnician.name}
            className="w-10 h-10 rounded-xl object-cover border border-slate-200"
          />
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold">
              Técnico en Turno:
            </label>
            <select
              value={selectedTechnicianId}
              onChange={(e) => setSelectedTechnicianId(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              {technicians.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.specialty.split(' ')[0]})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Commission & Weekly Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Card 1: Comisiones Acumuladas */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl p-5 shadow-lg shadow-emerald-500/15">
          <div className="flex items-center justify-between opacity-90 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Comisión Semanal Ganada
            </span>
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-3xl font-extrabold font-mono tracking-tight block">
            ${totalCommissionEarned.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <p className="text-xs text-emerald-100 font-medium mt-1">
            Por {completedOrders.length} tarjetas reparadas/entregadas
          </p>
        </div>

        {/* Card 2: En Proceso en mi Mesa */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              En Mesa de Trabajo
            </span>
            <Cpu className="w-5 h-5 text-sky-500" />
          </div>
          <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight block">
            {inProgressOrders.length}
          </span>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Tarjetas activas en revisión
          </p>
        </div>

        {/* Card 3: Tasa de Comisión y Salario Base */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Tasa Asignada
            </span>
            <Percent className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600 font-mono tracking-tight">
              {currentTechnician.defaultCommissionRate}%
            </span>
            <span className="text-xs text-slate-400">por tarjeta</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Base semanal: ${currentTechnician.baseSalaryWeekly} MXN
          </p>
        </div>

      </div>

      {/* Active Orders List */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Tarjetas Asignadas a {currentTechnician.name}
            </h2>
            <p className="text-xs text-slate-500">
              Toca una tarjeta para actualizar su diagnóstico, cambiar componentes y marcar como lista.
            </p>
          </div>
          <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
            {techOrders.length} Asignadas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {techOrders.map(order => {
            const isReparado = order.status === 'reparado';
            const isCerrado = order.status === 'cerrado';

            return (
              <div
                key={order.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isReparado 
                    ? 'border-emerald-200 bg-emerald-50/30' 
                    : isCerrado
                      ? 'border-slate-200 bg-slate-50 opacity-80'
                      : 'border-slate-200 bg-white hover:border-cyan-400 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold font-mono text-slate-900">
                      {order.id}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-emerald-600 font-mono">
                    Comisión: ${order.commissionAmount}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">
                  {order.brand} {order.model}
                </h4>
                <p className="text-xs text-slate-500">
                  {order.applianceType} · Cliente: <strong>{order.customerName}</strong>
                </p>

                <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                  <p><strong>Falla Reportada:</strong> {order.reportedFailure}</p>
                  {order.technicalDiagnosis && (
                    <p className="text-cyan-800">
                      <strong>Diagnóstico:</strong> {order.technicalDiagnosis}
                    </p>
                  )}
                  {order.componentsUsed && (
                    <p className="text-amber-800">
                      <strong>Refacciones:</strong> {order.componentsUsed}
                    </p>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Ingreso: {order.createdAt}
                  </span>

                  <button
                    onClick={() => handleOpenEdit(order)}
                    disabled={isCerrado}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isCerrado
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm'
                    }`}
                  >
                    {isCerrado ? 'Orden Cerrada' : 'Actualizar Avance'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL DE ACTUALIZACIÓN TÉCNICA */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Actualización Técnica · {selectedOrder.id}
                </h3>
                <span className="text-xs text-slate-500">
                  {selectedOrder.brand} {selectedOrder.model} ({selectedOrder.customerName})
                </span>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUpdate} className="space-y-4">
              
              {/* Estatus técnico */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estatus de la Reparación:
                </label>
                <select
                  value={techStatus}
                  onChange={(e) => setTechStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 bg-white"
                >
                  <option value="diagnostico">En Diagnóstico / Revisión en Banco</option>
                  <option value="espera_refacciones">Falta de Piezas / En Espera de Refacción</option>
                  <option value="en_reparacion">En Reparación / Micro-soldadura</option>
                  <option value="reparado">✅ Reparado / Listo para Entrega</option>
                </select>
              </div>

              {/* Security Warning about closing */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
                <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Seguridad del Taller:</strong> Los técnicos no pueden cerrar la orden de servicio. Al cambiar a <strong>"Reparado / Listo para entrega"</strong>, la orden se transfiere a Mostrador para entrega al cliente y cobro formal.
                </p>
              </div>

              {/* Diagnóstico Técnico */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Diagnóstico Técnico Realizado:
                </label>
                <textarea
                  rows={2}
                  value={techDiagnosis}
                  onChange={(e) => setTechDiagnosis(e.target.value)}
                  placeholder="Ej. IGBT de fase V perforado, corto en puente rectificador, diodos zener abiertos..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Componentes Utilizados */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Refacciones y Componentes Utilizados:
                </label>
                <textarea
                  rows={2}
                  value={techComponents}
                  onChange={(e) => setTechComponents(e.target.value)}
                  placeholder="Ej. 1x IPM FSBB20CH60C, 2x Capacitores 450V, soldadura de pistas..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Notas internas */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Observaciones Técnicas / Pruebas de Banco:
                </label>
                <textarea
                  rows={2}
                  value={techNotes}
                  onChange={(e) => setTechNotes(e.target.value)}
                  placeholder="Pruebas realizadas: Probado con motor trifásico 30 minutos a 60Hz sin sobrecalentamiento."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20 flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Guardar Avance
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
