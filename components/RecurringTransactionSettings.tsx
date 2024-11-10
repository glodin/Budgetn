import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';

interface RecurringTransactionSettingsProps {
  isRecurring: boolean;
  recurringType: 'daily' | 'weekly' | 'monthly' | 'yearly' | undefined;
  recurringEndDate: string | undefined | null;
  onRecurringChange: (value: boolean) => void;
  onRecurringTypeChange: (type: 'daily' | 'weekly' | 'monthly' | 'yearly') => void;
  onEndDateChange: (date: string | null) => void;
}

const recurringOptions = [
  { id: 'daily', label: 'Daily', icon: 'calendar' },
  { id: 'weekly', label: 'Weekly', icon: 'calendar-outline' },
  { id: 'monthly', label: 'Monthly', icon: 'calendar-clear' },
  { id: 'yearly', label: 'Yearly', icon: 'calendar-number' },
];

export default function RecurringTransactionSettings({
  isRecurring,
  recurringType,
  recurringEndDate,
  onRecurringChange,
  onRecurringTypeChange,
  onEndDateChange,
}: RecurringTransactionSettingsProps) {
  const { theme } = useTheme();
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={[styles.switchContainer, { backgroundColor: theme.surface }]}>
        <Text style={[styles.label, { color: theme.text.primary }]}>
          Recurring Transaction
        </Text>
        <Pressable
          style={[
            styles.switch,
            { backgroundColor: isRecurring ? theme.primary : theme.border }
          ]}
          onPress={() => onRecurringChange(!isRecurring)}
        >
          <View style={[
            styles.switchKnob,
            { 
              backgroundColor: theme.surface,
              transform: [{ translateX: isRecurring ? 20 : 0 }]
            }
          ]} />
        </Pressable>
      </View>

      {isRecurring && (
        <>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.typeContainer}
          >
            {recurringOptions.map((option) => (
              <Pressable
                key={option.id}
                style={[
                  styles.typeOption,
                  { 
                    backgroundColor: recurringType === option.id 
                      ? theme.primary 
                      : theme.surface,
                    borderColor: theme.primary,
                  }
                ]}
                onPress={() => onRecurringTypeChange(option.id as any)}
              >
                <Ionicons 
                  name={option.icon as any} 
                  size={20} 
                  color={recurringType === option.id ? '#FFF' : theme.primary} 
                />
                <Text style={[
                  styles.typeText,
                  { 
                    color: recurringType === option.id 
                      ? '#FFF' 
                      : theme.text.primary 
                  }
                ]}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable
            style={[styles.endDateButton, { backgroundColor: theme.surface }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.label, { color: theme.text.primary }]}>
              End Date (Optional)
            </Text>
            <Text style={[styles.dateText, { color: theme.text.secondary }]}>
              {recurringEndDate 
                ? new Date(recurringEndDate).toLocaleDateString() 
                : 'No end date'}
            </Text>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={recurringEndDate ? new Date(recurringEndDate) : new Date()}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  onEndDateChange(selectedDate.toISOString().split('T')[0]);
                }
              }}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 5,
  },
  switchKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  typeContainer: {
    marginBottom: 16,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
  },
  typeText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  endDateButton: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
  },
}); 