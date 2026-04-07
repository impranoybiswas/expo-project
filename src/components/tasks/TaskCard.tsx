import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInRight, Layout } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { useTheme } from "../../hooks/useTheme";
import { typography, spacing, radius, priorityColors } from "../../theme";
import { Badge } from "../common";
import type { Task } from "../../types";

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  index?: number;
}

export function TaskCard({
  task,
  onPress,
  onEdit,
  onDelete,
  onToggleStatus,
  index = 0,
}: TaskCardProps) {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);

  const PRIORITY_CONFIG = {
    low: { color: priorityColors.low, label: "Low" },
    medium: { color: priorityColors.medium, label: "Medium" },
    high: { color: priorityColors.high, label: "High" },
  };

  const STATUS_CONFIG = {
    todo: { color: colors.textMuted, label: "To Do", icon: "ellipse-outline" },
    "in-progress": {
      color: colors.warning,
      label: "In Progress",
      icon: "time-outline",
    },
    done: { color: colors.success, label: "Done", icon: "checkmark-circle" },
  };

  const priority = PRIORITY_CONFIG[task.priority];
  const status = STATUS_CONFIG[task.status];
  const isDone = task.status === "done";

  const handleDelete = () => {
    Alert.alert("Delete Task", `"${task.title}" delete করবেন?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: onDelete },
    ]);
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      layout={Layout.springify()}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={styles.container}
      >
        <BlurView
          intensity={15}
          tint={isDark ? "dark" : "light"}
          style={styles.blurContainer}
        >
          {/* Left accent bar */}
          <View style={[styles.accent, { backgroundColor: priority.color }]} />

          <View style={styles.content}>
            {/* Header row */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={onToggleStatus}
                style={styles.statusBtn}
              >
                <Ionicons
                  name={status.icon as any}
                  size={24}
                  color={status.color}
                />
              </TouchableOpacity>

              <View style={styles.titleBlock}>
                <Text
                  style={[styles.title, isDone && styles.titleDone]}
                  numberOfLines={1}
                >
                  {task.title}
                </Text>
                {task.category && (
                  <Text style={styles.category}>{task.category}</Text>
                )}
              </View>

              <View style={styles.actions}>
                <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
                  <Ionicons
                    name="pencil"
                    size={16}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDelete}
                  style={styles.actionBtn}
                >
                  <Ionicons
                    name="trash"
                    size={16}
                    color={colors.error + "AA"}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Description */}
            {task.description ? (
              <Text style={styles.description} numberOfLines={2}>
                {task.description}
              </Text>
            ) : null}

            {/* Footer */}
            <View style={styles.footer}>
              <Badge
                label={priority.label}
                color={priority.color}
                bgColor={priority.color + "15"}
              />
              <Badge
                label={status.label}
                color={status.color}
                bgColor={status.color + "15"}
              />
              {task.dueDate && (
                <View style={styles.dueDate}>
                  <Ionicons
                    name="calendar-outline"
                    size={12}
                    color={colors.textMuted}
                  />
                  <Text style={styles.dueDateText}>{task.dueDate}</Text>
                </View>
              )}
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing.md,
      borderRadius: radius.xl,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.bgGlassBorder,
    },
    blurContainer: {
      flexDirection: "row",
      backgroundColor: colors.bgGlass,
    },
    accent: {
      width: 4,
      borderTopLeftRadius: radius.xl,
      borderBottomLeftRadius: radius.xl,
    },
    content: {
      flex: 1,
      padding: spacing.base,
      gap: 8,
    },
    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm,
    },
    statusBtn: {
      marginTop: 1,
    },
    titleBlock: { flex: 1 },
    title: {
      color: colors.textPrimary,
      fontSize: typography.base,
      fontWeight: "600",
      lineHeight: 20,
    },
    titleDone: {
      textDecorationLine: "line-through",
      color: colors.textMuted,
    },
    category: {
      color: colors.accent,
      fontSize: typography.xs,
      marginTop: 2,
      fontWeight: "500",
    },
    actions: {
      flexDirection: "row",
      gap: 4,
    },
    actionBtn: {
      padding: 6,
      borderRadius: radius.sm,
      backgroundColor: colors.bgElevated,
    },
    description: {
      color: colors.textSecondary,
      fontSize: typography.sm,
      lineHeight: 18,
      paddingLeft: 30,
    },
    footer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
      paddingLeft: 30,
    },
    dueDate: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
    },
    dueDateText: {
      color: colors.textMuted,
      fontSize: typography.xs,
    },
  });
