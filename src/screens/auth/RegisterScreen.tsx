// src/screens/auth/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { register } from '../../services/authService';
import { useAuthStore } from '../../store';
import { Button, Input } from '../../components/common';
import { colors, typography, spacing, radius } from '../../theme';

export function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useAuthStore();

  const handleRegister = async () => {
    if (!name || !email || !password) { setError('সব field পূরণ করুন'); return; }
    if (password.length < 6) { setError('Password কমপক্ষে ৬ অক্ষর'); return; }
    setLoading(true); setError('');
    try {
      const user = await register(email.trim(), password, name.trim());
      setUser(user);
    } catch (e: any) { setError('Registration ব্যর্থ হয়েছে'); }
    finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.logoBox}><Text style={styles.logoIcon}>✦</Text></View>
            <Text style={styles.appName}>TaskFlow</Text>
            <Text style={styles.tagline}>Account তৈরি করুন</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>নতুন Account 🚀</Text>
            <Input label="নাম" value={name} onChangeText={setName} placeholder="আপনার নাম" containerStyle={{ marginTop: spacing.base }} />
            <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="your@email.com" />
            <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="কমপক্ষে ৬ অক্ষর" />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button label="Register" onPress={handleRegister} loading={loading} style={{ marginTop: spacing.base }} />
          </View>
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Account আছে? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login করুন</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flexGrow: 1, justifyContent: 'center', padding: spacing['2xl'], gap: spacing.xl },
  header: { alignItems: 'center', gap: spacing.sm },
  logoBox: { width: 64, height: 64, borderRadius: radius.xl, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  logoIcon: { fontSize: 28, color: '#fff' },
  appName: { fontSize: typography['2xl'], fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  tagline: { color: colors.textMuted, fontSize: typography.sm },
  card: { backgroundColor: colors.bgCard, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.xl },
  cardTitle: { fontSize: typography.xl, fontWeight: '700', color: colors.textPrimary },
  error: { color: colors.error, fontSize: typography.sm, textAlign: 'center', marginTop: spacing.sm },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { color: colors.textSecondary, fontSize: typography.sm },
  loginLink: { color: colors.accent, fontSize: typography.sm, fontWeight: '600' },
});
