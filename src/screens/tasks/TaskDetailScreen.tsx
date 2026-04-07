// src/screens/tasks/TaskDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getTask } from '../../services/taskService';
import { useTasks } from '../../hooks/useTasks';
import { Badge } from '../../components/common';
import { colors, typography, spacing, radius } from '../../theme';
import type { Task } from '../../types';

const PRIORITY_COLORS = { low: colors.priorityLow, medium: colors.priorityMedium, high: colors.priorityHigh };
const STATUS_COLORS = { todo: colors.textMuted, 'in-progress': colors.warning, done: colors.success };

export function TaskDetailScreen({ navigation, route }: any) {
  const { taskId } = route.params;
  const [task, setTask] = useState<Task | null>(null);
  const { remove, update } = useTasks();

  useEffect(() => {
    getTask(taskId).then(setTask);
  }, [taskId]);

  const handleDelete = () => {
    Alert.alert('Delete', 'এই task delete করবেন?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await remove(taskId); navigation.goBack(); } },
    ]);
  };

  if (!task) return (
    <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={{ color: colors.textSecondary }}>Loading...</Text>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('EditTask', { taskId })} style={styles.iconBtn}>
            <Ionicons name="pencil-outline" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.iconBtn}>
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.accentBar, { backgroundColor: PRIORITY_COLORS[task.priority] }]} />

        <Text style={styles.title}>{task.title}</Text>

        <View style={styles.badgeRow}>
          <Badge label={task.priority} color={PRIORITY_COLORS[task.priority]} bgColor={PRIORITY_COLORS[task.priority]} />
          <Badge label={task.status} color={STATUS_COLORS[task.status]} bgColor={STATUS_COLORS[task.status]} />
          <Badge label={task.category} color={colors.accent} bgColor={colors.accent} />
        </View>

        {task.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>বিবরণ</Text>
            <Text style={styles.description}>{task.description}</Text>
          </View>
        ) : null}

        <View style={styles.metaCard}>
          {[
            { icon: 'calendar-outline', label: 'তৈরি', value: new Date(task.createdAt).toLocaleDateString('bn-BD') },
            { icon: 'time-outline', label: 'আপডেট', value: new Date(task.updatedAt).toLocaleDateString('bn-BD') },
          ].map((m) => (
            <View key={m.label} style={styles.metaRow}>
              <Ionicons name={m.icon as any} size={16} color={colors.textMuted} />
              <Text style={styles.metaLabel}>{m.label}</Text>
              <Text style={styles.metaValue}>{m.value}</Text>
            </View>
          ))}
        </View>

        {/* Quick status update */}
        <Text style={styles.sectionLabel}>Status পরিবর্তন করুন</Text>
        <View style={styles.statusRow}>
          {(['todo', 'in-progress', 'done'] as const).map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => { update(taskId, { status: s }); setTask((prev) => prev ? { ...prev, status: s } : prev); }}
              style={[styles.statusBtn, task.status === s && { backgroundColor: STATUS_COLORS[s] + '22', borderColor: STATUS_COLORS[s] }]}
            >
              <Text style={[styles.statusBtnText, task.status === s && { color: STATUS_COLORS[s] }]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing['2xl'], paddingVertical: spacing.base },
  backBtn: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.bgCard, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: typography.lg, fontWeight: '700', color: colors.textPrimary },
  headerActions: { flexDirection: 'row', gap: spacing.sm },
  iconBtn: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.bgCard, alignItems: 'center', justifyContent: 'center' },

  content: { padding: spacing['2xl'], gap: spacing.base, paddingBottom: 60 },
  accentBar: { height: 4, borderRadius: 2, marginBottom: spacing.base },
  title: { fontSize: typography.xl, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },

  section: { backgroundColor: colors.bgCard, borderRadius: radius.xl, padding: spacing.base, borderWidth: 1, borderColor: colors.border },
  sectionLabel: { color: colors.textSecondary, fontSize: typography.sm, fontWeight: '600', marginBottom: spacing.sm, letterSpacing: 0.3 },
  description: { color: colors.textPrimary, fontSize: typography.base, lineHeight: 24 },

  metaCard: { backgroundColor: colors.bgCard, borderRadius: radius.xl, padding: spacing.base, borderWidth: 1, borderColor: colors.border, gap: spacing.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  metaLabel: { flex: 1, color: colors.textSecondary, fontSize: typography.sm },
  metaValue: { color: colors.textPrimary, fontSize: typography.sm, fontWeight: '600' },

  statusRow: { flexDirection: 'row', gap: spacing.sm },
  statusBtn: { flex: 1, paddingVertical: 10, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgCard, alignItems: 'center' },
  statusBtnText: { color: colors.textSecondary, fontSize: typography.sm, fontWeight: '600' },
});
