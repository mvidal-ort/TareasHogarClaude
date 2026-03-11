// src/data/models.ts
import type { Priority, Status, Category, Role } from '../theme';

export interface User {
  id: number;
  name: string;
  avatar: string;
  role: Role;
  points: number;
  weeklyPoints: number;
  color: string;
  pin?: string;
}

export interface Task {
  id: number;
  title: string;
  desc: string;
  assignee: number;
  due: string;
  priority: Priority;
  status: Status;
  category: Category;
  points: number;
  comments: string[];
  repeat: 'diaria' | 'semanal' | null;
}

export interface Reward {
  id: number;
  name: string;
  points: number;
  icon: string;
}

// ── Seed data ──────────────────────────────────────────────
const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86_400_000).toISOString().split('T')[0];

export const INITIAL_USERS: User[] = [
  { id: 1, name: 'Mamá',  avatar: '👩', role: 'admin',  points: 340, weeklyPoints: 340, color: '#7C6AF7' },
  { id: 2, name: 'Papá',  avatar: '👨', role: 'admin',  points: 280, weeklyPoints: 280, color: '#60A5FA' },
  { id: 3, name: 'Lucas', avatar: '👦', role: 'member', points: 420, weeklyPoints: 420, color: '#4ADE80' },
  { id: 4, name: 'Sofía', avatar: '👧', role: 'member', points: 190, weeklyPoints: 190, color: '#F472B6' },
];

export const INITIAL_TASKS: Task[] = [
  { id: 1, title: 'Lavar los platos',   desc: 'Después del almuerzo',   assignee: 3, due: today,     priority: 'alta',  status: 'pendiente',   category: 'cocina',   points: 30, comments: [],           repeat: 'diaria'  },
  { id: 2, title: 'Barrer el piso',     desc: 'Sala y comedor',         assignee: 4, due: today,     priority: 'media', status: 'completada',  category: 'limpieza', points: 25, comments: ['¡Listo! 🎉'], repeat: 'diaria'  },
  { id: 3, title: 'Compras del súper',  desc: 'Lista en la heladera',   assignee: 2, due: tomorrow,  priority: 'alta',  status: 'en_progreso', category: 'compras',  points: 50, comments: [],           repeat: 'semanal' },
  { id: 4, title: 'Sacar la basura',    desc: '',                       assignee: 1, due: today,     priority: 'media', status: 'pendiente',   category: 'limpieza', points: 15, comments: [],           repeat: 'diaria'  },
  { id: 5, title: 'Regar las plantas',  desc: 'Las del balcón también', assignee: 1, due: yesterday, priority: 'baja',  status: 'vencida',     category: 'jardín',   points: 20, comments: [],           repeat: 'semanal' },
  { id: 6, title: 'Limpiar el baño',    desc: 'Piso, inodoro y espejo', assignee: 4, due: tomorrow,  priority: 'alta',  status: 'pendiente',   category: 'limpieza', points: 40, comments: [],           repeat: 'semanal' },
  { id: 7, title: 'Doblar la ropa',     desc: 'La del lavarropas',      assignee: 2, due: today,     priority: 'baja',  status: 'pendiente',   category: 'limpieza', points: 20, comments: [],           repeat: null      },
];

export const INITIAL_REWARDS: Reward[] = [
  { id: 1, name: 'Elegir la cena',       points: 100, icon: '🍕' },
  { id: 2, name: 'Noche de película',    points: 250, icon: '🎬' },
  { id: 3, name: 'Día sin tareas',       points: 500, icon: '😴' },
  { id: 4, name: 'Salida al parque',     points: 150, icon: '🌳' },
  { id: 5, name: 'Jugar videojuegos 1h', points: 200, icon: '🎮' },
];