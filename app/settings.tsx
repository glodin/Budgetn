import React, { useState, useEffect, useContext, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, TextInput, View, StyleSheet, Pressable, ScrollView, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { currencies } from '../contexts/CurrencyContext';

export default function Settings() {
  const { currency, setCurrency } = useCurrency();
  const { theme } = useTheme();

  const handleCurrencyChange = async (newCurrency: { symbol: string; code: string }) => {
    try {
      await setCurrency(newCurrency);
      // The conversion alert and process will be handled by the context
    } catch (error) {
      Alert.alert('Error', 'Failed to change currency');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* ... other settings ... */}
      
      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
          Currency
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.currencyList}
        >
          {currencies.map((curr) => (
            <Pressable
              key={curr.code}
              style={[
                styles.currencyChip,
                { 
                  backgroundColor: currency.code === curr.code ? theme.primary : theme.surface,
                  borderColor: theme.border
                }
              ]}
              onPress={() => handleCurrencyChange(curr)}
            >
              <Text style={[
                styles.currencyText,
                { color: currency.code === curr.code ? '#fff' : theme.text.primary }
              ]}>
                {curr.symbol} {curr.code}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  currencyList: {
    paddingVertical: 8,
  },
  currencyChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 