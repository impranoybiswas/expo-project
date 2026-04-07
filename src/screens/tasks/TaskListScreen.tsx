// src/screens/tasks/TaskListScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../../hooks/useTasks';
import { useTaskStore } from '../../store';
import { TaskCard } from '../../components/tasks/TaskCard';
import { EmptyState } from '../../components/common';
import { colors, typography, spacing, radius } from '../../theme';
import type { TaskStatus } from '../../types';

const STATUS_TABS: { key: TaskStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'সব' },
  { key: 'todo', label: 'To Do' },
  { key: 'in-progress', label: 'চলমান' },
  { key: 'done', label: 'শেষ' },
];

export function TaskListScreen({ navigation }: any) {
  const { tasks, isLoading, update, remove } = useTasks();
  const { setFilter, filter } = useTaskStore();
  const [activeTab, setActiveTab] = useState<TaskStatus | 'all'>('all');

  const handleTabChange = (tab: TaskStatus | 'all') => {
    setActiveTab(tab);
    setFilter(tab === 'all' ? {} : { status: tab });
  };

  const toggleStatus = (task: any) => {
    const next =
      task.status === 'todo'
        ? 'in-progress'
        : task.status === 'in-progress'
        ? 'done'
        : 'todo';
    update(task.id, { status: next });
  };

  const stats = {
    total: tasks.length,
    done: tasks.filter((t) => t.status === 'done').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Tasks</Text>
          <Text style={styles.headerSub}>
            {stats.total}টি task · {stats.done}টি সম্পন্ন
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddTask')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{stats.total}</Text>
          <Text style={styles.statLabel}>মোট</Text>
        </View>
        <View style={[styles.statBox, styles.statDivider]}>
          <Text style={[styles.statNum, { color: colors.warning }]}>
            {stats.inProgress}
          </Text>
          <Text style={styles.statLabel}>চলমান</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: colors.success }]}>
            {stats.done}
          </Text>
          <Text style={styles.statLabel}>সম্পন্ন</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabs}>
        {STATUS_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => handleTabChange(tab.key)}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
            onEdit={() => navigation.navigate('EditTask', { taskId: item.id })}
            onDelete={() => remove(item.id)}
            onToggleStatus={() => toggleStatus(item)}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="📋"
            title="কোনো task নেই"
            subtitle="নতুন task যোগ করুন"
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.base,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: typography['2xl'],
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerSub: { color: colors.textSecondary, fontSize: typography.sm, marginTop: 2 },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: spacing['2xl'],
    backgroundColor: colors.bgCard,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.base,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.base,
  },
  statDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  statNum: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: { color: colors.textMuted, fontSize: typography.xs, marginTop: 2 },

  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing['2xl'],
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  tab: {
    paddingHorizontal: spacing.base,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: { color: colors.textSecondary, fontSize: typography.sm, fontWeight: '500' },
  tabTextActive: { color: '#fff' },

  list: {
    paddingHorizontal: spacing['2xl'],
    paddingBottom: 100,
  },
});
