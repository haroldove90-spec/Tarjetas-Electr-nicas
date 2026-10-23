import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { UnifiedHeader } from './components/UnifiedHeader';
import { Navigation } from './components/Navigation';
import { WorkshopDashboard } from './components/WorkshopDashboard';
import { ReceptionModule } from './components/ReceptionModule';
import { TechnicianModule } from './components/TechnicianModule';
import { AdminModule } from './components/AdminModule';
import { RemissionNotesModule } from './components/RemissionNotesModule';
import { KanbanBoard } from './components/KanbanBoard';
import { CustomerModule } from './components/CustomerModule';
import { OrderDetailModal } from './components/OrderDetailModal';
import { RoleSelector } from './components/RoleSelector';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, showRoleSelector, setShowRoleSelector } = useApp();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full selection:bg-teal-500 selection:text-white">
      
      {/* 1. Cabecera Institucional Unificada (Logo, Rol, Instalar, Buscar, Salir) */}
      <UnifiedHeader />

      {/* 2. Main Full-Width Content Container */}
      <div className="flex-1 flex w-full">
        
        {/* Desktop Sidebar & Mobile Bottom Navigation */}
        <Navigation />

        {/* Dynamic Viewport Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 overflow-x-hidden">
          
          {/* Módulo Inicio / Panel del taller (Fiel a la muestra del usuario) */}
          {activeTab === 'inicio' && (
            <WorkshopDashboard
              onOpenOrderModal={(orderId) => setSelectedOrderId(orderId)}
              onNewReception={() => setActiveTab('recepcion')}
              onOpenKanban={() => setActiveTab('kanban')}
            />
          )}

          {/* Módulo Recepción / Mostrador */}
          {activeTab === 'recepcion' && (
            <ReceptionModule
              onOrderCreated={(orderId) => setSelectedOrderId(orderId)}
            />
          )}

          {/* Módulo Órdenes de Servicio */}
          {activeTab === 'ordenes' && (
            <WorkshopDashboard
              onOpenOrderModal={(orderId) => setSelectedOrderId(orderId)}
              onNewReception={() => setActiveTab('recepcion')}
              onOpenKanban={() => setActiveTab('kanban')}
            />
          )}

          {/* Módulo Tablero Kanban */}
          {activeTab === 'kanban' && (
            <KanbanBoard
              onOpenOrderModal={(orderId) => setSelectedOrderId(orderId)}
            />
          )}

          {/* Módulo Taller Técnico & Diagnóstico */}
          {activeTab === 'servicios' && (
            <TechnicianModule
              onOpenOrderModal={(orderId) => setSelectedOrderId(orderId)}
            />
          )}

          {/* Módulo Venta & Notas de Remisión */}
          {activeTab === 'venta' && (
            <RemissionNotesModule />
          )}

          {/* Módulo Clientes */}
          {activeTab === 'clientes' && (
            <CustomerModule
              onOpenOrderModal={(orderId) => setSelectedOrderId(orderId)}
            />
          )}

          {/* Módulo Más / Administración General (Finanzas, Nómina, Reasignación, Inventario) */}
          {(activeTab === 'mas' || 
            activeTab === 'finanzas' || 
            activeTab === 'comisiones' || 
            activeTab === 'inventario' || 
            activeTab === 'sucursales') && (
            <AdminModule />
          )}

        </main>

      </div>

      {/* Order Detail Modal */}
      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}

      {/* Role Selector Modal (Permite cambiar de rol en cualquier momento) */}
      {showRoleSelector && (
        <RoleSelector
          isModal={true}
          onClose={() => setShowRoleSelector(false)}
        />
      )}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
