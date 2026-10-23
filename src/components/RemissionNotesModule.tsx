import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RemissionNote, RemissionType } from '../types';
import { 
  FileText, 
  ShoppingCart, 
  Wrench, 
  Plus, 
  Printer, 
  Search, 
  CheckCircle, 
  DollarSign 
} from 'lucide-react';

export const RemissionNotesModule: React.FC = () => {
  const { remissions, createRemissionNote, inventory, branches, updateInventoryStock } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'producto' | 'servicio'>('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedNoteForPrint, setSelectedNoteForPrint] = useState<RemissionNote | null>(null);

  // New Remission Form State
  const [remType, setRemType] = useState<RemissionType>('producto');
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [branchId, setBranchId] = useState(branches[0]?.id || 'b-matriz');
  const [selectedPartId, setSelectedPartId] = useState(inventory[0]?.id || '');
  const [itemQuantity, setItemQuantity] = useState('1');
  const [customDescription, setCustomDescription] = useState('');
  const [customPrice, setCustomPrice] = useState('350');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'tarjeta' | 'transferencia'>('efectivo');

  const filteredRemissions = remissions.filter(r => {
    if (activeFilter === 'all') return true;
    return r.type === activeFilter;
  });

  const handleCreateRemission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName) return;

    let items = [];
    let total = 0;

    if (remType === 'producto') {
      const part = inventory.find(i => i.id === selectedPartId) || inventory[0];
      const qty = Number(itemQuantity) || 1;
      const sub = part.salePrice * qty;
      items.push({
        description: `${part.name} (${part.code})`,
        quantity: qty,
        unitPrice: part.salePrice,
        subtotal: sub,
      });
      total = sub;
      // Discount stock
      updateInventoryStock(part.id, -qty);
    } else {
      const prc = Number(customPrice) || 350;
      items.push({
        description: customDescription || 'Servicio de revisión y soldadura especializada',
        quantity: 1,
        unitPrice: prc,
        subtotal: prc,
      });
      total = prc;
    }

    const subtotal = total / 1.16;
    const tax = total - subtotal;

    const newNote = createRemissionNote({
      type: remType,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      customerId: `cli-${Date.now().toString().slice(-4)}`,
      customerName: custName,
      customerPhone: custPhone || '55 0000 0000',
      branchId,
      items,
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total,
      paymentMethod,
      notes: `Nota emitida en caja ${remType === 'producto' ? 'por venta de mostrador' : 'por servicio técnico'}.`,
    });

    alert(`Nota de remisión ${newNote.remissionNumber} generada con éxito.`);
    setShowNewModal(false);
    setSelectedNoteForPrint(newNote);
  };

  return (
    <div className="space-y-6 pb-24">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Emisión y Control de Notas de Remisión
          </h1>
          <p className="text-xs text-slate-500">
            Control fiscal y administrativo separado para <strong>Venta de Productos/Refacciones</strong> y <strong>Venta de Servicios</strong>.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nueva Nota de Remisión
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          Todas ({remissions.length})
        </button>
        <button
          onClick={() => setActiveFilter('producto')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeFilter === 'producto' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Venta Refacciones
        </button>
        <button
          onClick={() => setActiveFilter('servicio')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeFilter === 'servicio' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          Venta Servicios
        </button>
      </div>

      {/* Remissions Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Folio Remisión</th>
                <th className="py-3.5 px-3">Tipo</th>
                <th className="py-3.5 px-3">Fecha</th>
                <th className="py-3.5 px-3">Cliente</th>
                <th className="py-3.5 px-3">Concepto Principal</th>
                <th className="py-3.5 px-3">Método</th>
                <th className="py-3.5 px-4 text-right">Total</th>
                <th className="py-3.5 px-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRemissions.map(rem => (
                <tr key={rem.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {rem.remissionNumber}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      rem.type === 'producto' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                    }`}>
                      {rem.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{rem.date}</td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800 block">{rem.customerName}</span>
                    <span className="text-[10px] text-slate-400">{rem.customerPhone}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                    {rem.items[0]?.description}
                  </td>
                  <td className="py-3 px-3 capitalize text-slate-600 font-medium">{rem.paymentMethod}</td>
                  <td className="py-3 px-4 text-right font-mono font-extrabold text-slate-900">
                    ${rem.total.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => setSelectedNoteForPrint(rem)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-600 hover:bg-cyan-50"
                      title="Ver e imprimir nota"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE REMISSION MODAL */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <form onSubmit={handleCreateRemission} className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-base font-bold text-slate-900">Nueva Nota de Remisión</h3>
              <button type="button" onClick={() => setShowNewModal(false)}>✕</button>
            </div>

            {/* Type selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Remisión:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRemType('producto')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    remType === 'producto' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  Venta de Producto / Refacción
                </button>
                <button
                  type="button"
                  onClick={() => setRemType('servicio')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    remType === 'servicio' ? 'bg-sky-600 text-white border-sky-600' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  Venta de Servicio / Reparación
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre del Cliente *</label>
              <input
                type="text"
                required
                value={custName}
                onChange={e => setCustName(e.target.value)}
                placeholder="Cliente particular o técnico externo"
                className="w-full px-3 py-2 text-xs rounded-xl border"
              />
            </div>

            {remType === 'producto' ? (
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Refacción en Inventario</label>
                  <select
                    value={selectedPartId}
                    onChange={e => setSelectedPartId(e.target.value)}
                    className="w-full px-2 py-2 text-xs rounded-xl border bg-white"
                  >
                    {inventory.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} (${item.salePrice})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    value={itemQuantity}
                    onChange={e => setItemQuantity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción del Servicio</label>
                  <input
                    type="text"
                    value={customDescription}
                    onChange={e => setCustomDescription(e.target.value)}
                    placeholder="Diagnóstico en banco y cambio de sensor"
                    className="w-full px-3 py-2 text-xs rounded-xl border"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Precio Cobrado ($)</label>
                  <input
                    type="number"
                    value={customPrice}
                    onChange={e => setCustomPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border font-mono"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Método de Pago:</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border bg-white capitalize"
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta Débito/Crédito</option>
                <option value="transferencia">Transferencia SPEI</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md mt-2"
            >
              Emitir Nota y Generar Ticket
            </button>
          </form>
        </div>
      )}

      {/* PRINTABLE DIGITAL TICKET / REMISSION MODAL */}
      {selectedNoteForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl text-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-xs font-bold text-slate-500">Comprobante de Venta</span>
              <button onClick={() => setSelectedNoteForPrint(null)}>✕</button>
            </div>

            {/* Formal Ticket */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs space-y-2">
              <div className="text-center pb-2 border-b">
                <h4 className="font-extrabold text-sm text-slate-900">TARJETAS ELECTRÓNICAS</h4>
                <p className="text-[10px] text-slate-500">Laboratorio de Reparación y Refacciones</p>
                <p className="text-[10px] text-slate-400">RFC: TEL-241023-9K2 · Tel: 55 4192 8801</p>
                <p className="text-[11px] font-bold text-cyan-800 mt-1">{selectedNoteForPrint.remissionNumber}</p>
                <p className="text-[10px] text-slate-500">{selectedNoteForPrint.date}</p>
              </div>

              <div className="text-[11px] space-y-0.5">
                <p><strong>Cliente:</strong> {selectedNoteForPrint.customerName}</p>
                <p><strong>Tipo:</strong> {selectedNoteForPrint.type.toUpperCase()}</p>
                <p><strong>Pago:</strong> {selectedNoteForPrint.paymentMethod.toUpperCase()}</p>
              </div>

              <div className="border-t border-b py-2 space-y-1 text-[11px]">
                {selectedNoteForPrint.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.quantity}x {it.description}</span>
                    <span className="font-bold">${it.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-0.5 text-right text-[11px]">
                <p>Subtotal: ${selectedNoteForPrint.subtotal.toFixed(2)}</p>
                <p>IVA (16%): ${selectedNoteForPrint.tax.toFixed(2)}</p>
                <p className="text-sm font-extrabold text-slate-900">TOTAL: ${selectedNoteForPrint.total.toFixed(2)} MXN</p>
              </div>

              <p className="text-[9px] text-center text-slate-400 pt-2 border-t">
                ¡Gracias por su preferencia! Garantía sujeta a términos de servicio.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimir Ticket
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
