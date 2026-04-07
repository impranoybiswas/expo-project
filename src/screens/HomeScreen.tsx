// src/screens/HomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store';
import { useTasks } from '../hooks/useTasks';
import { TaskCard } from '../components/tasks/TaskCard';
import { colors, typography, spacing, radius } from '../theme';

export function HomeScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const { tasks, update, remove } = useTasks();

  const recentTasks = tasks.slice(0, 3);
  const todayTotal = tasks.length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const progress = todayTotal > 0 ? done / todayTotal : 0;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'শুভ সকাল';
    if (h < 17) return 'শুভ বিকেল';
    return 'শুভ সন্ধ্যা';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting()} 👋</Text>
            <Text style={styles.userName}>
              {user?.displayName ?? user?.email?.split('@')[0]}
            </Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.displayName ?? 'U')[0].toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <View>
              <Text style={styles.progressLabel}>আজকের অগ্রগতি</Text>
              <Text style={styles.progressFraction}>
                {done}/{todayTotal} সম্পন্ন
              </Text>
            </View>
            <Text style={styles.progressPct}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.round(progress * 100)}%` },
              ]}
            />
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          {[
            { icon: 'list', label: 'মোট Task', value: todayTotal, color: colors.primary },
            { icon: 'time', label: 'চলমান', value: tasks.filter(t => t.status === 'in-progress').length, color: colors.warning },
            { icon: 'checkmark-circle', label: 'সম্পন্ন', value: done, color: colors.success },
            { icon: 'alert-circle', label: 'High Priority', value: tasks.filter(t => t.priority === 'high').length, color: colors.error },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '22' }]}>
                <Ionicons name={stat.icon as any} size={18} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Recent Tasks */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>সাম্প্রতিক Tasks</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
            <Text style={styles.seeAll}>সব দেখুন</Text>
          </TouchableOpacity>
        </View>

        {recentTasks.length === 0 ? (
          <View style={styles.emptyBlock}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyText}>কোনো task নেই! নতুন task যোগ করুন।</Text>
          </View>
        ) : (
          recentTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => navigation.navigate('Tasks', { screen: 'TaskDetail', params: { taskId: task.id } })}
              onEdit={() => navigation.navigate('Tasks', { screen: 'EditTask', params: { taskId: task.id } })}
              onDelete={() => remove(task.id)}
              onToggleStatus={() => {
                const next = task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'done' : 'todo';
                update(task.id, { status: next });
              }}
            />
          ))
        )}

        {/* Add Task FAB */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('Tasks', { screen: 'AddTask' })}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing['2xl'], paddingBottom: 100 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  greeting: { color: colors.textSecondary, fontSize: typography.sm },
  userName: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: typography.lg, fontWeight: '700' },

  progressCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  progressLabel: { color: colors.textSecondary, fontSize: typography.sm },
  progressFraction: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  progressPct: {
    fontSize: typography['2xl'],
    fontWeight: '800',
    color: colors.primary,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.bgElevated,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.bgCard,
    borderRadius: radius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: { color: colors.textMuted, fontSize: typography.xs },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  seeAll: { color: colors.accent, fontSize: typography.sm, fontWeight: '600' },

  emptyBlock: { alignItems: 'center', paddingVertical: spacing['2xl'], gap: spacing.sm },
  emptyIcon: { fontSize: 40 },
  emptyText: { color: colors.textSecondary, fontSize: typography.sm, textAlign: 'center' },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
