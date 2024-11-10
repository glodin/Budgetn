import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, TextInput } from 'react-native';
import CurrencyConversionDialog from '../components/CurrencyConversionDialog';
import { getDatabase } from '../services/database';
import { useTransactions } from './TransactionContext';

interface CurrencyContextType {
  currency: { symbol: string; code: string };
  setCurrency: (currency: { symbol: string; code: string }) => Promise<void>;
  conversionRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const currencies = [
  { symbol: '$', code: 'USD' },   // US Dollar
  { symbol: '€', code: 'EUR' },   // Euro
  { symbol: '£', code: 'GBP' },   // British Pound
  { symbol: '¥', code: 'JPY' },   // Japanese Yen
  { symbol: '$', code: 'CAD' },   // Canadian Dollar
  { symbol: '$', code: 'AUD' },   // Australian Dollar
  { symbol: 'Fr', code: 'CHF' },  // Swiss Franc
  { symbol: '¥', code: 'CNY' },   // Chinese Yuan
  { symbol: '₹', code: 'INR' },   // Indian Rupee
  { symbol: '₩', code: 'KRW' },   // South Korean Won
  { symbol: '$', code: 'NZD' },   // New Zealand Dollar
  { symbol: 'kr', code: 'SEK' },  // Swedish Krona
  { symbol: '$', code: 'SGD' },   // Singapore Dollar
  { symbol: '฿', code: 'THB' },   // Thai Baht
  { symbol: '₺', code: 'TRY' },   // Turkish Lira
  { symbol: 'R', code: 'ZAR' },   // South African Rand
  { symbol: '₽', code: 'RUB' },   // Russian Ruble
  { symbol: 'R$', code: 'BRL' },  // Brazilian Real
  { symbol: '$', code: 'HKD' },   // Hong Kong Dollar
  { symbol: '$', code: 'MXN' },   // Mexican Peso
  { symbol: 'kr', code: 'NOK' },  // Norwegian Krone
  { symbol: 'kr', code: 'DKK' },  // Danish Krone
  { symbol: 'zł', code: 'PLN' },  // Polish Złoty
  { symbol: '₱', code: 'PHP' },   // Philippine Peso
  { symbol: 'Dh', code: 'AED' },  // UAE Dirham
  { symbol: '₪', code: 'ILS' },   // Israeli Shekel
  { symbol: 'Kč', code: 'CZK' },  // Czech Koruna
  { symbol: 'Ft', code: 'HUF' },  // Hungarian Forint
  { symbol: 'RM', code: 'MYR' },  // Malaysian Ringgit
  { symbol: '$', code: 'TWD' },   // Taiwan Dollar
  { symbol: '₡', code: 'CRC' },   // Costa Rican Colón
  { symbol: 'S/', code: 'PEN' },  // Peruvian Sol
  { symbol: '$', code: 'CLP' },   // Chilean Peso
  { symbol: '$', code: 'ARS' },   // Argentine Peso
  { symbol: '₦', code: 'NGN' },   // Nigerian Naira
  { symbol: '₸', code: 'KZT' },   // Kazakhstani Tenge
  { symbol: '₴', code: 'UAH' },   // Ukrainian Hryvnia
  { symbol: '₫', code: 'VND' },   // Vietnamese Dong
  { symbol: 'Rp', code: 'IDR' },  // Indonesian Rupiah
  { symbol: '₡', code: 'CRC' },   // Costa Rican Colón
];

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState({ symbol: '$', code: 'USD' });
  const [conversionRate, setConversionRate] = useState(1);
  const [showConversionDialog, setShowConversionDialog] = useState(false);
  const [pendingCurrency, setPendingCurrency] = useState<{ symbol: string; code: string } | null>(null);
  const { refreshTransactions } = useTransactions();

  useEffect(() => {
    loadSavedCurrency();
  }, []);

  const loadSavedCurrency = async () => {
    try {
      const savedCurrency = await AsyncStorage.getItem('currency');
      const savedRate = await AsyncStorage.getItem('conversionRate');
      if (savedCurrency) {
        setCurrencyState(JSON.parse(savedCurrency));
      }
      if (savedRate) {
        setConversionRate(parseFloat(savedRate));
      }
    } catch (error) {
      console.error('Error loading currency:', error);
    }
  };

  const setCurrency = async (newCurrency: { symbol: string; code: string }) => {
    if (currency.code === newCurrency.code) return;
    setPendingCurrency(newCurrency);
    setShowConversionDialog(true);
  };

  const handleConversionConfirm = async (rate: number) => {
    if (!pendingCurrency) return;
    
    try {
      await AsyncStorage.setItem('currency', JSON.stringify(pendingCurrency));
      await AsyncStorage.setItem('conversionRate', rate.toString());
      
      await convertExistingTransactions(rate, conversionRate);
      
      setCurrencyState(pendingCurrency);
      setConversionRate(rate);
      await refreshTransactions();
    } catch (error) {
      console.error('Error saving currency:', error);
      Alert.alert('Error', 'Failed to save currency settings');
    } finally {
      setShowConversionDialog(false);
      setPendingCurrency(null);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, conversionRate }}>
      {children}
      <CurrencyConversionDialog
        visible={showConversionDialog}
        onClose={() => {
          setShowConversionDialog(false);
          setPendingCurrency(null);
        }}
        onConfirm={handleConversionConfirm}
        fromCurrency={currency.code}
        toCurrency={pendingCurrency?.code || ''}
      />
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface Transaction {
  id: number;
  amount: number;
}

async function convertExistingTransactions(newRate: number, oldRate: number) {
  try {
    const db = getDatabase();
    const transactions = await db.getAllAsync('SELECT * FROM transactions') as Transaction[];
    
    for (const transaction of transactions) {
      const newAmount = transaction.amount * newRate;
      
      await db.runAsync(
        'UPDATE transactions SET amount = ? WHERE id = ?',
        [newAmount, transaction.id]
      );
    }
  } catch (error) {
    console.error('Error converting transactions:', error);
    Alert.alert('Error', 'Failed to convert transactions');
    throw error;
  }
}