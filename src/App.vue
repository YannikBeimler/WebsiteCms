<template>
  <div>
    <h1>Todo List</h1>
    <input v-model="newTodo" placeholder="Add a new todo" />
    <button @click="addTodo">Add</button>
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        {{ todo.text }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from './firebase';

interface Todo {
  id: string;
  text: string;
}

export default defineComponent({
  name: 'App',
  setup() {
    const newTodo = ref('');
    const todos = ref<Todo[]>([]);

    const addTodo = () => {
      if (newTodo.value.trim() !== '') {
        addDoc(collection(db, 'todos'), {
          text: newTodo.value,
        });
        newTodo.value = '';
      }
    };

    onMounted(() => {
      onSnapshot(collection(db, 'todos'), (snapshot) => {
        todos.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          text: doc.data().text,
        }));
      });
    });

    return {
      newTodo,
      todos,
      addTodo,
    };
  },
});
</script>
