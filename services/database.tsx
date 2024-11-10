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
  isRecurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurringEndDate?: string | null;
}

// Initialize database
export const initDatabase = async () => {
  try {
    // First create table if it doesn't exist
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        category TEXT NOT NULL,
        isRecurring INTEGER DEFAULT 0,
        recurringType TEXT,
        recurringEndDate TEXT
      );
    `);

    // Then check if we need to add new columns
    const tableInfo = await db.getAllAsync("PRAGMA table_info(transactions);");
    const columns = tableInfo.map((col: any) => col.name);
    
    if (!columns.includes('isRecurring')) {
      // Add new columns if they don't exist
      await db.execAsync(`ALTER TABLE transactions ADD COLUMN isRecurring INTEGER DEFAULT 0;`);
      await db.execAsync(`ALTER TABLE transactions ADD COLUMN recurringType TEXT;`);
      await db.execAsync(`ALTER TABLE transactions ADD COLUMN recurringEndDate TEXT;`);
    }

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
    const result = await db.getAllAsync<any>('SELECT * FROM transactions ORDER BY date DESC;');
    return result.map(row => ({
      id: row.id,
      title: row.title,
      amount: row.amount,
      date: row.date,
      category: row.category,
      isRecurring: row.isRecurring === 1,
      recurringType: row.recurringType,
      recurringEndDate: row.recurringEndDate
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<string> => {
  try {
    const id = Math.random().toString(36).substr(2, 9);
    await db.runAsync(
      `INSERT INTO transactions (
        id, 
        title, 
        amount, 
        date, 
        category,
        isRecurring,
        recurringType,
        recurringEndDate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        id,
        transaction.title,
        transaction.amount,
        transaction.date,
        transaction.category,
        transaction.isRecurring ? 1 : 0,
        transaction.recurringType || null,
        transaction.recurringEndDate || null
      ]
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
      `UPDATE transactions 
       SET title = ?, 
           amount = ?, 
           date = ?, 
           category = ?,
           isRecurring = ?,
           recurringType = ?,
           recurringEndDate = ?
       WHERE id = ?;`,
      [
        transaction.title,
        transaction.amount,
        transaction.date,
        transaction.category,
        transaction.isRecurring ? 1 : 0,
        transaction.recurringType || null,
        transaction.recurringEndDate || null,
        transaction.id
      ]
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

// Add this export at the top of the file, after the imports
export const getDatabase = () => db;