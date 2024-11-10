import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initDatabase, getTransactions, addTransaction, updateTransaction, deleteTransaction, Transaction } from '../services/database';

interface TransactionContextType {
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      await initDatabase();
      await refreshTransactions();
    } catch (error) {
      console.error('Error initializing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error refreshing transactions:', error);
    }
  };

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      await addTransaction(transaction);
      await refreshTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const handleUpdateTransaction = async (transaction: Transaction) => {
    try {
      await updateTransaction(transaction);
      await refreshTransactions();
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      await refreshTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  return (
    <TransactionContext.Provider value={{
      transactions,
      isLoading,
      addTransaction: handleAddTransaction,
      updateTransaction: handleUpdateTransaction,
      deleteTransaction: handleDeleteTransaction,
      refreshTransactions,
    }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
} 