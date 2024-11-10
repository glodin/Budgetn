import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { useTransactions } from '../contexts/TransactionContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const expenseCategories = [
  'Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Other'
];

const incomeCategories = [
  'Salary', 'Freelance', 'Investment', 'Gift', 'Other'
];

const TRANSACTION_COLORS = {
  expense: {
    active: '#FF3B30',    // Brighter red for expense
    inactive: '#FFF1F0',  // Softer light red background
    text: {
      active: '#FFFFFF',
      inactive: '#FF3B30'
    },
    gradient: ['#FF3B30', '#FF6B6B']
  },
  income: {
    active: '#34C759',    // Brighter green for income
    inactive: '#F0FFF4',  // Softer light green background
    text: {
      active: '#FFFFFF',
      inactive: '#34C759'
    },
    gradient: ['#34C759', '#4CD964']
  }
};

export default function TransactionForm() {
  const router = useRouter();
  const { theme } = useTheme();
  const { addTransaction, updateTransaction, deleteTransaction, transactions } = useTransactions();
  const params = useLocalSearchParams<{ transactionId?: string }>();

  const existingTransaction = params.transactionId 
    ? transactions.find(t => t.id === params.transactionId)
    : null;

  const [title, setTitle] = useState(existingTransaction?.title || '');
  const [amount, setAmount] = useState(existingTransaction ? Math.abs(existingTransaction.amount).toString() : '');
  const [category, setCategory] = useState(existingTransaction?.category || 'Other');
  const [date, setDate] = useState(existingTransaction ? new Date(existingTransaction.date) : new Date());
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>(
    existingTransaction ? (existingTransaction.amount < 0 ? 'expense' : 'income') : 'expense'
  );

  const isEditMode = !!params.transactionId;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!amount.trim()) newErrors.amount = 'Amount is required';
    if (isNaN(parseFloat(amount))) newErrors.amount = 'Amount must be a valid number';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const transactionData = {
        title,
        amount: transactionType === 'expense' ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount)),
        category,
        date: date.toISOString().split('T')[0],
        type: transactionType,
      };

      if (isEditMode && params.transactionId) {
        await updateTransaction({ ...transactionData, id: params.transactionId });
      } else {
        await addTransaction(transactionData);
      }
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save transaction. Please try again.');
      console.error('Error saving transaction:', error);
    }
  };

  const handleDelete = async () => {
    if (params.transactionId) {
      await deleteTransaction(params.transactionId);
      router.back();
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.form}>
        <View style={styles.typeSelector}>
          <Pressable
            style={[
              styles.typeButton,
              { 
                backgroundColor: transactionType === 'expense' 
                  ? TRANSACTION_COLORS.expense.active 
                  : TRANSACTION_COLORS.expense.inactive,
                borderWidth: transactionType === 'expense' ? 0 : 1,
                transform: [{ scale: transactionType === 'expense' ? 1 : 0.95 }]
              }
            ]}
            onPress={() => setTransactionType('expense')}
          >
            <View style={styles.typeContent}>
              <Ionicons 
                name="arrow-down-circle" 
                size={32}  // Increased size
                color={transactionType === 'expense' 
                  ? TRANSACTION_COLORS.expense.text.active 
                  : TRANSACTION_COLORS.expense.text.inactive
                } 
              />
              <Text style={[
                styles.typeText,
                { 
                  color: transactionType === 'expense' 
                    ? TRANSACTION_COLORS.expense.text.active 
                    : TRANSACTION_COLORS.expense.text.inactive,
                  fontWeight: transactionType === 'expense' ? '700' : '500'
                }
              ]}>
                Expense
              </Text>
            </View>
          </Pressable>
          
          <Pressable
            style={[
              styles.typeButton,
              { 
                backgroundColor: transactionType === 'income' 
                  ? TRANSACTION_COLORS.income.active 
                  : TRANSACTION_COLORS.income.inactive,
                borderColor: transactionType === 'income' 
                  ? TRANSACTION_COLORS.income.active 
                  : theme.border,
                transform: [{ scale: transactionType === 'income' ? 1 : 0.98 }]
              }
            ]}
            onPress={() => setTransactionType('income')}
          >
            <Ionicons 
              name="arrow-up-circle" 
              size={24} 
              color={transactionType === 'income' 
                ? TRANSACTION_COLORS.income.text.active 
                : TRANSACTION_COLORS.income.text.inactive
              } 
              style={styles.typeIcon}
            />
            <Text style={[
              styles.typeText,
              { 
                color: transactionType === 'income' 
                  ? TRANSACTION_COLORS.income.text.active 
                  : TRANSACTION_COLORS.income.text.inactive,
                fontWeight: transactionType === 'income' ? '600' : '400'
              }
            ]}>
              Income
            </Text>
          </Pressable>
        </View>

        <View style={[
          styles.inputContainer,
          { 
            backgroundColor: theme.surface,
            borderColor: transactionType === 'expense' 
              ? TRANSACTION_COLORS.expense.active 
              : TRANSACTION_COLORS.income.active,
          }
        ]}>
          <TextInput
            style={[styles.amountInput, { color: theme.text.primary }]}
            placeholder="0.00"
            placeholderTextColor={theme.text.secondary}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
          <TextInput
            style={[styles.titleInput, { color: theme.text.primary }]}
            placeholder="Transaction Title"
            placeholderTextColor={theme.text.secondary}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <Pressable
          style={[styles.input, { 
            borderColor: theme.border,
            backgroundColor: theme.surface
          }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: theme.text.primary }}>
            {date.toLocaleDateString()}
          </Text>
        </Pressable>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}

        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Categories</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {(transactionType === 'expense' ? expenseCategories : incomeCategories).map((cat) => (
            <Pressable
              key={cat}
              style={[
                styles.categoryChip,
                { 
                  backgroundColor: category === cat ? theme.primary : theme.surface,
                  borderColor: theme.border
                }
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text style={{ 
                color: category === cat ? '#fff' : theme.text.primary 
              }}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Pressable 
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>
            {isEditMode ? 'Update' : 'Add'} Transaction
          </Text>
        </Pressable>

        {isEditMode && (
          <Pressable 
            style={[styles.button, { backgroundColor: '#F44336', marginTop: 12 }]}
            onPress={handleDelete}
          >
            <Text style={styles.buttonText}>Delete Transaction</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
  },
  button: {
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 16,
    paddingHorizontal: 8,
  },
  typeButton: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  typeContent: {
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 4,
  },
  typeIcon: {
    marginRight: 8,
  },
  typeText: {
    fontSize: 18,
    fontWeight: '600',
  },
  inputContainer: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#FFF',
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  titleInput: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 