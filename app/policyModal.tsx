import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

export default function PolicyModal() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const { theme } = useTheme();

  const privacyPolicyContent = `
Last updated: [Date]

1. Information We Collect
We collect information that you provide directly to us when using the app, including [list specific data points].

2. How We Use Your Information
We use the collected information to:
- Provide and maintain our services
- Improve user experience
- Send important notifications

3. Data Security
We implement appropriate security measures to protect your personal information.

4. Contact Us
If you have questions about this Privacy Policy, please contact us at [contact information].
`;

  const termsContent = `
Last updated: [Date]

1. Acceptance of Terms
By accessing and using this app, you accept and agree to be bound by these Terms and Conditions.

2. Use License
Permission is granted to temporarily download one copy of the app for personal, non-commercial use only.

3. Disclaimer
The app is provided "as is" without any warranties, express or implied.

4. Limitations
In no event shall we be liable for any damages arising out of the use or inability to use the app.

5. Changes to Terms
We reserve the right to modify these terms at any time. Please review them periodically.
`;

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.content}>
        <Text style={[styles.text, { color: theme.text.primary }]}>
          {type === 'privacy' ? privacyPolicyContent : termsContent}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
}); 