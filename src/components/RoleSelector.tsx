import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { ShieldCheck, UserCheck, Wrench, Download, Check, Sparkles, Smartphone } from 'lucide-react';
import { Role } from '../types';

interface RoleSelectorProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ isModal = false, onClose }) => {
  const { role, setRole, selectedTechnicianId, technicians } = useApp();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [selectedTech, setSelectedTech] = useState(selectedTechnicianId);

  const handleSelectRole = (newRole: Role, techId?: string) => {
    setRole(newRole, techId || selectedTech);
    if (onClose) onClose();
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }
    await install();
  };

  return (
    <div className={`w-full ${isModal ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm' : 'min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4 sm:p-8'}`}>
      <div className={`w-full ${isModal ? 'bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-4xl shadow-2xl relative' : 'max-w-5xl mx-auto'}`}>
        
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
            title="Cerrar"
          >
            ✕
          </button>
        )}

        {/* Central Logo & Brand Identification */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-sky-500 via-teal-400 to-emerald-400 p-0.5 shadow-xl shadow-cyan-500/20 mb-3">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center overflow-hidden">
              <img src="/icon.svg" alt="Tarjetas Electrónicas" className="w-16 h-16 object-contain" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white text-center">
            Tarjetas Electrónicas
          </h1>
          <p className="text-xs sm:text-sm text-cyan-400 font-medium tracking-wide mt-1">
            Sistema de Gestión Integral de Taller
          </p>
        </div>

        {/* 2 Column Mobile / 4 Column Desktop Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          
          {/* ROL 1: Administrador */}
          <button
            onClick={() => handleSelectRole('admin')}
            className={`group relative flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl border transition-all text-center ${
              role === 'admin'
                ? 'bg-sky-950/50 border-sky-400 shadow-lg shadow-sky-500/20 ring-2 ring-sky-400/40'
                : 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800 hover:border-slate-500'
            }`}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <span className="text-sm sm:text-base font-bold text-white tracking-tight">
              Administrador
            </span>
            {role === 'admin' && (
              <span className="mt-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500 text-slate-950">
                Activo
              </span>
            )}
          </button>

          {/* ROL 2: Recepción / Mostrador */}
          <button
            onClick={() => handleSelectRole('reception')}
            className={`group relative flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl border transition-all text-center ${
              role === 'reception'
                ? 'bg-emerald-950/50 border-emerald-400 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/40'
                : 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800 hover:border-slate-500'
            }`}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-105 transition-transform">
              <UserCheck className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <span className="text-sm sm:text-base font-bold text-white tracking-tight">
              Recepción
            </span>
            {role === 'reception' && (
              <span className="mt-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                Activo
              </span>
            )}
          </button>

          {/* ROL 3: Técnico Carlos M. (Inverter & Refrigeración) */}
          <button
            onClick={() => handleSelectRole('technician', 'tech-1')}
            className={`group relative flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl border transition-all text-center ${
              role === 'technician' && selectedTechnicianId === 'tech-1'
                ? 'bg-amber-950/50 border-amber-400 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/40'
                : 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800 hover:border-slate-500'
            }`}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-105 transition-transform">
              <Wrench className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <span className="text-sm sm:text-base font-bold text-white tracking-tight truncate w-full">
              Técnico Carlos
            </span>
            {role === 'technician' && selectedTechnicianId === 'tech-1' && (
              <span className="mt-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                Activo
              </span>
            )}
          </button>

          {/* ROL 4: Técnico Roberto G. (Lavadoras / Tarjetas) */}
          <button
            onClick={() => handleSelectRole('technician', 'tech-2')}
            className={`group relative flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl border transition-all text-center ${
              role === 'technician' && selectedTechnicianId === 'tech-2'
                ? 'bg-purple-950/50 border-purple-400 shadow-lg shadow-purple-500/20 ring-2 ring-purple-400/40'
                : 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800 hover:border-slate-500'
            }`}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-105 transition-transform">
              <Wrench className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <span className="text-sm sm:text-base font-bold text-white tracking-tight truncate w-full">
              Técnico Roberto
            </span>
            {role === 'technician' && selectedTechnicianId === 'tech-2' && (
              <span className="mt-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-400 text-slate-950">
                Activo
              </span>
            )}
          </button>

        </div>

        {/* Selector de técnico específico si se desea David o Luis */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs text-slate-400">
          <span className="text-slate-400 font-medium">Otros técnicos activos:</span>
          {technicians.filter(t => t.id === 'tech-3' || t.id === 'tech-4').map(tech => (
            <button
              key={tech.id}
              onClick={() => handleSelectRole('technician', tech.id)}
              className={`px-3 py-1 rounded-lg border text-xs transition-colors ${
                role === 'technician' && selectedTechnicianId === tech.id
                  ? 'border-cyan-400 bg-cyan-950 text-cyan-200'
                  : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tech.name} ({tech.specialty.split(' ')[0]})
            </button>
          ))}
        </div>

        {/* Botón Prominente para Instalar la App */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleInstallClick}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 hover:from-teal-400 hover:to-cyan-400 transition-all active:scale-95"
          >
            <Download className="w-5 h-5 text-slate-950" />
            <span>Instalar Aplicación (PWA)</span>
          </button>
        </div>

      </div>

      {/* iOS Safari Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 text-white shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold">Instalar en iPhone / iPad</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Para instalar <strong className="text-white">Tarjetas Electrónicas</strong> en tu dispositivo Apple:
            </p>
            <ol className="text-xs text-slate-300 space-y-2 mb-6 list-decimal pl-4">
              <li>Toca el botón <strong>Compartir</strong> <span className="text-cyan-400">⎋</span> en la barra inferior de Safari.</li>
              <li>Desliza hacia abajo y selecciona <strong>Agregar al inicio</strong> <span className="text-cyan-400">⊕</span>.</li>
              <li>Confirma pulsando <strong>Agregar</strong> en la esquina superior derecha.</li>
            </ol>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
