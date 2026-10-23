import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  CheckCircle, 
  User, 
  Phone, 
  Cpu, 
  Camera, 
  DollarSign, 
  FileText, 
  Wrench, 
  Check, 
  Printer, 
  AlertCircle,
  Building
} from 'lucide-react';
import { ApplianceType, RepairOrder } from '../types';

interface ReceptionModuleProps {
  onOrderCreated?: (orderId: string) => void;
}

export const ReceptionModule: React.FC<ReceptionModuleProps> = ({ onOrderCreated }) => {
  const { 
    createOrder, 
    technicians, 
    branches, 
    activeBranchId, 
    orders, 
    closeAndDeliverOrder,
    role
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'nueva_orden' | 'entregas_cierre' | 'tarifas'>('nueva_orden');

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [branchId, setBranchId] = useState(activeBranchId === 'all' ? 'b-matriz' : activeBranchId);
  const [technicianId, setTechnicianId] = useState(technicians[0]?.id || 'tech-1');
  const [applianceType, setApplianceType] = useState<ApplianceType>('Inverter / Aire Acondicionado');
  const [brand, setBrand] = useState('Samsung');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [reportedFailure, setReportedFailure] = useState('');
  const [physicalCondition, setPhysicalCondition] = useState('Sin quemaduras visibles, completo');
  const [accessories, setAccessories] = useState('Tarjeta electrónica + arnés');
  const [estimatedCost, setEstimatedCost] = useState('1200');
  const [advancePayment, setAdvancePayment] = useState('400');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80');

  // Success state
  const [createdOrder, setCreatedOrder] = useState<RepairOrder | null>(null);

  // Closing modal state
  const [selectedOrderToClose, setSelectedOrderToClose] = useState<RepairOrder | null>(null);
  const [closePaymentMethod, setClosePaymentMethod] = useState<'efectivo' | 'tarjeta' | 'transferencia'>('efectivo');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !reportedFailure) {
      alert('Por favor completa el nombre del cliente y la falla reportada.');
      return;
    }

    const newOrder = createOrder({
      customerName,
      customerPhone: customerPhone || '55 0000 0000',
      branchId,
      technicianId,
      applianceType,
      brand,
      model: model || 'Modelo estándar',
      serialNumber,
      reportedFailure,
      physicalCondition,
      accessories,
      estimatedCost: Number(estimatedCost) || 1200,
      advancePayment: Number(advancePayment) || 0,
      estimatedDeliveryDate: estimatedDeliveryDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      photoUrl,
    });

    setCreatedOrder(newOrder);
    if (onOrderCreated) {
      onOrderCreated(newOrder.id);
    }
  };

  const resetForm = () => {
    setCustomerName('');
    setCustomerPhone('');
    setModel('');
    setSerialNumber('');
    setReportedFailure('');
    setCreatedOrder(null);
  };

  // Orders ready for delivery & closing
  const readyOrders = orders.filter(o => o.status === 'reparado');

  const handleCloseOrderConfirm = () => {
    if (!selectedOrderToClose) return;
    closeAndDeliverOrder(selectedOrderToClose.id, closePaymentMethod, 'Recepción Mostrador');
    alert(`Orden ${selectedOrderToClose.id} cerrada y cobrada con éxito. Se generó la nota de remisión correspondiente.`);
    setSelectedOrderToClose(null);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header and Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Recepción y Mostrador
          </h1>
          <p className="text-xs text-slate-500">
            Ingreso de tarjetas, captura de síntomas, emisión de notas y entrega de equipos.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveSubTab('nueva_orden')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'nueva_orden'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            + Nueva Entrada
          </button>
          <button
            onClick={() => setActiveSubTab('entregas_cierre')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all relative ${
              activeSubTab === 'entregas_cierre'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Entregas y Cierre ({readyOrders.length})
          </button>
          <button
            onClick={() => setActiveSubTab('tarifas')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'tarifas'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tarifario
          </button>
        </div>
      </div>

      {/* SUBTAB 1: NUEVA ORDEN DE SERVICIO */}
      {activeSubTab === 'nueva_orden' && (
        <>
          {createdOrder ? (
            <div className="bg-white rounded-3xl border border-emerald-300 p-6 shadow-lg max-w-2xl mx-auto space-y-4">
              <div className="flex items-center gap-3 text-emerald-600">
                <CheckCircle className="w-8 h-8 shrink-0" />
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    ¡Orden de Servicio Generada con Éxito!
                  </h2>
                  <p className="text-xs text-slate-500">
                    Folio oficial: <strong className="font-mono text-emerald-700">{createdOrder.id}</strong>
                  </p>
                </div>
              </div>

              {/* Order Ticket Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2 text-slate-700">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-bold text-slate-900">TARJETAS ELECTRÓNICAS</span>
                  <span className="text-slate-500">{createdOrder.createdAt}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>Cliente: <strong>{createdOrder.customerName}</strong></div>
                  <div>Teléfono: <strong>{createdOrder.customerPhone}</strong></div>
                  <div>Aparato: <strong>{createdOrder.applianceType}</strong></div>
                  <div>Marca/Mod: <strong>{createdOrder.brand} {createdOrder.model}</strong></div>
                  <div>Técnico: <strong>{createdOrder.technicianName}</strong></div>
                  <div>Sucursal: <strong>{createdOrder.branchName}</strong></div>
                </div>
                <div className="border-t pt-2 text-[11px]">
                  <p><strong>Falla Reportada:</strong> {createdOrder.reportedFailure}</p>
                  <p><strong>Accesorios:</strong> {createdOrder.accessories}</p>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-slate-900">
                  <span>Costo Estimado: ${createdOrder.estimatedCost}</span>
                  <span>Anticipo: ${createdOrder.advancePayment}</span>
                  <span className="text-emerald-700">Resta: ${createdOrder.remainingBalance}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="w-full sm:flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir Orden / Ticket
                </button>
                <button
                  onClick={resetForm}
                  className="w-full sm:flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Registrar Otra Tarjeta
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-6">
              
              {/* Sección 1: Datos del Cliente */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-cyan-600" />
                  1. Datos del Cliente y Sucursal de Ingreso
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Roberto Sánchez Pérez"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="55 1234 5678"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Sucursal de Recepción
                    </label>
                    <select
                      value={branchId}
                      onChange={e => setBranchId(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 bg-white"
                    >
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Sección 2: Datos del Electrodoméstico / Tarjeta */}
              <div className="border-t pt-5">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <Cpu className="w-4 h-4 text-cyan-600" />
                  2. Identificación del Equipo y Tarjeta Electrónica
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tipo de Aparato
                    </label>
                    <select
                      value={applianceType}
                      onChange={e => setApplianceType(e.target.value as ApplianceType)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 bg-white"
                    >
                      <option value="Inverter / Aire Acondicionado">Inverter / Aire Acondicionado</option>
                      <option value="Lavadora Digital / Carga Frontal">Lavadora Digital / Carga Frontal</option>
                      <option value="Refrigerador Inverter / Smart">Refrigerador Inverter / Smart</option>
                      <option value="Horno Microondas">Horno Microondas</option>
                      <option value="Secadora de Ropa">Secadora de Ropa</option>
                      <option value="Tarjeta Fuente Conmutada Industrial">Tarjeta Fuente Industrial</option>
                      <option value="Módulo Electrónico General">Módulo Electrónico General</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Marca
                    </label>
                    <select
                      value={brand}
                      onChange={e => setBrand(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 bg-white"
                    >
                      <option value="Samsung">Samsung</option>
                      <option value="LG">LG</option>
                      <option value="Whirlpool">Whirlpool</option>
                      <option value="Mabe / GE">Mabe / GE</option>
                      <option value="Carrier">Carrier</option>
                      <option value="Panasonic">Panasonic</option>
                      <option value="Electrolux">Electrolux</option>
                      <option value="Daikin">Daikin</option>
                      <option value="Otra / Industrial">Otra / Industrial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Modelo
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Inverter Smart 19kg"
                      value={model}
                      onChange={e => setModel(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Número de Serie / Código Tarjeta
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. EBR7890-410"
                      value={serialNumber}
                      onChange={e => setSerialNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 3: Síntomas y Diagnóstico Inicial */}
              <div className="border-t pt-5">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-cyan-600" />
                  3. Captura Detallada de Síntomas y Estado Físico
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Falla Reportada por el Cliente *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe qué hace la tarjeta: No enciende, código de error E4, motor zumba pero no gira, tronó por tormenta eléctrica..."
                      value={reportedFailure}
                      onChange={e => setReportedFailure(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Estado Físico y Accesorios Entregados
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Condición física al recibir: Sulfato, pista quemada, silicona rota. Accesorios: Display, sensores, arnés, etc."
                      value={accessories}
                      onChange={e => setAccessories(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Foto de evidencia */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fotografía de Evidencia de Entrada
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={photoUrl}
                      alt="Evidencia tarjeta"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={photoUrl}
                        onChange={e => setPhotoUrl(e.target.value)}
                        placeholder="URL de foto o usar cámara"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección 4: Asignación y Costo Estimado */}
              <div className="border-t pt-5">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <Wrench className="w-4 h-4 text-cyan-600" />
                  4. Asignación a Técnico y Anticipo
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Técnico Asignado
                    </label>
                    <select
                      value={technicianId}
                      onChange={e => setTechnicianId(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 bg-white"
                    >
                      {technicians.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.specialty.split(' ')[0]})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Costo Estimado de Reparación ($)
                    </label>
                    <input
                      type="number"
                      value={estimatedCost}
                      onChange={e => setEstimatedCost(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Anticipo de Entrada ($)
                    </label>
                    <input
                      type="number"
                      value={advancePayment}
                      onChange={e => setAdvancePayment(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Fecha Estimada de Entrega
                    </label>
                    <input
                      type="date"
                      value={estimatedDeliveryDate}
                      onChange={e => setEstimatedDeliveryDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Botón de Emisión de Orden */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-extrabold text-sm shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                  <span>Emitir Orden de Servicio y Nota de Entrada</span>
                </button>
              </div>

            </form>
          )}
        </>
      )}

      {/* SUBTAB 2: ENTREGAS Y CIERRE DE ÓRDENES (PERMISO EXCLUSIVO RECEPCIÓN/ADMIN) */}
      {activeSubTab === 'entregas_cierre' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-4">
          <div className="border-b pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Equipos Reparados Pendientes de Cobro y Entrega
            </h2>
            <p className="text-xs text-slate-500">
              🔒 <strong>Permiso exclusivo:</strong> Mostrador es el único facultado para cobrar el saldo pendiente, entregar al cliente y cerrar la orden en el sistema.
            </p>
          </div>

          {readyOrders.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm">No hay equipos marcados como reparados pendientes de entrega en este momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {readyOrders.map(order => (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-extrabold text-emerald-950">
                        {order.id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                        Listo para entrega
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">
                      {order.customerName}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {order.brand} {order.model} ({order.applianceType})
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono mt-1">
                      Técnico: {order.technicianName}
                    </p>

                    {order.technicalDiagnosis && (
                      <p className="text-[11px] text-slate-600 mt-2 p-2 rounded-lg bg-white/70 border border-emerald-200">
                        <strong>Solución:</strong> {order.technicalDiagnosis}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-emerald-200/80 pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        Total: ${order.finalRepairCost} · Anticipo: ${order.advancePayment}
                      </span>
                      <span className="text-base font-extrabold text-emerald-700 font-mono">
                        Resta cobrar: ${order.remainingBalance}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedOrderToClose(order)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      Cerrar y Entregar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: TARIFARIO DE SERVICIOS */}
      {activeSubTab === 'tarifas' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Tarifario Sugerido de Reparación por Tipo de Tarjeta
          </h2>
          <p className="text-xs text-slate-500">
            Precios base estándar de mano de obra y diagnóstico para cotización inmediata en mostrador:
          </p>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex justify-between font-semibold text-slate-500 uppercase text-[10px]">
              <span>Tipo de Tarjeta / Aparato</span>
              <span>Rango Sugerido</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="font-medium text-slate-800">Refrigerador Inverter Samsung / LG Twin Cooling</span>
              <span className="font-mono font-bold text-cyan-700">$1,200 - $1,600 MXN</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="font-medium text-slate-800">Lavadora Carga Frontal Inverter Direct Drive</span>
              <span className="font-mono font-bold text-cyan-700">$1,100 - $1,500 MXN</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="font-medium text-slate-800">Minisplit Inverter (Condensadora Exterior)</span>
              <span className="font-mono font-bold text-cyan-700">$1,400 - $1,900 MXN</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="font-medium text-slate-800">Horno Microondas Inverter Panasonic / Mabe</span>
              <span className="font-mono font-bold text-cyan-700">$750 - $1,100 MXN</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="font-medium text-slate-800">Tarjetas de Potencia / Fuentes Conmutadas Industriales</span>
              <span className="font-mono font-bold text-cyan-700">$1,800 - $2,800 MXN</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA CERRAR Y ENTREGAR ORDEN */}
      {selectedOrderToClose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Cerrar y Entregar Orden
                </h3>
                <span className="text-xs font-mono text-emerald-600 font-bold">
                  {selectedOrderToClose.id} · {selectedOrderToClose.customerName}
                </span>
              </div>
              <button 
                onClick={() => setSelectedOrderToClose(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Servicio:</span>
                <span className="font-mono font-bold">${selectedOrderToClose.finalRepairCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Anticipo Pagado:</span>
                <span className="font-mono font-bold">${selectedOrderToClose.advancePayment}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold text-sm border-t pt-1">
                <span>Total a Cobrar Ahora:</span>
                <span className="font-mono">${selectedOrderToClose.remainingBalance}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Método de Pago del Saldo:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['efectivo', 'tarjeta', 'transferencia'] as const).map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setClosePaymentMethod(method)}
                    className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                      closePaymentMethod === method
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Al confirmar, el sistema registrará la orden como <strong>Cerrada</strong>, generará la Nota de Remisión formal de liquidación y acumulará la comisión de <strong>${selectedOrderToClose.commissionAmount}</strong> para el técnico <strong>{selectedOrderToClose.technicianName}</strong>.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrderToClose(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCloseOrderConfirm}
                className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
              >
                Confirmar Cobro
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
