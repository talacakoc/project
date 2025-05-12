export interface StockItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  stockCode: string;
  quantity: number;
  criticalLevel: number;
  purchasePrice: number;
  salePrice: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockMovement {
  id: string;
  stockItemId: string;
  stockItemName: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  date: Date;
  performedBy: string;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Unit {
  id: string;
  name: string;
  abbreviation: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}