import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency } from '../contexts/CurrencyContext';

interface TransactionItemProps {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  onPress?: () => void;
}

const COLORS = {
  income: {
    light: {
      icon: '#4CAF50',      // Green
      background: '#E8F5E9', // Light green background
      text: '#2E7D32'       // Darker green for text
    },
    dark: {
      icon: '#66BB6A',      // Lighter green for dark mode
      background: '#1B3320', // Dark green background
      text: '#81C784'       // Lighter green for text
    }
  },
  expense: {
    light: {
      icon: '#F44336',      // Red
      background: '#FFEBEE', // Light red background
      text: '#C62828'       // Darker red for text
    },
    dark: {
      icon: '#EF5350',      // Lighter red for dark mode
      background: '#321B1B', // Dark red background
      text: '#EF9A9A'       // Lighter red for text
    }
  }
};

export default function TransactionItem({
  title,
  amount,
  date,
  category,
  onPress,
}: TransactionItemProps) {
  const { theme, isDarkMode } = useTheme();
  const { currency } = useCurrency();

  const isIncome = amount > 0;
  const colorScheme = isIncome ? COLORS.income : COLORS.expense;
  const colors = isDarkMode ? colorScheme.dark : colorScheme.light;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.background,
          borderLeftWidth: 4,
          borderLeftColor: colors.icon,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          shadowColor: theme.shadowColor,
        }
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Transaction: ${title}, Amount: ${amount > 0 ? 'Income' : 'Expense'} ${currency.symbol}${Math.abs(amount)}, Category: ${category}, Date: ${date}`}
    >
      <View style={styles.leftContent}>
        <View style={[
          styles.iconContainer,
          {
            backgroundColor: isDarkMode ? theme.background : '#fff',
            shadowColor: theme.shadowColor,
          }
        ]}>
          <Ionicons 
            name={isIncome ? "arrow-up" : "arrow-down"} 
            size={20} 
            color={colors.icon}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[
            styles.title,
            { color: theme.text.primary }
          ]}>
            {title}
          </Text>
          <Text style={[
            styles.category,
            { color: theme.text.secondary }
          ]}>
            {category}
          </Text>
        </View>
      </View>
      
      <View style={styles.rightContent}>
        <Text style={[
          styles.amount,
          { color: colors.text }
        ]}>
          {isIncome ? '+' : '-'}{currency.symbol}{Math.abs(amount).toFixed(2)}
        </Text>
        <Text style={[
          styles.date,
          { color: theme.text.secondary }
        ]}>
          {new Date(date).toLocaleDateString()}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
  }
});