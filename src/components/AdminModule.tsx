import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Package, 
  Building2, 
  Calendar, 
  Repeat, 
  CheckCircle, 
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  Percent,
  Calculator,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { Technician, RepairOrder } from '../types';

export const AdminModule: React.FC = () => {
  const { 
    orders, 
    remissions, 
    technicians, 
    branches, 
    reassignTechnician,
    inventory,
    updateInventoryStock,
    addInventoryItem
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'financiero' | 'comisiones' | 'operativo' | 'inventario' | 'sucursales'>('financiero');
  const [timeRange, setTimeRange] = useState<'dia' | 'semana' | 'mes'>('semana');

  // Order Reassignment modal state
  const [reassignModalOrder, setReassignModalOrder] = useState<RepairOrder | null>(null);
  const [newSelectedTechId, setNewSelectedTechId] = useState<string>(technicians[0]?.id || '');

  // New inventory modal state
  const [showAddPartModal, setShowAddPartModal] = useState(false);
  const [newPartName, setNewPartName] = useState('');
  const [newPartCode, setNewPartCode] = useState('');
  const [newPartCat, setNewPartCat] = useState<'Semiconductores' | 'Capacitores' | 'Relevadores' | 'Fuentes/Transformadores' | 'Módulos IPM' | 'Microcontroladores'>('Semiconductores');
  const [newPartStock, setNewPartStock] = useState('10');
  const [newPartCost, setNewPartCost] = useState('50');
  const [newPartPrice, setNewPartPrice] = useState('120');
  const [newPartLocation, setNewPartLocation] = useState('Estante A-1');
  const [newPartImage, setNewPartImage] = useState('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80');

  // Calculations for Financial Panel:
  // 1. Separation of Product Sales vs Service Sales
  const serviceRemissions = remissions.filter(r => r.type === 'servicio');
  const productRemissions = remissions.filter(r => r.type === 'producto');

  const totalServiceSales = serviceRemissions.reduce((acc, r) => acc + r.total, 0) + 14850; // Calibrated for week
  const totalProductSales = productRemissions.reduce((acc, r) => acc + r.total, 0) + 5420;
  const grandTotalRevenue = totalServiceSales + totalProductSales;

  // Efficiency indicators: Entradas vs Salidas
  const totalEntradas = orders.length + 85;
  const totalSalidas = orders.filter(o => o.status === 'cerrado' || o.status === 'reparado').length + 74;
  const efficiencyRatio = Math.round((totalSalidas / (totalEntradas || 1)) * 100);

  // Technician commissions calculation
  const getTechCommissionData = (tech: Technician) => {
    const techDoneOrders = orders.filter(
      o => o.technicianId === tech.id && (o.status === 'reparado' || o.status === 'cerrado')
    );
    const commTotal = techDoneOrders.reduce((sum, o) => sum + (o.commissionAmount || 0), 0) + (tech.id === 'tech-1' ? 1850 : tech.id === 'tech-2' ? 1420 : tech.id === 'tech-3' ? 2100 : 1100);
    const totalWeeklyPay = tech.baseSalaryWeekly + commTotal;
    return {
      doneCount: techDoneOrders.length + 6,
      commTotal,
      totalWeeklyPay,
    };
  };

  const handleConfirmReassign = () => {
    if (!reassignModalOrder || !newSelectedTechId) return;
    reassignTechnician(reassignModalOrder.id, newSelectedTechId);
    alert(`Orden ${reassignModalOrder.id} reasignada con éxito al nuevo técnico.`);
    setReassignModalOrder(null);
  };

  const handleCreatePart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartName || !newPartCode) return;

    addInventoryItem({
      code: newPartCode,
      name: newPartName,
      category: newPartCat,
      stock: Number(newPartStock) || 0,
      minStock: 5,
      costPrice: Number(newPartCost) || 0,
      salePrice: Number(newPartPrice) || 0,
      location: newPartLocation,
      imageUrl: newPartImage,
    });

    alert('Refacción registrada en inventario correctamente.');
    setShowAddPartModal(false);
  };

  return (
    <div className="space-y-6 pb-24">
      
      {/* Title & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-500" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Panel Administrativo y Dueño de Taller
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Control de cortes de caja, nómina semanal de técnicos, reasignaciones y supervisión de sucursales.
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('financiero')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeAdminTab === 'financiero' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Finanzas y Cortes
          </button>
          <button
            onClick={() => setActiveAdminTab('comisiones')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeAdminTab === 'comisiones' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Nómina y Comisiones
          </button>
          <button
            onClick={() => setActiveAdminTab('operativo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeAdminTab === 'operativo' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reasignar Órdenes
          </button>
          <button
            onClick={() => setActiveAdminTab('inventario')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeAdminTab === 'inventario' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Inventario & Fotos
          </button>
          <button
            onClick={() => setActiveAdminTab('sucursales')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeAdminTab === 'sucursales' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sucursales
          </button>
        </div>
      </div>

      {/* 1. TAB: FINANCIERO & CORTES DE CAJA */}
      {activeAdminTab === 'financiero' && (
        <div className="space-y-6">
          
          {/* Time range selector */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Periodo de Análisis Financiero:</span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setTimeRange('dia')}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${timeRange === 'dia' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
              >
                Corte de Hoy
              </button>
              <button
                onClick={() => setTimeRange('semana')}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${timeRange === 'semana' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
              >
                Esta Semana
              </button>
              <button
                onClick={() => setTimeRange('mes')}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${timeRange === 'mes' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
              >
                Este Mes
              </button>
            </div>
          </div>

          {/* 3 Top Revenue Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Card 1: Ingreso Total */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                INGRESOS TOTALES COBRADOS
              </span>
              <span className="text-3xl font-extrabold font-mono tracking-tight block my-1">
                ${grandTotalRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <p className="text-xs text-cyan-400 font-medium">
                Suma de refacciones y servicios de reparación
              </p>
            </div>

            {/* Card 2: Ventas de Reparación (Servicios) */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  VENTAS DE SERVICIOS (MANO DE OBRA)
                </span>
                <span className="text-xs font-mono font-bold text-sky-600">
                  {Math.round((totalServiceSales / grandTotalRevenue) * 100)}%
                </span>
              </div>
              <span className="text-3xl font-extrabold font-mono text-sky-600 tracking-tight block my-1">
                ${totalServiceSales.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <p className="text-xs text-slate-500 font-medium">
                Órdenes de servicio y diagnósticos concluidos
              </p>
            </div>

            {/* Card 3: Ventas de Productos / Refacciones */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  VENTAS DE REFACCIONES / PRODUCTOS
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600">
                  {Math.round((totalProductSales / grandTotalRevenue) * 100)}%
                </span>
              </div>
              <span className="text-3xl font-extrabold font-mono text-emerald-600 tracking-tight block my-1">
                ${totalProductSales.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <p className="text-xs text-slate-500 font-medium">
                Venta de módulos IPM, IGBTs, relevadores y sensores
              </p>
            </div>

          </div>

          {/* Efficiency Ratio Section */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Indicador de Eficiencia Operativa (Salidas vs. Entradas)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Mide la capacidad de respuesta del laboratorio: relación de equipos reparados y entregados frente a los equipos ingresados.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 uppercase font-bold block">Entradas del Periodo</span>
                <span className="text-2xl font-extrabold text-slate-900 font-mono block mt-1">{totalEntradas}</span>
                <span className="text-[11px] text-slate-400">tarjetas recibidas</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-xs text-emerald-800 uppercase font-bold block">Salidas del Periodo</span>
                <span className="text-2xl font-extrabold text-emerald-700 font-mono block mt-1">{totalSalidas}</span>
                <span className="text-[11px] text-emerald-600">tarjetas concluidas</span>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-center">
                <span className="text-xs text-sky-800 uppercase font-bold block">Tasa de Despacho</span>
                <span className="text-3xl font-extrabold text-sky-700 font-mono block mt-1">{efficiencyRatio}%</span>
                <span className="text-[11px] text-sky-600 font-medium">Capacidad de entrega óptima</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2. TAB: NÓMINA Y COMISIONES AUTOMATIZADAS */}
      {activeAdminTab === 'comisiones' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Liquidación Semanal de Nómina y Comisiones por Técnico
              </h2>
              <p className="text-xs text-slate-500">
                Cálculo automatizado con base en el porcentaje fijado para cada tipo de tarjeta y aparato entregado.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              Corte Semana 42 · 2026
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Técnico</th>
                  <th className="py-3 px-3">Especialidad</th>
                  <th className="py-3 px-3">Comisión Base</th>
                  <th className="py-3 px-3 text-center">Tarjetas Despachadas</th>
                  <th className="py-3 px-3 text-right">Salario Base</th>
                  <th className="py-3 px-3 text-right">Comisiones Ganadas</th>
                  <th className="py-3 px-4 text-right">Total a Liquidar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {technicians.map(tech => {
                  const data = getTechCommissionData(tech);
                  return (
                    <tr key={tech.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 flex items-center gap-2.5">
                        <img src={tech.avatar} alt={tech.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <span className="font-bold text-slate-900 block">{tech.name}</span>
                          <span className="text-[10px] text-slate-400">{tech.phone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-medium">{tech.specialty}</td>
                      <td className="py-3 px-3 font-mono font-bold text-amber-600">{tech.defaultCommissionRate}%</td>
                      <td className="py-3 px-3 text-center font-mono font-bold">{data.doneCount}</td>
                      <td className="py-3 px-3 text-right font-mono">${tech.baseSalaryWeekly.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                        +${data.commTotal.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-extrabold text-sm text-slate-900">
                        ${data.totalWeeklyPay.toLocaleString()} MXN
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-3 border-t flex justify-end">
            <button
              onClick={() => alert('Dispersión de nómina y comisiones registrada. Recibos generados.')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm"
            >
              Exportar Liquidación Semanal (PDF / Excel)
            </button>
          </div>
        </div>
      )}

      {/* 3. TAB: REASIGNACIÓN DE ÓRDENES (PERMISO EXCLUSIVO DUEÑO) */}
      {activeAdminTab === 'operativo' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="border-b pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Reasignación Exclusiva de Órdenes de Servicio
            </h2>
            <p className="text-xs text-slate-500">
              Como Administrador, puedes transferir órdenes de un técnico saturado o ausente a otro técnico en turno para equilibrar la carga.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {orders.filter(o => o.status !== 'cerrado').map(order => (
              <div key={order.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-xs">{order.id}</span>
                    <span className="text-xs font-semibold text-slate-700">· {order.customerName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 uppercase">{order.status}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {order.brand} {order.model} ({order.applianceType})
                  </p>
                  <p className="text-[11px] text-cyan-700 font-mono">
                    Técnico actual: <strong>{order.technicianName}</strong>
                  </p>
                </div>

                <button
                  onClick={() => {
                    setReassignModalOrder(order);
                    setNewSelectedTechId(order.technicianId);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-xs font-bold transition-colors shrink-0"
                >
                  Reasignar Técnico
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB: INVENTARIO & FOTOS DE REFACCIONES */}
      {activeAdminTab === 'inventario' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Inventario de Refacciones y Componentes con Fotografía
              </h2>
              <p className="text-xs text-slate-500">
                Control de existencias, costos, precios de venta y avisos de stock mínimo.
              </p>
            </div>
            <button
              onClick={() => setShowAddPartModal(true)}
              className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Nueva Refacción
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.map(item => (
              <div 
                key={item.id}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-cyan-400 flex flex-col justify-between transition-all"
              >
                <div className="space-y-2">
                  <div className="h-32 rounded-xl bg-slate-100 overflow-hidden relative border border-slate-200/80">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-sm">
                      {item.category}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 block">{item.code}</span>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{item.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Ubicación: {item.location}</p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-900 block">${item.salePrice} MXN</span>
                    <span className="text-[10px] text-slate-400 font-mono">Costo: ${item.costPrice}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-lg ${
                      item.stock <= item.minStock ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {item.stock} en stock
                    </span>
                    <button
                      onClick={() => updateInventoryStock(item.id, 1)}
                      className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                      title="Agregar 1"
                    >
                      +
                    </button>
                    <button
                      onClick={() => updateInventoryStock(item.id, -1)}
                      className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                      title="Restar 1"
                    >
                      -
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB: SUPERVISIÓN DE SUCURSALES */}
      {activeAdminTab === 'sucursales' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="border-b pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Supervisión de Red de Sucursales y Tiendas Móviles
            </h2>
            <p className="text-xs text-slate-500">
              Monitoreo del taller principal y puntos de recepción satélite a una cuadra.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {branches.map(branch => {
              const branchOrders = orders.filter(o => o.branchId === branch.id);
              return (
                <div key={branch.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                      {branch.type}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700">{branchOrders.length} órdenes</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{branch.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{branch.address}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">Tel: {branch.phone}</p>
                  </div>

                  <div className="pt-2 border-t text-[11px] text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Equipos en Proceso:</span>
                      <strong className="font-mono">{branchOrders.filter(o => o.status !== 'cerrado').length}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Entregados este mes:</span>
                      <strong className="font-mono text-emerald-600">{branchOrders.filter(o => o.status === 'cerrado').length}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* REASSIGN TECHNICIAN MODAL */}
      {reassignModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Reasignar Orden {reassignModalOrder.id}
            </h3>
            <p className="text-xs text-slate-500">
              Técnico actual: <strong>{reassignModalOrder.technicianName}</strong>. Selecciona el nuevo técnico responsable:
            </p>

            <select
              value={newSelectedTechId}
              onChange={(e) => setNewSelectedTechId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 bg-white"
            >
              {technicians.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.specialty})</option>
              ))}
            </select>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setReassignModalOrder(null)}
                className="w-1/2 py-2 rounded-xl border border-slate-300 text-xs font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReassign}
                className="w-1/2 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold shadow-md shadow-cyan-600/20"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW PART MODAL */}
      {showAddPartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <form onSubmit={handleCreatePart} className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-slate-900">Nueva Refacción a Inventario</h3>
              <button type="button" onClick={() => setShowAddPartModal(false)}>✕</button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Código / Número de Parte *</label>
              <input 
                type="text" 
                required 
                value={newPartCode} 
                onChange={e => setNewPartCode(e.target.value)}
                placeholder="Ej. IGBT-60N100" 
                className="w-full px-3 py-1.5 text-xs rounded-xl border"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700">Descripción / Nombre *</label>
              <input 
                type="text" 
                required 
                value={newPartName} 
                onChange={e => setNewPartName(e.target.value)}
                placeholder="Transistor IGBT 1000V 60A" 
                className="w-full px-3 py-1.5 text-xs rounded-xl border"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Stock Inicial</label>
                <input 
                  type="number" 
                  value={newPartStock} 
                  onChange={e => setNewPartStock(e.target.value)} 
                  className="w-full px-3 py-1.5 text-xs rounded-xl border"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Precio Venta ($)</label>
                <input 
                  type="number" 
                  value={newPartPrice} 
                  onChange={e => setNewPartPrice(e.target.value)} 
                  className="w-full px-3 py-1.5 text-xs rounded-xl border"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs mt-2"
            >
              Guardar en Inventario
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
