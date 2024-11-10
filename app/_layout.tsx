import { Stack } from 'expo-router';
import { ThemeProvider } from '../contexts/ThemeContext';
import { TransactionProvider } from '../contexts/TransactionContext';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../contexts/ThemeContext';
import { CurrencyProvider } from '../contexts/CurrencyContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

function RootLayoutNav() {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar style={theme.statusBar as 'light' | 'dark'} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="transactionForm" 
          options={({ route }: any) => ({ 
            presentation: 'modal',
            title: route.params?.transactionId ? 'Edit Transaction' : 'Add Transaction',
            headerStyle: {
              backgroundColor: theme.surface,
            },
            headerTintColor: theme.text.primary,
          })} 
        />
        <Stack.Screen 
          name="policyModal" 
          options={({ route }: any) => ({ 
            presentation: 'modal',
            title: route.params?.type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions',
            headerStyle: {
              backgroundColor: theme.surface,
            },
            headerTintColor: theme.text.primary,
          })} 
        />
        <Stack.Screen 
          name="currencySelect" 
          options={{ 
            presentation: 'modal',
            title: 'Select Currency',
            headerStyle: {
              backgroundColor: theme.surface,
            },
            headerTintColor: theme.text.primary,
          }} 
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider>
        <CurrencyProvider>
          <TransactionProvider>
            <RootLayoutNav />
          </TransactionProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
