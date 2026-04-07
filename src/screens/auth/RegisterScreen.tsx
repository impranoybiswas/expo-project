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

import { register } from "../../services/authService";
import { useAuthStore } from "../../store";
import { Button, Input } from "../../components/common";
import { colors, typography, spacing, radius } from "../../theme";

export function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuthStore();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const user = await register(email.trim(), password, name.trim());
      setUser(user);
    } catch (e: any) {
      setError("Registration failed");
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
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
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
              <Text style={styles.tagline}>Start Your New Journey</Text>
            </Animated.View>

            {/* Form Card */}
            <Animated.View
              entering={FadeInUp.delay(300).duration(800)}
              style={styles.cardContainer}
            >
              <BlurView intensity={20} tint="dark" style={styles.card}>
                <Text style={styles.cardTitle}>Create Account 🚀</Text>

                <Input
                  label="Name"
                  value={name}
                  onChangeText={setName}
                  placeholder="Your Name"
                  containerStyle={{ marginTop: spacing.xl }}
                />
                <Input
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="your@email.com"
                />
                <Input
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="At least 6 characters"
                />

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <Button
                  label="Register"
                  onPress={handleRegister}
                  loading={loading}
                  style={{ marginTop: spacing.lg }}
                />
              </BlurView>
            </Animated.View>

            {/* Login link */}
            <Animated.View
              entering={FadeInUp.delay(600)}
              style={styles.loginRow}
            >
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>Login now</Text>
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
    gap: spacing.xl,
  },
  header: { alignItems: "center", gap: spacing.sm },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: radius["2xl"],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoIcon: { fontSize: 28, color: "#fff" },
  appName: {
    fontSize: typography["2xl"],
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -0.5,
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
    fontSize: typography.xl,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  error: {
    color: colors.error,
    fontSize: typography.sm,
    textAlign: "center",
    marginTop: spacing.sm,
    fontWeight: "600",
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  loginText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontWeight: "500",
  },
  loginLink: {
    color: colors.accent,
    fontSize: typography.sm,
    fontWeight: "700",
  },
});
