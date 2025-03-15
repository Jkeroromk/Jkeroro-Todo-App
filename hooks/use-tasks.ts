import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, addDoc, updateDoc, deleteDoc, doc, onSnapshot, deleteField } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Task } from '@/components/todo-app';
import { useSession } from 'next-auth/react';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', session.user.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      setTasks(tasksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [session]);

  const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    if (!session?.user?.id) return;

    try {
      const newTask = {
        ...task,
        createdAt: new Date().toISOString(),
        userId: session.user.id
      };

      if (newTask.dueDate === undefined) {
        delete newTask.dueDate;
      }

      await addDoc(collection(db, 'tasks'), newTask);
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await updateDoc(taskRef, {
          completed: !task.completed
        });
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Omit<Task, 'id' | 'userId'>>) => {
    if (!session?.user?.id) return;
    
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const updatedData = { ...updates };

      if (updatedData.dueDate === undefined) {
        updatedData.dueDate = deleteField();
      }

      await updateDoc(taskRef, updatedData);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  return {
    tasks,
    loading,
    addTask,
    toggleTaskCompletion,
    deleteTask,
    updateTask
  };
} 