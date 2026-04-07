// src/screens/auth/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store';
import { login } from '../../services/authService';
import { Button, Input } from '../../components/common';
import { colors, typography, spacing, radius } from '../../theme';

export function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('সব field পূরণ করুন');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const user = await login(email.trim(), password);
      setUser(user);
    } catch (err: any) {
      setError('Email বা password ভুল');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo / Header */}
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <Text style={styles.logoIcon}>✦</Text>
            </View>
            <Text style={styles.appName}>TaskFlow</Text>
            <Text style={styles.tagline}>আপনার কাজ, আপনার নিয়ন্ত্রণে</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>স্বাগতম 👋</Text>
            <Text style={styles.cardSubtitle}>Login করুন continue করতে</Text>

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="your@email.com"
              containerStyle={{ marginTop: spacing.lg }}
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
              label="Login"
              onPress={handleLogin}
              loading={loading}
              style={{ marginTop: spacing.base }}
            />
          </View>

          {/* Register link */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Account নেই? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Register করুন</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing['2xl'],
    gap: spacing.xl,
  },
  header: { alignItems: 'center', gap: spacing.sm },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  logoIcon: { fontSize: 28, color: '#fff' },
  appName: {
    fontSize: typography['2xl'],
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: { color: colors.textMuted, fontSize: typography.sm },

  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
  },
  cardTitle: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    marginTop: 4,
  },
  error: {
    color: colors.error,
    fontSize: typography.sm,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: { color: colors.textSecondary, fontSize: typography.sm },
  registerLink: {
    color: colors.accent,
    fontSize: typography.sm,
    fontWeight: '600',
  },
});
