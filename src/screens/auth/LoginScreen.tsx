import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { useAuthStore } from "../../store";
import { login } from "../../services/authService";
import { Button, Input } from "../../components/common";
import { colors, typography, spacing, radius } from "../../theme";

export function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const user = await login(email.trim(), password);
      setUser(user);
    } catch (err: any) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradientDark as any}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo / Header */}
            <Animated.View
              entering={FadeInDown.duration(800)}
              style={styles.header}
            >
              <LinearGradient
                colors={colors.gradientPrimary as any}
                style={styles.logoBox}
              >
                <Text style={styles.logoIcon}>✦</Text>
              </LinearGradient>
              <Text style={styles.appName}>TaskFlow</Text>
              <Text style={styles.tagline}>Your Flow, Your Control</Text>
            </Animated.View>

            {/* Form Card */}
            <Animated.View
              entering={FadeInUp.delay(300).duration(800)}
              style={styles.cardContainer}
            >
              <BlurView intensity={20} tint="dark" style={styles.card}>
                <Text style={styles.cardTitle}>Login</Text>

                <Input
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="your@email.com"
                  containerStyle={{ marginTop: spacing.xl }}
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
                  style={{ marginTop: spacing.lg }}
                />
              </BlurView>
            </Animated.View>

            {/* Register link */}
            <Animated.View
              entering={FadeInUp.delay(600)}
              style={styles.registerRow}
            >
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.registerLink}>Register now</Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing["2xl"],
    gap: spacing["2xl"],
  },
  header: { alignItems: "center", gap: spacing.sm },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: radius["2xl"],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
    elevation: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  logoIcon: { fontSize: 32, color: "#fff" },
  appName: {
    fontSize: typography["3xl"],
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontWeight: "500",
  },

  cardContainer: {
    borderRadius: radius["3xl"],
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.bgGlassBorder,
  },
  card: {
    backgroundColor: colors.bgGlass,
    padding: spacing["2xl"],
  },
  cardTitle: {
    fontSize: typography["2xl"],
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
  },
  cardSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    marginTop: 6,
    fontWeight: "500",
  },
  error: {
    color: colors.error,
    fontSize: typography.sm,
    textAlign: "center",
    marginTop: spacing.sm,
    fontWeight: "600",
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  registerText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontWeight: "500",
  },
  registerLink: {
    color: colors.accent,
    fontSize: typography.sm,
    fontWeight: "700",
  },
});
