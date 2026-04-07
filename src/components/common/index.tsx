import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors, typography, spacing, radius } from "../../theme";

// ─── Button ──────────────────────────────────────────────────
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: any;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  loading,
  disabled,
  icon,
  style,
}: ButtonProps) {
  const isOutline = variant === "outline";
  const isGhost = variant === "ghost";
  const isSecondary = variant === "secondary";

  const content = (
    <View style={styles.btnContent}>
      {loading ? (
        <ActivityIndicator
          color={isOutline || isGhost ? colors.primary : "#fff"}
          size="small"
        />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon as any}
              size={18}
              color={isOutline || isGhost ? colors.primary : "#fff"}
              style={{ marginRight: 8 }}
            />
          )}
          <Text
            style={[
              styles.btnLabel,
              (isOutline || isGhost) && { color: colors.primary },
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.8}
      style={[styles.btnContainer, style, disabled && { opacity: 0.5 }]}
    >
      {variant === "primary" ? (
        <LinearGradient
          colors={colors.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.btnGradient}
        >
          {content}
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.btnBase,
            isSecondary && { backgroundColor: colors.bgElevated },
            isOutline && { borderWidth: 1, borderColor: colors.primary },
            isGhost && { backgroundColor: "transparent" },
          ]}
        >
          {content}
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Input ───────────────────────────────────────────────────
interface InputProps {
  label?: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
  error?: string;
  containerStyle?: any;
  style?: any;
  multiline?: boolean;
  numberOfLines?: number;
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  error,
  containerStyle,
  style,
  multiline,
  numberOfLines,
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          focused && styles.inputWrapperFocused,
          !!error && styles.inputWrapperError,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.input, style]}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

// ─── Badge ───────────────────────────────────────────────────
interface BadgeProps {
  label: string;
  color: string;
  bgColor: string;
}

export function Badge({ label, color, bgColor }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

// ─── Card ────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  style?: any;
}

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ─── Empty State ─────────────────────────────────────────────
interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIconText}>{icon}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  // Button
  btnContainer: {
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  btnGradient: {
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  btnBase: {
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnLabel: {
    color: "#fff",
    fontSize: typography.base,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Input
  inputContainer: {
    marginBottom: spacing.base,
  },
  inputLabel: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.bgElevated,
  },
  inputWrapperError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.base,
    paddingVertical: 14,
    color: colors.textPrimary,
    fontSize: typography.base,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.xs,
    marginTop: 4,
    marginLeft: 4,
  },

  // Badge
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.md,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: typography.xs,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  // Card
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing["3xl"],
    gap: spacing.sm,
  },
  emptyIconText: { fontSize: 48, marginBottom: spacing.sm },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    fontWeight: "700",
    textAlign: "center",
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    textAlign: "center",
    lineHeight: 20,
  },
});
