import React, { useEffect, useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { useTheme } from "../../hooks/useTheme";
import { useTasks } from "../../hooks/useTasks";
import { getTask } from "../../services/taskService";
import { Button, Input } from "../../components/common";
import { typography, spacing, radius, priorityColors } from "../../theme";
import type { TaskPriority, TaskStatus } from "../../types";

const PRIORITIES: TaskPriority[] = ["low", "medium", "high"];
const STATUSES: TaskStatus[] = ["todo", "in-progress", "done"];
const CATEGORIES = [
  { name: "General", icon: "apps-outline" },
  { name: "Work", icon: "briefcase-outline" },
  { name: "Personal", icon: "person-outline" },
  { name: "Shopping", icon: "cart-outline" },
  { name: "Health", icon: "heart-outline" },
  { name: "Study", icon: "book-outline" },
];

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: priorityColors.low,
  medium: priorityColors.medium,
  high: priorityColors.high,
};

export function TaskFormScreen({ navigation, route }: any) {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);
  const { taskId } = route.params ?? {};
  const isEdit = !!taskId;

  const { create, update } = useTasks();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [category, setCategory] = useState("General");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      getTask(taskId).then((task) => {
        if (task) {
          setTitle(task.title);
          setDescription(task.description);
          setPriority(task.priority);
          setStatus(task.status);
          setCategory(task.category || "General");
        }
        setFetchLoading(false);
      });
    }
  }, [taskId]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (isEdit) {
        await update(taskId, {
          title,
          description,
          priority,
          status,
          category,
        });
      } else {
        await create({
          title,
          description,
          priority,
          status,
          category,
          dueDate: null,
        });
      }
      navigation.goBack();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
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
  }

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
            <BlurView
              intensity={20}
              tint={isDark ? "dark" : "light"}
              style={styles.backBtn}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color={colors.textPrimary}
              />
            </BlurView>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEdit ? "Edit Task" : "New Task"}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              entering={FadeInDown.duration(600)}
              style={styles.sectionCard}
            >
              <BlurView
                intensity={20}
                tint={isDark ? "dark" : "light"}
                style={styles.blurCard}
              >
                <Input
                  label="Task Title *"
                  value={title}
                  onChangeText={setTitle}
                  placeholder="What needs to be done?"
                />
                <Input
                  label="Description"
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Enter details..."
                  multiline
                  numberOfLines={3}
                  style={{ height: 100, textAlignVertical: "top" }}
                />
              </BlurView>
            </Animated.View>

            {/* Options */}
            <Animated.View
              entering={FadeInUp.delay(200)}
              style={styles.sectionCard}
            >
              <BlurView
                intensity={15}
                tint={isDark ? "dark" : "light"}
                style={styles.blurCard}
              >
                <Text style={styles.sectionLabel}>Priority</Text>
                <View style={styles.optionRow}>
                  {PRIORITIES.map((p) => {
                    const isActive = priority === p;
                    return (
                      <TouchableOpacity
                        key={p}
                        onPress={() => setPriority(p)}
                        style={[
                          styles.chip,
                          isActive && { borderColor: PRIORITY_COLORS[p] },
                        ]}
                      >
                        <BlurView
                          intensity={isActive ? 40 : 5}
                          tint={isDark ? "dark" : "light"}
                          style={styles.chipBlur}
                        >
                          <View
                            style={[
                              styles.dot,
                              { backgroundColor: PRIORITY_COLORS[p] },
                            ]}
                          />
                          <Text
                            style={[
                              styles.chipText,
                              isActive && {
                                color: PRIORITY_COLORS[p],
                                fontWeight: "700",
                              },
                            ]}
                          >
                            {p.toUpperCase()}
                          </Text>
                        </BlurView>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>
                  Category
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryScroll}
                >
                  {CATEGORIES.map((c) => {
                    const isActive = category === c.name;
                    return (
                      <TouchableOpacity
                        key={c.name}
                        onPress={() => setCategory(c.name)}
                        style={[
                          styles.categoryChip,
                          isActive && { borderColor: colors.accent },
                        ]}
                      >
                        <BlurView
                          intensity={isActive ? 40 : 5}
                          tint={isDark ? "dark" : "light"}
                          style={styles.chipBlur}
                        >
                          <Ionicons
                            name={c.icon as any}
                            size={16}
                            color={
                              isActive ? colors.accent : colors.textSecondary
                            }
                          />
                          <Text
                            style={[
                              styles.chipText,
                              isActive && {
                                color: colors.accent,
                                fontWeight: "700",
                              },
                            ]}
                          >
                            {c.name}
                          </Text>
                        </BlurView>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </BlurView>
            </Animated.View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Animated.View
              entering={FadeInUp.delay(400)}
              style={{ marginTop: spacing.md }}
            >
              <Button
                label={isEdit ? "Update Task" : "Create Task"}
                onPress={handleSubmit}
                loading={loading}
              />
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
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

    scroll: { padding: spacing.xl, gap: spacing.lg, paddingBottom: 140 },
    sectionCard: {
      borderRadius: radius["2xl"],
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.bgGlassBorder,
    },
    blurCard: { padding: spacing.xl, backgroundColor: colors.bgGlass },

    sectionLabel: {
      color: colors.textSecondary,
      fontSize: typography.xs,
      fontWeight: "700",
      marginBottom: spacing.base,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    optionRow: { flexDirection: "row", gap: spacing.sm },
    chip: {
      borderRadius: radius.full,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.bgGlassBorder,
      width: 90,
    },
    chipBlur: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      backgroundColor: colors.bgGlass,
      height: 40,
    },
    dot: { width: 6, height: 6, borderRadius: 3 },
    chipText: { fontSize: 11, color: colors.textSecondary, fontWeight: "600" },

    categoryScroll: { gap: spacing.sm, paddingRight: spacing.xl },
    categoryChip: {
      borderRadius: radius.full,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.bgGlassBorder,
      minWidth: 100,
    },
    errorText: {
      color: colors.error,
      fontSize: typography.sm,
      textAlign: "center",
      fontWeight: "600",
    },
  });
