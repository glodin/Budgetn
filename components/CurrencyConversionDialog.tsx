import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, Pressable } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface CurrencyConversionDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (rate: number) => void;
  fromCurrency: string;
  toCurrency: string;
}

export default function CurrencyConversionDialog({
  visible,
  onClose,
  onConfirm,
  fromCurrency,
  toCurrency,
}: CurrencyConversionDialogProps) {
  const { theme } = useTheme();
  const [rate, setRate] = useState('1');
  const [error, setError] = useState('');

const handleConfirm = () => {
  const conversionRate = parseFloat(rate);
  if (isNaN(conversionRate) || conversionRate <= 0) {
    setError('Please enter a valid positive number');
    return;
  }
  onConfirm(conversionRate);
  setError('');
};

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.surface }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text.primary }]}>
              Currency Conversion
            </Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.text.secondary} />
            </Pressable>
          </View>

          <Text style={[styles.description, { color: theme.text.secondary }]}>
            Please enter the conversion rate:
          </Text>

          <View style={styles.conversionContainer}>
            <View style={[styles.currencyBox, { backgroundColor: theme.background }]}>
              <Text style={[styles.currencyText, { color: theme.text.primary }]}>
                1 {fromCurrency}
              </Text>
            </View>
            
            <Ionicons 
              name="arrow-forward" 
              size={20} 
              color={theme.text.secondary}
              style={styles.arrow} 
            />
            
            <View style={[styles.inputContainer, { backgroundColor: theme.background }]}>
              <TextInput
                style={[styles.input, { color: theme.text.primary }]}
                value={rate}
                onChangeText={(text) => {
                  setRate(text);
                  setError('');
                }}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={theme.text.secondary}
              />
              <Text style={[styles.currencyLabel, { color: theme.text.primary }]}>
                {toCurrency}
              </Text>
            </View>
          </View>

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.cancelButton, { borderColor: theme.border }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: theme.text.primary }]}>
                Cancel
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.confirmButton, { backgroundColor: theme.primary }]}
              onPress={handleConfirm}
            >
              <Text style={[styles.buttonText, { color: '#fff' }]}>
                Confirm
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  conversionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  currencyBox: {
    padding: 12,
    borderRadius: 8,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '500',
  },
  arrow: {
    marginHorizontal: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  input: {
    fontSize: 16,
    minWidth: 80,
    textAlign: 'right',
    padding: 0,
  },
  currencyLabel: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 