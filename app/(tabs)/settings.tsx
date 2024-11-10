import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useCurrency } from '../../contexts/CurrencyContext';

type SettingItemProps = {
  icon: { 
    name: keyof typeof Ionicons.glyphMap;
    bg: string 
  };
  title: string;
  subtitle?: string;
  onPress?: () => void;
  children?: React.ReactNode;
};

export default function Settings() {
  const { theme } = useTheme();
  const { currency } = useCurrency();

  const SettingItem = ({ icon, title, subtitle, onPress, children }: SettingItemProps) => (
    <Pressable
      style={[styles.settingItem, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}
      onPress={onPress}
      android_ripple={{ color: theme.border }}
    >
      <View style={[styles.iconContainer, { backgroundColor: icon.bg }]}>
        <Ionicons name={icon.name} size={20} color="#fff" />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: theme.text.primary }]}>{title}</Text>
        {subtitle && <Text style={[styles.settingSubtitle, { color: theme.text.secondary }]}>{subtitle}</Text>}
      </View>
      {children}
    </Pressable>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>Preferences</Text>
        <View style={[styles.sectionContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <SettingItem
            icon={{ name: 'moon', bg: '#607D8B' }}
            title="Dark Mode"
          >
            <ThemeToggle />
          </SettingItem>
          <SettingItem
            icon={{ name: 'cash', bg: '#FF9800' }}
            title="Currency"
            subtitle={currency.code}
            onPress={() => router.push('/currencySelect')}
          >
            <Ionicons name="chevron-forward" size={20} color={theme.text.secondary} />
          </SettingItem>
        </View>
      </View>

      {/* Legal Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>Legal</Text>
        <View style={[styles.sectionContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <SettingItem
            icon={{ name: 'document-text', bg: '#795548' }}
            title="Terms & Conditions"
            onPress={() => router.push('/policyModal?type=terms')}
          >
            <Ionicons name="chevron-forward" size={20} color={theme.text.secondary} />
          </SettingItem>
          <SettingItem
            icon={{ name: 'shield-checkmark', bg: '#4CAF50' }}
            title="Privacy Policy"
            onPress={() => router.push('/policyModal?type=privacy')}
          >
            <Ionicons name="chevron-forward" size={20} color={theme.text.secondary} />
          </SettingItem>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>About</Text>
        <View style={[styles.sectionContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <SettingItem
            icon={{ name: 'information-circle', bg: '#607D8B' }}
            title="App Version"
            subtitle="1.0.0"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
});