import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Printer, 
  Wrench, 
  Clock, 
  CheckCircle, 
  Lock, 
  DollarSign, 
  ShieldCheck, 
  Cpu, 
  Phone, 
  User, 
  Save 
} from 'lucide-react';
import { OrderStatus } from '../types';

interface OrderDetailModalProps {
  orderId: string;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ orderId, onClose }) => {
  const { orders, role, updateOrderStatus, closeAndDeliverOrder } = useApp();

  const order = orders.find(o => o.id === orderId);
  if (!order) return null;

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
  const [techDiag, setTechDiag] = useState(order.technicalDiagnosis || '');
  const [components, setComponents] = useState(order.componentsUsed || '');
  const [notes, setNotes] = useState(order.internalNotes || '');
  const [showClosePrompt, setShowClosePrompt] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'tarjeta' | 'transferencia'>('efectivo');

  const handleUpdate = () => {
    if (role === 'technician' && currentStatus === 'cerrado') {
      alert('🔒 Restricción de Seguridad: Los técnicos no pueden cerrar la orden. Recepción o Administrador la cerrarán al entregar y cobrar al cliente.');
      return;
    }

    updateOrderStatus(order.id, currentStatus, techDiag, components, notes);
    alert('Orden actualizada con éxito.');
    onClose();
  };

  const handleConfirmClose = () => {
    closeAndDeliverOrder(order.id, paymentMethod, 'Mostrador / Recepción');
    alert(`Orden ${order.id} cerrada y entregada. Cobro registrado.`);
    setShowClosePrompt(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4 my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-extrabold font-mono text-cyan-800 bg-cyan-50 px-3 py-1 rounded-xl border border-cyan-200">
              {order.id}
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {order.brand} {order.model}
              </h2>
              <span className="text-xs text-slate-500">{order.applianceType}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Col 1: Cliente & Equipo */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
              Datos de Entrada
            </h4>
            <div className="space-y-1 text-slate-600">
              <p><strong>Cliente:</strong> {order.customerName}</p>
              <p><strong>Teléfono:</strong> {order.customerPhone}</p>
              <p><strong>Sucursal:</strong> {order.branchName}</p>
              <p><strong>Fecha Ingreso:</strong> {order.createdAt}</p>
              <p><strong>Accesorios:</strong> {order.accessories}</p>
              <p><strong>Condición Física:</strong> {order.physicalCondition}</p>
            </div>

            <div className="pt-2 border-t text-slate-700">
              <p className="font-bold text-rose-800">Falla Reportada:</p>
              <p className="italic mt-0.5">"{order.reportedFailure}"</p>
            </div>
          </div>

          {/* Col 2: Técnico & Aspectos Financieros */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
              Asignación y Finanzas
            </h4>
            <div className="space-y-1 text-slate-600">
              <p><strong>Técnico Responsable:</strong> {order.technicianName}</p>
              <p><strong>Comisión Técnico ({order.commissionPercentage}%):</strong> ${order.commissionAmount} MXN</p>
              <p><strong>Costo Final Estimado:</strong> ${order.finalRepairCost}</p>
              <p><strong>Anticipo Pagado:</strong> ${order.advancePayment}</p>
              <p className="text-emerald-700 font-extrabold text-sm pt-1">
                Saldo Pendiente: ${order.remainingBalance}
              </p>
            </div>

            {order.photoUrl && (
              <div className="pt-2 border-t">
                <span className="font-bold text-[10px] text-slate-500 block mb-1">Evidencia Fotográfica:</span>
                <img 
                  src={order.photoUrl} 
                  alt="Evidencia" 
                  className="w-full h-24 rounded-xl object-cover border border-slate-200"
                />
              </div>
            )}
          </div>

        </div>

        {/* Estatus & Diagnóstico */}
        <div className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Estatus del Proceso:
            </label>
            <select
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value as OrderStatus)}
              disabled={order.status === 'cerrado'}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 bg-white"
            >
              <option value="recibido">Recibido en Mostrador</option>
              <option value="diagnostico">En Diagnóstico / Revisión en Banco</option>
              <option value="espera_refacciones">Falta de Piezas / En Pausa</option>
              <option value="en_reparacion">En Reparación / Micro-soldadura</option>
              <option value="reparado">Reparado / Listo para Entrega</option>
              {role !== 'technician' && (
                <option value="cerrado">Cerrado / Entregado al Cliente</option>
              )}
            </select>
            {role === 'technician' && (
              <span className="text-[10px] text-amber-700 mt-1 block">
                🔒 Como técnico solo puedes avanzar hasta "Reparado / Listo para Entrega".
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Diagnóstico Técnico:
              </label>
              <textarea
                rows={2}
                value={techDiag}
                onChange={e => setTechDiag(e.target.value)}
                disabled={order.status === 'cerrado'}
                placeholder="Detalle de fallas encontradas..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Componentes / Refacciones:
              </label>
              <textarea
                rows={2}
                value={components}
                onChange={e => setComponents(e.target.value)}
                disabled={order.status === 'cerrado'}
                placeholder="Componentes sustituidos..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t">
          
          <button
            type="button"
            onClick={() => window.print()}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            Imprimir Hoja de Taller
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* If order is reparado and role is NOT technician, allow fast closing */}
            {order.status === 'reparado' && role !== 'technician' && (
              <button
                type="button"
                onClick={() => setShowClosePrompt(true)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                Cerrar y Cobrar
              </button>
            )}

            {order.status !== 'cerrado' && (
              <button
                type="button"
                onClick={handleUpdate}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Guardar Cambios
              </button>
            )}
          </div>

        </div>

      </div>

      {/* QUICK CLOSE PROMPT */}
      {showClosePrompt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Cobro y Cierre de Folio {order.id}</h3>
            <p className="text-xs text-slate-600">
              Saldo a liquidar: <strong className="font-mono text-emerald-700 font-bold">${order.remainingBalance} MXN</strong>
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Método de Cobro:</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border bg-white capitalize"
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClosePrompt(false)}
                className="w-1/2 py-2 rounded-xl border text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmClose}
                className="w-1/2 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm"
              >
                Confirmar Cierre
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
