import { View, Text, StyleSheet, Pressable, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTransactions } from '../../contexts/TransactionContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import Chart from '../../components/Chart';
import TransactionItem from '../../components/TransactionItem';
import { useRouter } from 'expo-router';

export default function Home() {
  const { theme } = useTheme();
  const { transactions } = useTransactions();
  const { currency } = useCurrency();
  const router = useRouter();

  // Calculate totals
  const totals = transactions.reduce(
    (acc, transaction) => {
      if (transaction.amount > 0) {
        acc.income += transaction.amount;
      } else {
        acc.expenses += Math.abs(transaction.amount);
      }
      acc.balance = acc.income - acc.expenses;
      return acc;
    },
    { balance: 0, income: 0, expenses: 0 }
  );

  // Get recent transactions
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const handleAddTransaction = () => {
    router.push('/transactionForm');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]} 
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* Header Section */}
      <View style={[styles.header, { 
        backgroundColor: theme.primary,
        paddingTop: Platform.OS === 'ios' ? 60 : 24
      }]}>
        <Text style={[styles.greeting, { color: '#fff' }]}>Hello, User 👋</Text>
        <Text style={[styles.date, { color: 'rgba(255,255,255,0.8)' }]}>
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Text>
        <View style={styles.balanceContainer}>
          <Text style={[styles.balanceLabel, { color: 'rgba(255,255,255,0.8)' }]}>Current Balance</Text>
          <Text style={[styles.balanceAmount, { color: '#fff' }]}>
            {currency.symbol}{totals.balance.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: theme.surface, shadowColor: theme.shadow || '#000000' }]}>
          <Ionicons name="arrow-up-circle" size={28} color="#4CAF50" />
          <Text style={[styles.statLabel, { color: theme.text.secondary }]}>Income</Text>
          <Text style={[styles.statAmount, { color: theme.text.primary }]}>
            {currency.symbol}{totals.income.toFixed(2)}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.surface, shadowColor: theme.shadow || '#000000' }]}>
          <Ionicons name="arrow-down-circle" size={28} color="#F44336" />
          <Text style={[styles.statLabel, { color: theme.text.secondary }]}>Expenses</Text>
          <Text style={[styles.statAmount, { color: theme.text.primary }]}>
            {currency.symbol}{totals.expenses.toFixed(2)}
          </Text>
        </View>
      </View>

          {/* Chart Section */}
          <Chart /> 


      {/* Add Transaction Button */}
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        onPress={handleAddTransaction}
        activeOpacity={0.8}
      >
        <View style={styles.addButtonContent}>
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add Transaction</Text>
        </View>
      </TouchableOpacity>

      {/* Recent Transactions */}
      <View style={[styles.recentTransactions, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Recent Transactions</Text>
        {recentTransactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            {...transaction}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    marginBottom: 24,
  },
  balanceContainer: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: -30,
    paddingHorizontal: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statLabel: {
    fontSize: 14,
    marginTop: 8,
  },
  statAmount: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  chartCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  recentTransactions: {
    padding: 16,
    marginTop: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});