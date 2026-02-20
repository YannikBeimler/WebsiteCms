import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '@/firebase';
import type { Todo } from '@/models/todo';

const todosCollection = collection(db, 'todos');

export const todoService = {
  getTodos(callback: (todos: Todo[]) => void): () => void {
    const unsubscribe = onSnapshot(todosCollection, (snapshot) => {
      const todos = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Todo)
      );
      callback(todos);
    });
    return unsubscribe;
  },

  async addTodo(text: string): Promise<Todo> {
    const docRef = await addDoc(todosCollection, { text, done: false });
    return { id: docRef.id, text, done: false };
  },

  async updateTodo(todo: Todo): Promise<void> {
    const todoRef = doc(db, 'todos', todo.id);
    await updateDoc(todoRef, { text: todo.text, done: todo.done });
  },

  async deleteTodo(id: string): Promise<void> {
    const todoRef = doc(db, 'todos', id);
    await deleteDoc(todoRef);
  },
};
