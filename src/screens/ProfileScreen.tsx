import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { useAuthStore } from "../store";
import { logout } from "../services/authService";
import { useTheme } from "../hooks/useTheme";
import { typography, spacing, radius } from "../theme";

export function ProfileScreen() {
  const { user, setUser } = useAuthStore();
  const { colors, theme, toggleTheme, isDark } = useTheme();
  const styles = getStyles(colors);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          setUser(null);
        },
      },
    ]);
  };

  const menuItems = [
    { icon: "person-outline", label: "Edit Profile", color: colors.primary },
    {
      icon: "notifications-outline",
      label: "Notifications",
      color: colors.accent,
    },
    {
      icon: "shield-checkmark-outline",
      label: "Security",
      color: colors.success,
    },
    {
      icon: "color-palette-outline",
      label: "Dark Mode",
      color: colors.warning,
      isThemeToggle: true,
    },
    {
      icon: "help-circle-outline",
      label: "Help & Support",
      color: colors.info,
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradientDark as any}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(800)}>
            <Text style={styles.title}>Profile</Text>
          </Animated.View>

          {/* Profile Card */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(800)}
            style={styles.profileCardContainer}
          >
            <BlurView intensity={20} tint="dark" style={styles.profileCard}>
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={colors.gradientPrimary as any}
                  style={styles.avatarGradient}
                >
                  <Text style={styles.avatarText}>
                    {(user?.displayName ?? user?.email ?? "U")[0].toUpperCase()}
                  </Text>
                </LinearGradient>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.nameText}>
                  {user?.displayName ?? "User"}
                </Text>
                <Text style={styles.emailText}>{user?.email}</Text>
              </View>
            </BlurView>
          </Animated.View>

          {/* Menu Section */}
          <View style={styles.menuContainer}>
            {menuItems.map((item, idx) => (
              <Animated.View
                key={item.label}
                entering={FadeInUp.delay(300 + idx * 100)}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.menuItemWrapper}
                  onPress={item.isThemeToggle ? toggleTheme : undefined}
                >
                  <BlurView
                    intensity={10}
                    tint={isDark ? "dark" : "light"}
                    style={styles.menuItem}
                  >
                    <View
                      style={[
                        styles.menuIcon,
                        { backgroundColor: item.color + "22" },
                      ]}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color={item.color}
                      />
                    </View>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    {item.isThemeToggle ? (
                      <Switch
                        value={isDark}
                        onValueChange={toggleTheme}
                        trackColor={{
                          false: colors.border,
                          true: colors.primaryLight,
                        }}
                        thumbColor={isDark ? colors.primary : "#f4f3f4"}
                        ios_backgroundColor={colors.border}
                      />
                    ) : (
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={colors.textMuted}
                      />
                    )}
                  </BlurView>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Logout Button */}
          <Animated.View entering={FadeInUp.delay(900)}>
            <TouchableOpacity
              onPress={handleLogout}
              activeOpacity={0.8}
              style={styles.logoutWrapper}
            >
              <BlurView intensity={20} tint="dark" style={styles.logoutBtn}>
                <Ionicons
                  name="log-out-outline"
                  size={22}
                  color={colors.error}
                />
                <Text style={styles.logoutText}>Logout</Text>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>

          {/* App Version */}
          <Text style={styles.versionText}>Version 1.0.0 (Expo SDK 54)</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1 },
    safe: { flex: 1 },
    scroll: { padding: spacing.xl, paddingBottom: 120 },
    title: {
      fontSize: typography["3xl"],
      fontWeight: "900",
      color: colors.textPrimary,
      marginBottom: spacing.xl,
      letterSpacing: -1,
    },

    profileCardContainer: {
      borderRadius: radius["3xl"],
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.bgGlassBorder,
      marginBottom: spacing.xl,
    },
    profileCard: {
      padding: spacing.xl,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.bgGlass,
      gap: spacing.lg,
    },
    avatarContainer: {
      width: 70,
      height: 70,
      borderRadius: 35,
      overflow: "hidden",
      borderWidth: 2,
      borderColor: colors.border,
    },
    avatarGradient: { flex: 1, alignItems: "center", justifyContent: "center" },
    avatarText: { fontSize: typography.xl, fontWeight: "800", color: "#fff" },
    infoContainer: { flex: 1 },
    nameText: {
      fontSize: typography.lg,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    emailText: {
      fontSize: typography.sm,
      color: colors.textSecondary,
      marginTop: 4,
    },

    menuContainer: { gap: spacing.sm, marginBottom: spacing.xl },
    menuItemWrapper: {
      borderRadius: radius.xl,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.bgGlassBorder,
    },
    menuItem: {
      padding: spacing.base,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.bgGlass,
      gap: spacing.md,
    },
    menuIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.lg,
      alignItems: "center",
      justifyContent: "center",
    },
    menuLabel: {
      flex: 1,
      color: colors.textPrimary,
      fontSize: typography.base,
      fontWeight: "600",
    },

    logoutWrapper: {
      borderRadius: radius.xl,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.error + "44",
    },
    logoutBtn: {
      paddingVertical: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.error + "11",
      gap: spacing.sm,
    },
    logoutText: {
      color: colors.error,
      fontSize: typography.base,
      fontWeight: "700",
    },

    versionText: {
      textAlign: "center",
      color: colors.textMuted,
      fontSize: typography.xs,
      marginTop: spacing.xl,
      fontWeight: "500",
    },
  });
