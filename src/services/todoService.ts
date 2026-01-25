import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '@/firebase';
import type { Todo } from '@/models/todo';

const todosCollection = collection(db, 'todos');

export const todoService = {
  async getTodos(): Promise<Todo[]> {
    const snapshot = await getDocs(todosCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Todo));
  },

  async addTodo(text: string): Promise<Todo> {
    const docRef = await addDoc(todosCollection, { text, done: false });
    return { id: docRef.id, text, done: false };
  },

  async updateTodo(todo: Todo): Promise<void> {
    const todoRef = doc(db, 'todos', todo.id);
    await updateDoc(todoRef, { done: todo.done });
  },

  async deleteTodo(id: string): Promise<void> {
    const todoRef = doc(db, 'todos', id);
    await deleteDoc(todoRef);
  },
};
