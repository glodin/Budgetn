import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency } from '../contexts/CurrencyContext';

interface TransactionItemProps {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  isRecurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurringEndDate?: string | null;
  isSwipeActive?: boolean;
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
  isRecurring,
  recurringType,
  recurringEndDate,
  onPress,
}: TransactionItemProps) {
  const { theme, isDarkMode } = useTheme();
  const { currency } = useCurrency();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const SWIPE_THRESHOLD = 5;

  const handleTouchStart = (event: GestureResponderEvent) => {
    touchStartX.current = event.nativeEvent.pageX;
  };

  const handleTouchEnd = (event: GestureResponderEvent) => {
    touchEndX.current = event.nativeEvent.pageX;
    const swipeDistance = Math.abs(touchEndX.current - touchStartX.current);
    
    if (swipeDistance < SWIPE_THRESHOLD && onPress) {
      onPress();
    }
  };

  const isIncome = amount > 0;
  const colorScheme = isIncome ? COLORS.income : COLORS.expense;
  const colors = isDarkMode ? colorScheme.dark : colorScheme.light;

  return (
    <Pressable
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
          <View style={styles.detailsContainer}>
            <Text style={[styles.category, { color: theme.text.secondary }]}>
              {category}
            </Text>
            {isRecurring && (
              <View style={[styles.recurringBadge, { backgroundColor: theme.primary + '15' }]}>
                <Ionicons 
                  name="repeat" 
                  size={12} 
                  color={theme.primary}
                  style={styles.recurringIcon}
                />
                <Text style={[styles.recurringText, { color: theme.primary }]}>
                  {recurringType?.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
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
    opacity: 0.8,
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
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  recurringIndicator: {
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: 8,
  backgroundColor: 'rgba(0,0,0,0.05)',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 12,
},
recurringEndDate: {
  fontSize: 12,
  marginLeft: 4,
  opacity: 0.8,
},
detailsContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},
recurringBadge: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 12,
  gap: 2,
},
recurringIcon: {
  marginRight: 2,
},
recurringText: {
  fontSize: 10,
  fontWeight: '600',
},
});