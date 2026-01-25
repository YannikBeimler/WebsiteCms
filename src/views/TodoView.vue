<template>
  <div>
    <h1>Todo List</h1>
    <input
      v-model="newTodo"
      placeholder="Add a new todo"
      @keyup.enter="addTodo"
    />
    <button @click="addTodo">Add</button>
    <ul>
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @toggle-todo="toggleTodo"
        @delete-todo="deleteTodo"
      />
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import TodoItem from '../components/TodoItem.vue';

interface Todo {
  id: string;
  text: string;
  done: boolean;
}

export default defineComponent({
  name: 'TodoView',
  components: {
    TodoItem,
  },
  setup() {
    const newTodo = ref('');
    const todos = ref<Todo[]>([]);

    const addTodo = () => {
      if (newTodo.value.trim() !== '') {
        addDoc(collection(db, 'todos'), {
          text: newTodo.value,
          done: false,
        });
        newTodo.value = '';
      }
    };

    const toggleTodo = (todo: Todo) => {
      const todoRef = doc(db, 'todos', todo.id);
      updateDoc(todoRef, {
        done: !todo.done,
      });
    };

    const deleteTodo = (id: string) => {
      const todoRef = doc(db, 'todos', id);
      deleteDoc(todoRef);
    };

    onMounted(() => {
      onSnapshot(collection(db, 'todos'), (snapshot) => {
        todos.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          text: doc.data().text,
          done: doc.data().done,
        }));
      });
    });

    return {
      newTodo,
      todos,
      addTodo,
      toggleTodo,
      deleteTodo,
    };
  },
});
</script>
