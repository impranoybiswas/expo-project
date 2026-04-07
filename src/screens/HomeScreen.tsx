import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";

import { useAuthStore, useTaskStore } from "../store";
import { useTasks } from "../hooks/useTasks";
import { TaskCard } from "../components/tasks/TaskCard";
import { colors, typography, spacing, radius } from "../theme";

const { width } = Dimensions.get("window");

export function HomeScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const { tasks, remove, update } = useTasks();
  const progressValue = useSharedValue(0);

  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const totalTasks = tasks.length;
  const progressRatio = totalTasks > 0 ? doneTasks / totalTasks : 0;

  useEffect(() => {
    progressValue.value = withSpring(progressRatio, { damping: 15 });
  }, [progressRatio]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value * 100}%`,
  }));

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const stats = [
    {
      icon: "list",
      label: "Total Tasks",
      value: totalTasks,
      color: colors.primary,
    },
    {
      icon: "time",
      label: "In Progress",
      value: tasks.filter((t) => t.status === "in-progress").length,
      color: colors.warning,
    },
    {
      icon: "checkmark-circle",
      label: "Completed",
      value: doneTasks,
      color: colors.success,
    },
    {
      icon: "alert-circle",
      label: "High Priority",
      value: tasks.filter((t) => t.priority === "high").length,
      color: colors.error,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={colors.gradientDark as any}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Header */}
          <Animated.View
            entering={FadeInDown.duration(800)}
            style={styles.header}
          >
            <View>
              <Text style={styles.greeting}>{greeting()} 👋</Text>
              <Text style={styles.userName}>
                {user?.displayName ?? user?.email?.split("@")[0]}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
              style={styles.avatarContainer}
            >
              <LinearGradient
                colors={colors.gradientPrimary as any}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarText}>
                  {(user?.displayName ?? "U")[0].toUpperCase()}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Progress Card (Glass) */}
          <Animated.View entering={FadeInUp.delay(200).duration(800)}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.glassCardContainer}
            >
              <BlurView intensity={20} tint="dark" style={styles.glassCard}>
                <View style={styles.progressHeader}>
                  <View>
                    <Text style={styles.progressTitle}>Today's Progress</Text>
                    <Text style={styles.progressSub}>
                      {doneTasks}/{totalTasks} Completed
                    </Text>
                  </View>
                  <Text style={styles.progressPercent}>
                    {Math.round(progressRatio * 100)}%
                  </Text>
                </View>

                <View style={styles.progressBarBg}>
                  <Animated.View
                    style={[styles.progressBarFill, animatedProgressStyle]}
                  >
                    <LinearGradient
                      colors={colors.gradientAccent as any}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={StyleSheet.absoluteFill}
                    />
                  </Animated.View>
                </View>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {stats.map((stat, idx) => (
              <Animated.View
                key={stat.label}
                entering={FadeInDown.delay(300 + idx * 100).duration(600)}
                style={styles.statCard}
              >
                <BlurView intensity={10} tint="dark" style={styles.statBlur}>
                  <View
                    style={[
                      styles.statIcon,
                      { backgroundColor: stat.color + "22" },
                    ]}
                  >
                    <Ionicons
                      name={stat.icon as any}
                      size={20}
                      color={stat.color}
                    />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </BlurView>
              </Animated.View>
            ))}
          </View>

          {/* Recent Tasks Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Tasks</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Tasks")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {tasks.length === 0 ? (
            <Animated.View
              entering={FadeInDown.delay(800)}
              style={styles.emptyState}
            >
              <Ionicons
                name="rocket-outline"
                size={60}
                color={colors.textMuted}
              />
              <Text style={styles.emptyText}>No tasks yet!</Text>
              <Text style={styles.emptySub}>
                Click the plus button to start
              </Text>
            </Animated.View>
          ) : (
            tasks.slice(0, 5).map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onPress={() =>
                  navigation.navigate("Tasks", {
                    screen: "TaskDetail",
                    params: { taskId: task.id },
                  })
                }
                onEdit={() =>
                  navigation.navigate("Tasks", {
                    screen: "EditTask",
                    params: { taskId: task.id },
                  })
                }
                onDelete={() => remove(task.id)}
                onToggleStatus={() => {
                  const nextStatus =
                    task.status === "done"
                      ? "todo"
                      : task.status === "in-progress"
                        ? "done"
                        : "in-progress";
                  update(task.id, { status: nextStatus });
                }}
              />
            ))
          )}
        </ScrollView>

        {/* FAB */}
        <Animated.View
          entering={FadeInUp.delay(1000).springify()}
          style={styles.fabContainer}
        >
          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate("Tasks", { screen: "AddTask" })}
          >
            <LinearGradient
              colors={colors.gradientPrimary as any}
              style={styles.fabGradient}
            >
              <Ionicons name="add" size={32} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scroll: { padding: spacing.xl, paddingBottom: 110 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  greeting: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontWeight: "500",
  },
  userName: {
    fontSize: typography["2xl"],
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  avatarGradient: { flex: 1, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontSize: typography.lg, fontWeight: "800" },

  glassCardContainer: {
    marginBottom: spacing.xl,
    borderRadius: radius["2xl"],
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.bgGlassBorder,
  },
  glassCard: { padding: spacing.xl, backgroundColor: colors.bgGlass },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: spacing.md,
  },
  progressTitle: {
    fontSize: typography.base,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  progressSub: {
    fontSize: typography.lg,
    fontWeight: "800",
    color: colors.textPrimary,
    marginTop: 4,
  },
  progressPercent: {
    fontSize: typography["3xl"],
    fontWeight: "900",
    color: colors.accent,
  },

  progressBarBg: {
    height: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 5 },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    minWidth: (width - spacing.xl * 2 - spacing.sm) / 2,
    height: 110,
    borderRadius: radius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.bgGlassBorder,
  },
  statBlur: {
    flex: 1,
    padding: spacing.base,
    backgroundColor: colors.bgGlass,
    justifyContent: "space-between",
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: typography.xl,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    fontWeight: "500",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.base,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  seeAll: { fontSize: typography.sm, color: colors.accent, fontWeight: "600" },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    opacity: 0.8,
  },
  emptyText: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    fontWeight: "700",
    marginTop: 12,
  },
  emptySub: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    marginTop: 4,
  },

  fabContainer: { position: "absolute", bottom: 110, right: 24, zIndex: 10 },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: { flex: 1, alignItems: "center", justifyContent: "center" },
});
