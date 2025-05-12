import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StockItem, StockMovement, Category, Unit } from '../types';
import { stockItems as initialStockItems, stockMovements as initialStockMovements, categories as initialCategories, units as initialUnits } from '../data/mockData';

interface AppContextProps {
  stockItems: StockItem[];
  stockMovements: StockMovement[];
  categories: Category[];
  units: Unit[];
  addStockItem: (item: Omit<StockItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateStockItem: (id: string, item: Partial<StockItem>) => void;
  deleteStockItem: (id: string) => void;
  addStockMovement: (movement: Omit<StockMovement, 'id' | 'stockItemName'>) => void;
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;
  addUnit: (name: string, abbreviation: string) => void;
  deleteUnit: (id: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [stockItems, setStockItems] = useState<StockItem[]>(initialStockItems);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(initialStockMovements);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [units, setUnits] = useState<Unit[]>(initialUnits);

  const addStockItem = (item: Omit<StockItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: StockItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setStockItems((prev) => [...prev, newItem]);
  };

  const updateStockItem = (id: string, item: Partial<StockItem>) => {
    setStockItems((prev) =>
      prev.map((stockItem) =>
        stockItem.id === id
          ? { ...stockItem, ...item, updatedAt: new Date() }
          : stockItem
      )
    );
  };

  const deleteStockItem = (id: string) => {
    setStockItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addStockMovement = (movement: Omit<StockMovement, 'id' | 'stockItemName'>) => {
    const stockItem = stockItems.find((item) => item.id === movement.stockItemId);
    
    if (!stockItem) return;
    
    const newMovement: StockMovement = {
      ...movement,
      id: Math.random().toString(36).substr(2, 9),
      stockItemName: stockItem.name,
    };
    
    setStockMovements((prev) => [...prev, newMovement]);
    
    // Update stock quantity
    const quantityChange = movement.type === 'in' ? movement.quantity : -movement.quantity;
    updateStockItem(movement.stockItemId, {
      quantity: stockItem.quantity + quantityChange,
    });
  };

  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name,
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
  };

  const addUnit = (name: string, abbreviation: string) => {
    const newUnit: Unit = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      abbreviation,
    };
    setUnits((prev) => [...prev, newUnit]);
  };

  const deleteUnit = (id: string) => {
    setUnits((prev) => prev.filter((unit) => unit.id !== id));
  };

  const value = {
    stockItems,
    stockMovements,
    categories,
    units,
    addStockItem,
    updateStockItem,
    deleteStockItem,
    addStockMovement,
    addCategory,
    deleteCategory,
    addUnit,
    deleteUnit,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};