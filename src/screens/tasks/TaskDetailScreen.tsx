import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { getTask } from "../../services/taskService";
import { useTasks } from "../../hooks/useTasks";
import { Badge } from "../../components/common";
import { colors, typography, spacing, radius } from "../../theme";
import type { Task } from "../../types";

const PRIORITY_COLORS = {
  low: colors.priorityLow,
  medium: colors.priorityMedium,
  high: colors.priorityHigh,
};
const STATUS_COLORS = {
  todo: colors.textMuted,
  "in-progress": colors.warning,
  done: colors.success,
};

export function TaskDetailScreen({ navigation, route }: any) {
  const { taskId } = route.params;
  const [task, setTask] = useState<Task | null>(null);
  const { remove, update } = useTasks();

  useEffect(() => {
    getTask(taskId).then(setTask);
  }, [taskId]);

  const handleDelete = () => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to permanently delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await remove(taskId);
            navigation.goBack();
          },
        },
      ],
    );
  };

  if (!task)
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={colors.gradientDark as any}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView
          style={[
            styles.safe,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text style={{ color: colors.textSecondary }}>Loading...</Text>
        </SafeAreaView>
      </View>
    );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradientDark as any}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtnContainer}
          >
            <BlurView intensity={20} tint="dark" style={styles.backBtn}>
              <Ionicons
                name="arrow-back"
                size={20}
                color={colors.textPrimary}
              />
            </BlurView>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Task Details</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => navigation.navigate("EditTask", { taskId })}
              style={styles.actionBtn}
            >
              <BlurView intensity={20} tint="dark" style={styles.actionIcon}>
                <Ionicons name="pencil" size={18} color={colors.accent} />
              </BlurView>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.actionBtn}>
              <BlurView intensity={20} tint="dark" style={styles.actionIcon}>
                <Ionicons name="trash" size={18} color={colors.error} />
              </BlurView>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Card */}
          <Animated.View
            entering={FadeInDown.duration(600)}
            style={styles.mainCardContainer}
          >
            <BlurView intensity={20} tint="dark" style={styles.mainCard}>
              <View
                style={[
                  styles.priorityTag,
                  { backgroundColor: PRIORITY_COLORS[task.priority] },
                ]}
              />

              <Text style={styles.title}>{task.title}</Text>

              <View style={styles.badgeRow}>
                <Badge
                  label={task.priority}
                  color={PRIORITY_COLORS[task.priority]}
                  bgColor={PRIORITY_COLORS[task.priority] + "22"}
                />
                <Badge
                  label={task.status}
                  color={STATUS_COLORS[task.status]}
                  bgColor={STATUS_COLORS[task.status] + "22"}
                />
                <Badge
                  label={task.category}
                  color={colors.accent}
                  bgColor={colors.accent + "22"}
                />
              </View>

              {task.description ? (
                <View style={styles.descriptionSection}>
                  <Text style={styles.sectionLabel}>Description</Text>
                  <Text style={styles.descriptionText}>{task.description}</Text>
                </View>
              ) : null}
            </BlurView>
          </Animated.View>

          {/* Meta Information */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(800)}
            style={styles.metaCardContainer}
          >
            <BlurView intensity={15} tint="dark" style={styles.metaCard}>
              <View style={styles.metaRow}>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={colors.textSecondary}
                />
                <Text style={styles.metaLabel}>Created At</Text>
                <Text style={styles.metaValue}>
                  {new Date(task.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaRow}>
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={colors.textSecondary}
                />
                <Text style={styles.metaLabel}>Last Updated</Text>
                <Text style={styles.metaValue}>
                  {new Date(task.updatedAt).toLocaleDateString()}
                </Text>
              </View>
            </BlurView>
          </Animated.View>

          {/* Quick Status Toggles */}
          <Animated.View
            entering={FadeInUp.delay(400)}
            style={styles.statusSection}
          >
            <Text style={styles.sectionLabel}>Change Status</Text>
            <View style={styles.statusGrid}>
              {(["todo", "in-progress", "done"] as const).map((s) => {
                const isActive = task.status === s;
                return (
                  <TouchableOpacity
                    key={s}
                    onPress={() => {
                      update(taskId, { status: s });
                      setTask((t) => (t ? { ...t, status: s } : t));
                    }}
                    activeOpacity={0.8}
                    style={[
                      styles.statusToggle,
                      isActive && { borderColor: STATUS_COLORS[s] },
                    ]}
                  >
                    <BlurView
                      intensity={isActive ? 40 : 10}
                      tint="dark"
                      style={styles.statusBlur}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          isActive && {
                            color: STATUS_COLORS[s],
                            fontWeight: "700",
                          },
                        ]}
                      >
                        {s.toUpperCase()}
                      </Text>
                    </BlurView>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  backBtnContainer: {
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.bgGlassBorder,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgGlass,
  },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  headerActions: { flexDirection: "row", gap: spacing.sm },
  actionBtn: {
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.bgGlassBorder,
  },
  actionIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgGlass,
  },

  scroll: { padding: spacing.xl, gap: spacing.lg, paddingBottom: 60 },
  mainCardContainer: {
    borderRadius: radius["3xl"],
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.bgGlassBorder,
  },
  mainCard: { padding: spacing["2xl"], backgroundColor: colors.bgGlass },
  priorityTag: {
    height: 6,
    width: 60,
    borderRadius: 3,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography["2xl"],
    fontWeight: "900",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  descriptionSection: {
    marginTop: spacing.md,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontWeight: "700",
    marginBottom: spacing.base,
    textTransform: "uppercase",
  },
  descriptionText: {
    color: colors.textPrimary,
    fontSize: typography.base,
    lineHeight: 26,
  },

  metaCardContainer: {
    borderRadius: radius["2xl"],
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.bgGlassBorder,
  },
  metaCard: {
    padding: spacing.xl,
    backgroundColor: colors.bgGlass,
    gap: spacing.md,
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  metaLabel: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontWeight: "500",
  },
  metaValue: {
    color: colors.textPrimary,
    fontSize: typography.sm,
    fontWeight: "700",
  },
  metaDivider: { height: 1, backgroundColor: colors.border },

  statusSection: { marginTop: spacing.md },
  statusGrid: { flexDirection: "row", gap: spacing.sm },
  statusToggle: {
    flex: 1,
    borderRadius: radius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.bgGlassBorder,
  },
  statusBlur: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgGlass,
  },
  statusText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: "600",
    letterSpacing: 1,
  },
});
