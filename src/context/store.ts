// src/context/store.ts
import { create } from 'zustand';
import { db } from '../firebase';
import {
  collection, doc, setDoc, deleteDoc,
  onSnapshot, writeBatch
} from 'firebase/firestore';
import { INITIAL_USERS, INITIAL_TASKS, INITIAL_REWARDS } from '../data/models';
import type { User, Task, Reward } from '../data/models';

interface AppState {
  users: User[];
  tasks: Task[];
  rewards: Reward[];
  currentUserId: number;
  hydrated: boolean;

  currentUser: () => User;
  isAdmin: () => boolean;

  init: () => () => void;
  setCurrentUser: (id: number) => void;

  addUser: (user: Omit<User, 'id' | 'points' | 'weeklyPoints'>) => Promise<void>;
  updateUser: (id: number, data: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;

  addTask: (task: Omit<Task, 'id' | 'comments'>) => Promise<void>;
  updateTask: (id: number, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleTaskComplete: (id: number) => Promise<void>;
  addComment: (taskId: number, comment: string) => Promise<void>;

  awardPoints: (userId: number, pts: number) => Promise<void>;
  resetWeeklyRanking: () => Promise<void>;
  resetAllPoints: () => Promise<void>;

  addReward: (data: Omit<Reward, 'id'>) => Promise<void>;
  updateReward: (id: number, data: Partial<Reward>) => Promise<void>;
  deleteReward: (id: number) => Promise<void>;
}

export const useStore = create<AppState>()((set, get) => ({
  users: [],
  tasks: [],
  rewards: [],
  currentUserId: 1,
  hydrated: false,

  currentUser: () => get().users.find(u => u.id === get().currentUserId) ?? get().users[0],
  isAdmin: () => (get().users.find(u => u.id === get().currentUserId)?.role ?? 'member') === 'admin',

  init: () => {
    const unsubUsers = onSnapshot(collection(db, 'users'), async snap => {
      if (snap.empty) {
        const batch = writeBatch(db);
        INITIAL_USERS.forEach(u => batch.set(doc(db, 'users', String(u.id)), u));
        await batch.commit();
      } else {
        const users = snap.docs.map(d => d.data() as User);
        set({ users });
      }
    });

    const unsubTasks = onSnapshot(collection(db, 'tasks'), async snap => {
      if (snap.empty) {
        const batch = writeBatch(db);
        INITIAL_TASKS.forEach(t => batch.set(doc(db, 'tasks', String(t.id)), t));
        await batch.commit();
      } else {
        const tasks = snap.docs.map(d => d.data() as Task);
        set({ tasks, hydrated: true });
      }
    });

    const unsubRewards = onSnapshot(collection(db, 'rewards'), async snap => {
      if (snap.empty) {
        const batch = writeBatch(db);
        INITIAL_REWARDS.forEach(r => batch.set(doc(db, 'rewards', String(r.id)), r));
        await batch.commit();
      } else {
        const rewards = snap.docs.map(d => d.data() as Reward);
        set({ rewards });
      }
    });

    return () => { unsubUsers(); unsubTasks(); unsubRewards(); };
  },

  setCurrentUser: (id) => set({ currentUserId: id }),

  addUser: async (data) => {
    const id = Date.now();
    await setDoc(doc(db, 'users', String(id)), { ...data, id, points: 0, weeklyPoints: 0 });
  },

  updateUser: async (id, data) => {
    const user = get().users.find(u => u.id === id);
    if (!user) return;
    await setDoc(doc(db, 'users', String(id)), { ...user, ...data });
  },

  deleteUser: async (id) => {
    await deleteDoc(doc(db, 'users', String(id)));
    const tasks = get().tasks.filter(t => t.assignee === id);
    const firstUser = get().users.find(u => u.id !== id);
    if (firstUser) {
      const batch = writeBatch(db);
      tasks.forEach(t => batch.set(doc(db, 'tasks', String(t.id)), { ...t, assignee: firstUser.id }));
      await batch.commit();
    }
  },

  addTask: async (data) => {
    const id = Date.now();
    await setDoc(doc(db, 'tasks', String(id)), { ...data, id, comments: [] });
  },

  updateTask: async (id, data) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;
    await setDoc(doc(db, 'tasks', String(id)), { ...task, ...data });
  },

  deleteTask: async (id) => {
    await deleteDoc(doc(db, 'tasks', String(id)));
  },

  toggleTaskComplete: async (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;
    const isCompleting = task.status !== 'completada';
    const newStatus = isCompleting ? 'completada' : 'pendiente';
    await setDoc(doc(db, 'tasks', String(id)), { ...task, status: newStatus });
    if (isCompleting) {
      await get().awardPoints(get().currentUserId, task.points);
    }
  },

  addComment: async (taskId, comment) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task) return;
    await setDoc(doc(db, 'tasks', String(taskId)), {
      ...task,
      comments: [...task.comments, comment],
    });
  },

  awardPoints: async (userId, pts) => {
    const user = get().users.find(u => u.id === userId);
    if (!user) return;
    await setDoc(doc(db, 'users', String(userId)), {
      ...user,
      points: user.points + pts,
      weeklyPoints: (user.weeklyPoints ?? 0) + pts,
    });
  },

  resetWeeklyRanking: async () => {
    const batch = writeBatch(db);
    get().users.forEach(u => {
      batch.set(doc(db, 'users', String(u.id)), { ...u, weeklyPoints: 0 });
    });
    await batch.commit();
  },

  resetAllPoints: async () => {
    console.log('reseteando puntos, usuarios:', get().users.map(u => u.name));
    const batch = writeBatch(db);
    get().users.forEach(u => {
      batch.set(doc(db, 'users', String(u.id)), { ...u, points: 0, weeklyPoints: 0 });
    });
    await batch.commit();
  },

  addReward: async (data) => {
    const id = Date.now();
    await setDoc(doc(db, 'rewards', String(id)), { ...data, id });
  },

  updateReward: async (id, data) => {
    const reward = get().rewards.find(r => r.id === id);
    if (!reward) return;
    await setDoc(doc(db, 'rewards', String(id)), { ...reward, ...data });
  },

  deleteReward: async (id) => {
    await deleteDoc(doc(db, 'rewards', String(id)));
  },
}));