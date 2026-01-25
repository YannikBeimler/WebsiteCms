<template>
  <div class="todo-view">
    <h1>Todo List</h1>
    <div class="input-container">
      <input
        v-model="newTodo"
        placeholder="Add a new todo"
        @keyup.enter="addTodo"
      />
      <button @click="addTodo">Add</button>
    </div>
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

<style scoped>
.todo-view {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.input-container {
  display: flex;
  margin-bottom: 20px;
}

input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 15px;
  border: none;
  background-color: #42b983;
  color: white;
  border-radius: 4px;
  margin-left: 10px;
  cursor: pointer;
}

ul {
  list-style: none;
  padding: 0;
}
</style>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { todoService } from '../services/todoService';
import type { Todo } from '../models/todo';
import TodoItem from '../components/TodoItem.vue';

export default defineComponent({
  name: 'TodoView',
  components: {
    TodoItem,
  },
  setup() {
    const newTodo = ref('');
    const todos = ref<Todo[]>([]);
    let unsubscribe: () => void;

    onMounted(() => {
      unsubscribe = todoService.getTodos((updatedTodos) => {
        todos.value = updatedTodos;
      });
    });

    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe();
      }
    });

    const addTodo = async () => {
      if (newTodo.value.trim() !== '') {
        await todoService.addTodo(newTodo.value);
        newTodo.value = '';
      }
    };

    const toggleTodo = async (todo: Todo) => {
      const updatedTodo = { ...todo, done: !todo.done };
      await todoService.updateTodo(updatedTodo);
    };

    const deleteTodo = async (id: string) => {
      await todoService.deleteTodo(id);
    };

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
