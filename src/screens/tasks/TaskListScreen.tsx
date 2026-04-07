import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";

import { useTasks } from "../../hooks/useTasks";
import { useTaskStore } from "../../store";
import { TaskCard } from "../../components/tasks/TaskCard";
import { EmptyState } from "../../components/common";
import { colors, typography, spacing, radius } from "../../theme";
import type { TaskStatus } from "../../types";

const STATUS_TABS: { key: TaskStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "todo", label: "To Do" },
  { key: "in-progress", label: "Going" },
  { key: "done", label: "End" },
];

export function TaskListScreen({ navigation }: any) {
  const { tasks, isLoading, update, remove } = useTasks();
  const { setFilter, filter, getFilteredTasks } = useTaskStore();
  const [activeTab, setActiveTab] = useState<TaskStatus | "all">("all");

  const filteredTasks = getFilteredTasks();

  const handleTabChange = (tab: TaskStatus | "all") => {
    setActiveTab(tab);
    setFilter(tab === "all" ? {} : { status: tab });
  };

  const stats = {
    total: tasks.length,
    done: tasks.filter((t) => t.status === "done").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradientDark as any}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>My Tasks</Text>
            <Text style={styles.headerSub}>
              {stats.total} tasks · {stats.done} completed
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addBtnContainer}
            onPress={() => navigation.navigate("AddTask")}
          >
            <LinearGradient
              colors={colors.gradientPrimary as any}
              style={styles.addBtn}
            >
              <Ionicons name="add" size={26} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Stats Row (Glass) */}
        <Animated.View
          entering={FadeInDown.delay(100)}
          style={styles.statsContainer}
        >
          <BlurView intensity={20} tint="dark" style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={[styles.statBox, styles.statDivider]}>
              <Text style={[styles.statNum, { color: colors.warning }]}>
                {stats.inProgress}
              </Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: colors.success }]}>
                {stats.done}
              </Text>
              <Text style={styles.statLabel}>Done</Text>
            </View>
          </BlurView>
        </Animated.View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabs}
          >
            {STATUS_TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => handleTabChange(tab.key)}
                  activeOpacity={0.8}
                  style={styles.tabWrapper}
                >
                  {isActive ? (
                    <LinearGradient
                      colors={colors.gradientPrimary as any}
                      style={styles.tabActive}
                    >
                      <Text style={styles.tabTextActive}>{tab.label}</Text>
                    </LinearGradient>
                  ) : (
                    <BlurView intensity={10} tint="dark" style={styles.tab}>
                      <Text style={styles.tabText}>{tab.label}</Text>
                    </BlurView>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* List */}
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TaskCard
              task={item}
              index={index}
              onPress={() =>
                navigation.navigate("TaskDetail", { taskId: item.id })
              }
              onEdit={() =>
                navigation.navigate("EditTask", { taskId: item.id })
              }
              onDelete={() => remove(item.id)}
              onToggleStatus={() => {
                const next =
                  item.status === "done"
                    ? "todo"
                    : item.status === "in-progress"
                      ? "done"
                      : "in-progress";
                update(item.id, { status: next });
              }}
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              icon="📋"
              title="কোনো task পাওয়া যায়নি"
              subtitle="এই ক্যাটাগরিতে কোনো task নেই"
            />
          }
          refreshControl={
            <RefreshControl refreshing={isLoading} tintColor={colors.primary} />
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    fontSize: typography["2xl"],
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerSub: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontWeight: "500",
  },
  addBtnContainer: {
    borderRadius: radius.lg,
    overflow: "hidden",
    elevation: 4,
  },
  addBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  statsContainer: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    borderRadius: radius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.bgGlassBorder,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: colors.bgGlass,
    paddingVertical: spacing.md,
  },
  statBox: { flex: 1, alignItems: "center" },
  statDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  statNum: {
    fontSize: typography.xl,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: typography.xs,
    fontWeight: "600",
    marginTop: 2,
  },

  tabsContainer: { marginBottom: spacing.lg },
  tabs: { paddingHorizontal: spacing.xl, gap: spacing.sm },
  tabWrapper: {
    borderRadius: radius.full,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.bgGlassBorder,
  },
  tab: {
    paddingHorizontal: spacing.xl,
    paddingVertical: 8,
    backgroundColor: colors.bgGlass,
  },
  tabActive: { paddingHorizontal: spacing.xl, paddingVertical: 8 },
  tabText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontWeight: "600",
  },
  tabTextActive: { color: "#fff", fontSize: typography.sm, fontWeight: "700" },

  list: { paddingHorizontal: spacing.xl, paddingBottom: 100 },
});
