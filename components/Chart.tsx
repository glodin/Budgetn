import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { VictoryPie, VictoryLabel } from 'victory-native';
import { useTransactions } from '../contexts/TransactionContext';
import { useTheme } from '../contexts/ThemeContext';

const screenWidth = Dimensions.get('window').width;

interface ChartData {
  name: string;
  amount: number;
  color: string;
}

export default function Chart() {
  const { transactions } = useTransactions();
  const { theme } = useTheme();
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null);

  const CHART_COLORS = {
    income: '#4CAF50',
    expenses: '#F44336'
  };

  // Calculate total income and expenses
  const totals = transactions.reduce(
    (acc, transaction) => {
      if (transaction.amount > 0) {
        acc.income += transaction.amount;
      } else {
        acc.expenses += Math.abs(transaction.amount);
      }
      return acc;
    },
    { income: 0, expenses: 0 }
  );

  // Calculate total for percentage
  const total = totals.income + totals.expenses;

  // Format data for the chart
  const data: ChartData[] = [
    { name: 'Income', amount: totals.income || 0.01, color: CHART_COLORS.income },
    { name: 'Expenses', amount: totals.expenses || 0.01, color: CHART_COLORS.expenses }
  ];

  const handleSlicePress = (name: string) => {
    setSelectedSlice(selectedSlice === name ? null : name);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.chartContainer}>
        <VictoryPie
          data={data}
          x="name"
          y="amount"
          width={screenWidth * 0.7}
          height={180}
          padding={40}
          innerRadius={35}
          labelRadius={({ innerRadius }) => (typeof innerRadius === 'number' ? innerRadius + 30 : 30)}
          cornerRadius={6}
          colorScale={Object.values(CHART_COLORS)}
          animate={{
            duration: 800,
            easing: "cubic"
          }}
          style={{
            labels: { 
              fill: theme.text.primary,
              fontSize: 14,
              fontWeight: 'bold'
            },
            data: {
              filter: `drop-shadow(0px 2px 4px ${theme.text.primary}15)`,
              opacity: ({ datum }) => selectedSlice ? (selectedSlice === datum.name ? 1 : 0.6) : 1,
            }
          }}
          labels={({ datum }) => {
            const percentage = ((datum.amount / total) * 100).toFixed(0);
            return `${percentage}%`;
          }}
          labelComponent={
            <VictoryLabel
              style={{
                fill: theme.text.primary,
                fontSize: 14,
                fontWeight: 'bold'
              }}
            />
          }
          events={[{
            target: "data",
            eventHandlers: {
              onPress: () => [{
                target: "data",
                mutation: (props) => handleSlicePress(props.datum.name)
              }]
            }
          }]}
        />
      </View>

      {/* Simplified Legend */}
      <View style={styles.legendContainer}>
        {data.map((item) => (
          <Pressable
            key={item.name}
            style={[
              styles.legendItem,
              selectedSlice === item.name && styles.legendItemSelected
            ]}
            onPress={() => handleSlicePress(item.name)}
          >
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={[styles.legendText, { color: theme.text.primary }]}>
              {item.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  chartContainer: {
    alignItems: 'center',
    paddingTop: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  legendItemSelected: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 