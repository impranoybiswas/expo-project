// src/hooks/useTasks.ts
import { useEffect, useCallback } from "react";
import {
  subscribeToTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";
import { useTaskStore } from "../store";
import { useAuthStore } from "../store";
import type { Task } from "../types";

export function useTasks() {
  const { user } = useAuthStore();
  const {
    tasks,
    isLoading,
    error,
    setTasks,
    addTask,
    updateTask: updateLocal,
    removeTask,
    setLoading,
    setError,
    filter,
    getFilteredTasks,
  } = useTaskStore();

  // ── Realtime subscription ────────────────────────────────────
  useEffect(() => {
    if (!user) {
      setTasks([]); // <--- Add this to clear the list on logout
      return;
    }
    setLoading(true);

    const unsub = subscribeToTasks(
      user.uid,
      (fetched) => {
        setTasks(fetched);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );

    return () => unsub();
  }, [user]);

  // ── CREATE ──────────────────────────────────────────────────
  const create = useCallback(
    async (data: Omit<Task, "id" | "createdAt" | "updatedAt" | "userId">) => {
      if (!user) return;
      try {
        const task = await createTask(user.uid, data);
        addTask(task);
        return task;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [user, addTask, setError],
  );

  // ── UPDATE ──────────────────────────────────────────────────
  const update = useCallback(
    async (id: string, data: Partial<Task>) => {
      try {
        await updateTask(id, data);
        updateLocal(id, data);
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [updateLocal, setError],
  );

  // ── DELETE ──────────────────────────────────────────────────
  const remove = useCallback(
    async (id: string) => {
      try {
        await deleteTask(id);
        removeTask(id);
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [removeTask, setError],
  );

  return {
    tasks: getFilteredTasks(),
    allTasks: tasks,
    isLoading,
    error,
    filter,
    create,
    update,
    remove,
  };
}
