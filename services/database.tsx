import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

// Open/create the database
const db = SQLite.openDatabaseSync('budgetn.db');

// Types
export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
}

// Initialize database
export const initDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        category TEXT NOT NULL
      );
    `);
    console.log('Database initialized');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// CRUD Operations
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const result = await db.getAllAsync<Transaction>('SELECT * FROM transactions ORDER BY date DESC;');
    return result;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<string> => {
  const id = Math.random().toString(36).substr(2, 9);
  try {
    await db.runAsync(
      'INSERT INTO transactions (id, title, amount, date, category) VALUES (?, ?, ?, ?, ?);',
      [id, transaction.title, transaction.amount, transaction.date, transaction.category]
    );
    return id;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

export const updateTransaction = async (transaction: Transaction): Promise<void> => {
  try {
    await db.runAsync(
      'UPDATE transactions SET title = ?, amount = ?, date = ?, category = ? WHERE id = ?;',
      [transaction.title, transaction.amount, transaction.date, transaction.category, transaction.id]
    );
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    await db.runAsync('DELETE FROM transactions WHERE id = ?;', [id]);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
}; 