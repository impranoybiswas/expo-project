import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Task, TaskFilter } from '../types';

const COLLECTION = 'tasks';

// ─── Helpers ──────────────────────────────────────────────────
function toTask(id: string, data: Record<string, any>): Task {
  return {
    id,
    title: data.title ?? '',
    description: data.description ?? '',
    priority: data.priority ?? 'medium',
    status: data.status ?? 'todo',
    category: data.category ?? 'General',
    dueDate: data.dueDate ?? null,
    userId: data.userId ?? '',
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : data.createdAt ?? new Date().toISOString(),
    updatedAt:
      data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate().toISOString()
        : data.updatedAt ?? new Date().toISOString(),
  };
}

// ─── CREATE ───────────────────────────────────────────────────
export async function createTask(
  userId: string,
  data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
): Promise<Task> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return toTask(docRef.id, {
    ...data,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

// ─── READ ALL (one-time) ───────────────────────────────────────
export async function getTasks(userId: string, filter?: TaskFilter): Promise<Task[]> {
  let q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  let tasks = snapshot.docs.map((d) => toTask(d.id, d.data()));

  // Client-side filter (avoid composite index requirements)
  if (filter?.status) tasks = tasks.filter((t) => t.status === filter.status);
  if (filter?.priority) tasks = tasks.filter((t) => t.priority === filter.priority);
  if (filter?.category) tasks = tasks.filter((t) => t.category === filter.category);

  return tasks;
}

// ─── READ ONE ─────────────────────────────────────────────────
export async function getTask(taskId: string): Promise<Task | null> {
  const snap = await getDoc(doc(db, COLLECTION, taskId));
  if (!snap.exists()) return null;
  return toTask(snap.id, snap.data());
}

// ─── REALTIME LISTENER ────────────────────────────────────────
export function subscribeToTasks(
  userId: string,
  onUpdate: (tasks: Task[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const tasks = snapshot.docs.map((d) => toTask(d.id, d.data()));
      onUpdate(tasks);
    },
    (err) => onError?.(err as Error)
  );
}

// ─── UPDATE ───────────────────────────────────────────────────
export async function updateTask(
  taskId: string,
  data: Partial<Omit<Task, 'id' | 'createdAt' | 'userId'>>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, taskId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ─── DELETE ───────────────────────────────────────────────────
export async function deleteTask(taskId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, taskId));
}
