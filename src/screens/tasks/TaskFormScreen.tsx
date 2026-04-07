// src/screens/tasks/TaskFormScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../../hooks/useTasks';
import { getTask } from '../../services/taskService';
import { Button, Input } from '../../components/common';
import { colors, typography, spacing, radius } from '../../theme';
import type { TaskPriority, TaskStatus } from '../../types';

const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];
const STATUSES: TaskStatus[] = ['todo', 'in-progress', 'done'];
const CATEGORIES = ['General', 'Work', 'Personal', 'Shopping', 'Health', 'Study'];

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: colors.priorityLow,
  medium: colors.priorityMedium,
  high: colors.priorityHigh,
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export function TaskFormScreen({ navigation, route }: any) {
  const { taskId } = route.params ?? {};
  const isEdit = !!taskId;

  const { create, update } = useTasks();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [category, setCategory] = useState('General');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      getTask(taskId).then((task) => {
        if (task) {
          setTitle(task.title);
          setDescription(task.description);
          setPriority(task.priority);
          setStatus(task.status);
          setCategory(task.category);
        }
        setFetchLoading(false);
      });
    }
  }, [taskId]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Title দিন');
      return;
    }
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await update(taskId, { title, description, priority, status, category });
      } else {
        await create({ title, description, priority, status, category, dueDate: null });
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
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.textSecondary }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEdit ? 'Task Edit' : 'নতুন Task'}</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Input
            label="Task Title *"
            value={title}
            onChangeText={setTitle}
            placeholder="কী করতে হবে?"
          />
          <Input
            label="বিবরণ"
            value={description}
            onChangeText={setDescription}
            placeholder="বিস্তারিত লিখুন..."
            multiline
            numberOfLines={3}
            style={{ height: 80, textAlignVertical: 'top' }}
          />

          {/* Priority */}
          <Text style={styles.sectionLabel}>Priority</Text>
          <View style={styles.optionRow}>
            {PRIORITIES.map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setPriority(p)}
                style={[
                  styles.optionBtn,
                  priority === p && {
                    backgroundColor: PRIORITY_COLORS[p] + '22',
                    borderColor: PRIORITY_COLORS[p],
                  },
                ]}
              >
                <View style={[styles.dot, { backgroundColor: PRIORITY_COLORS[p] }]} />
                <Text
                  style={[
                    styles.optionText,
                    priority === p && { color: PRIORITY_COLORS[p] },
                  ]}
                >
                  {PRIORITY_LABELS[p]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Status */}
          <Text style={styles.sectionLabel}>Status</Text>
          <View style={styles.optionRow}>
            {STATUSES.map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => setStatus(s)}
                style={[
                  styles.optionBtn,
                  status === s && {
                    backgroundColor: colors.primary + '22',
                    borderColor: colors.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    status === s && { color: colors.primary },
                  ]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Category */}
          <Text style={styles.sectionLabel}>Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setCategory(c)}
                style={[
                  styles.categoryChip,
                  category === c && styles.categoryChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === c && styles.categoryTextActive,
                  ]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            label={isEdit ? 'Update করুন' : 'Task যোগ করুন'}
            onPress={handleSubmit}
            loading={loading}
            style={{ marginTop: spacing.base }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.base,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  content: {
    padding: spacing['2xl'],
    gap: 0,
    paddingBottom: 60,
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: spacing.base,
    letterSpacing: 0.3,
  },
  optionRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.base,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  optionText: { color: colors.textSecondary, fontSize: typography.sm, fontWeight: '500' },

  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  categoryChip: {
    paddingHorizontal: spacing.base,
    paddingVertical: 7,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
  },
  categoryChipActive: {
    backgroundColor: colors.accent + '22',
    borderColor: colors.accent,
  },
  categoryText: { color: colors.textSecondary, fontSize: typography.sm },
  categoryTextActive: { color: colors.accent, fontWeight: '600' },

  error: { color: colors.error, fontSize: typography.sm, textAlign: 'center', marginTop: 8 },
});
