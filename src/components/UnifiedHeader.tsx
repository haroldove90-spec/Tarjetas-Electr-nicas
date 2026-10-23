import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { 
  Search, 
  Camera, 
  Download, 
  LogOut, 
  ShieldCheck, 
  UserCheck, 
  Wrench, 
  MapPin, 
  Smartphone,
  Menu,
  X
} from 'lucide-react';

interface UnifiedHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({ 
  onToggleSidebar,
  isSidebarOpen 
}) => {
  const { 
    role, 
    selectedTechnicianId, 
    technicians, 
    branches, 
    activeBranchId, 
    setActiveBranchId,
    searchQuery, 
    setSearchQuery,
    setShowRoleSelector,
    setActiveTab
  } = useApp();

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);

  // Active user name and label
  const activeTech = technicians.find(t => t.id === selectedTechnicianId);
  const currentRoleName = role === 'admin' 
    ? 'Administrador' 
    : role === 'reception' 
      ? 'Recepción' 
      : activeTech ? activeTech.name.split(' ')[0] : 'Técnico';

  const roleSubtitle = role === 'admin'
    ? 'Dueño del Taller'
    : role === 'reception'
      ? 'Mostrador Principal'
      : activeTech?.specialty || 'Área de Reparación';

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }
    await install();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#1c2838] text-white shadow-md border-b border-slate-700/60 select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Sidebar toggle (Desktop/Tablet) + Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700/60 active:scale-95 transition-all"
              aria-label="Abrir menú"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div 
            onClick={() => setActiveTab('inicio')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            {/* White rounded badge holding the vector workshop logo as seen in sample */}
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              <img src="/icon.svg" alt="Tarjetas Electrónicas Logo" className="w-8 h-8 object-contain" />
            </div>
            
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white leading-tight">
                Tarjetas Electrónicas
              </span>
              <span className="text-[10px] text-cyan-400 font-medium">
                Laboratorio de Reparación
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search input bar (Matching screenshot style) */}
        <div className="flex-1 max-w-lg mx-1 sm:mx-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Orden, cliente, teléfono, modelo..."
              className="w-full bg-[#2a3b4f] text-slate-100 placeholder-slate-400 text-xs sm:text-sm pl-9 pr-8 py-2 rounded-xl border border-slate-600/60 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right slot: Camera Scanner + Branch Filter + Role Badge + Install + Switch */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Quick Camera / Barcode scan */}
          <button
            onClick={() => setShowScannerModal(true)}
            title="Escanear orden o refacción"
            className="p-2 rounded-xl bg-[#2a3b4f] hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-600/50 transition-colors shrink-0"
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* Branch selector if admin */}
          {role === 'admin' && (
            <div className="hidden xl:flex items-center">
              <select
                value={activeBranchId}
                onChange={(e) => setActiveBranchId(e.target.value)}
                className="bg-[#2a3b4f] text-slate-200 text-xs py-1.5 px-2.5 rounded-xl border border-slate-600/60 focus:outline-none focus:border-cyan-400"
              >
                <option value="all">Todas las sucursales</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Quick PWA Install Button */}
          {!isInstalled && (
            <button
              onClick={handleInstall}
              title="Instalar en este dispositivo"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs transition-colors shrink-0 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Instalar</span>
            </button>
          )}

          {/* Role badge & Switcher */}
          <button
            onClick={() => setShowRoleSelector(true)}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#2a3b4f] hover:bg-slate-700 border border-slate-600/60 transition-colors group"
            title="Cambiar de rol / perfil"
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
              {role === 'admin' && <ShieldCheck className="w-4 h-4 text-sky-400" />}
              {role === 'reception' && <UserCheck className="w-4 h-4 text-emerald-400" />}
              {role === 'technician' && <Wrench className="w-4 h-4 text-amber-400" />}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-white leading-none">
                {currentRoleName}
              </span>
              <span className="text-[10px] text-slate-300 truncate max-w-[100px]">
                {roleSubtitle}
              </span>
            </div>
            <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-white ml-0.5" />
          </button>

        </div>

      </div>

      {/* Simulated Scanner / Camera Modal */}
      {showScannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold">Lector Óptico de Órdenes</h3>
              </div>
              <button 
                onClick={() => setShowScannerModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            {/* Camera Viewfinder */}
            <div className="w-full h-44 rounded-xl bg-slate-950 border-2 border-dashed border-cyan-400/50 flex flex-col items-center justify-center p-4 relative overflow-hidden mb-4">
              <div className="w-36 h-28 border-2 border-cyan-400 rounded-lg relative flex items-center justify-center">
                <div className="w-full h-0.5 bg-cyan-400 absolute animate-pulse"></div>
                <span className="text-[10px] text-cyan-300 font-mono">Enfocar código QR / Folio</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 text-center mb-4">
              Escanea el código de barras o QR de la nota de remisión para abrir la orden al instante.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setSearchQuery('ORD-1048');
                  setShowScannerModal(false);
                }}
                className="py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
              >
                Simular #1048
              </button>
              <button
                onClick={() => {
                  setSearchQuery('ORD-1047');
                  setShowScannerModal(false);
                }}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Simular #1047
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Install Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 text-white shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Smartphone className="w-6 h-6 text-cyan-400" />
              <h3 className="text-base font-bold">Instalar en iOS / Safari</h3>
            </div>
            <ol className="text-xs text-slate-300 space-y-2 mb-6 list-decimal pl-4">
              <li>Pulsa el botón <strong>Compartir</strong> en la barra inferior de Safari.</li>
              <li>Toca <strong>Agregar a la pantalla de inicio</strong>.</li>
              <li>Presiona <strong>Agregar</strong> en la esquina superior.</li>
            </ol>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-white text-xs font-semibold"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
