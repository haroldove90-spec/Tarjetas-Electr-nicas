export type Role = 'admin' | 'reception' | 'technician';

export interface Branch {
  id: string;
  name: string;
  type: 'principal' | 'sucursal' | 'tienda_movil';
  address: string;
  phone: string;
}

export interface Technician {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  phone: string;
  defaultCommissionRate: number; // e.g. 15%
  active: boolean;
  baseSalaryWeekly: number;
}

export type OrderStatus = 
  | 'recibido'               // Recién ingresado por mostrador
  | 'diagnostico'            // En revisión técnica en banco de trabajo
  | 'espera_refacciones'     // Pausado por falta de componentes
  | 'en_reparacion'          // Soldadura, micro-electrónica en proceso
  | 'reparado'               // Terminado y listo para entrega
  | 'cerrado'                // Entregado al cliente y cobrado (Solo Recepción/Admin)
  | 'no_reparable';          // Descartado con diagnóstico

export type ApplianceType = 
  | 'Inverter / Aire Acondicionado'
  | 'Lavadora Digital / Carga Frontal'
  | 'Refrigerador Inverter / Smart'
  | 'Horno Microondas'
  | 'Secadora de Ropa'
  | 'Tarjeta Fuente Conmutada Industrial'
  | 'Módulo Electrónico General';

export interface RepairOrder {
  id: string; // e.g. ORD-1048
  folioNumber: number;
  customerId: string;
  customerName: string;
  customerPhone: string;
  branchId: string;
  branchName: string;
  technicianId: string;
  technicianName: string;
  
  // Equipment details
  applianceType: ApplianceType;
  brand: string;
  model: string;
  serialNumber?: string;
  accessories: string; // "Con display y arnés de sensores"
  
  // Symptoms & Diagnostics
  reportedFailure: string; // Lo que dice el cliente
  physicalCondition: string; // Rayones, sulfatado, pistas rotas
  photoUrl?: string;
  
  // Technical section
  status: OrderStatus;
  technicalDiagnosis?: string;
  componentsUsed?: string;
  internalNotes?: string;
  
  // Financials
  estimatedCost: number;
  finalRepairCost: number;
  advancePayment: number;
  remainingBalance: number;
  isPaid: boolean;
  paymentMethod?: 'efectivo' | 'tarjeta' | 'transferencia';
  
  // Commissions
  commissionPercentage: number; // e.g. 15%
  commissionAmount: number; // e.g. $180
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryDate?: string;
  completedAt?: string;
  closedAt?: string;
  closedBy?: string; // Nombre del usuario que cerró
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: 'Semiconductores' | 'Capacitores' | 'Relevadores' | 'Fuentes/Transformadores' | 'Módulos IPM' | 'Microcontroladores';
  stock: number;
  minStock: number;
  costPrice: number;
  salePrice: number;
  imageUrl: string;
  location: string; // Estante A-3, Cajón 12
  isPendingOrder?: boolean;
}

export type RemissionType = 'producto' | 'servicio';

export interface RemissionNote {
  id: string;
  remissionNumber: string;
  type: RemissionType;
  date: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  branchId: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  subtotal: number;
  tax: number; // IVA 16%
  total: number;
  paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia';
  linkedOrderId?: string;
  notes?: string;
}

export interface CashCut {
  id: string;
  date: string;
  branchId: string;
  branchName: string;
  totalServiceSales: number;
  totalProductSales: number;
  totalCash: number;
  totalCard: number;
  totalTransfer: number;
  totalGeneral: number;
  ordersDeliveredCount: number;
  productsSoldCount: number;
}
