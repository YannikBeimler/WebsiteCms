<template>
  <li :class="{ done: todo.done }">
    <input type="checkbox" :checked="todo.done" @change="toggleTodo" />
    <span>{{ todo.text }}</span>
    <button @click="deleteTodo">Delete</button>
  </li>
</template>

<style scoped>
li {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

li.done span {
  text-decoration: line-through;
  color: #aaa;
}

input[type='checkbox'] {
  margin-right: 10px;
}

span {
  flex-grow: 1;
}

button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}
</style>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

interface Todo {
  id: string;
  text: string;
  done: boolean;
}

export default defineComponent({
  name: 'TodoItem',
  props: {
    todo: {
      type: Object as PropType<Todo>,
      required: true,
    },
  },
  emits: ['toggle-todo', 'delete-todo'],
  setup(props, { emit }) {
    const toggleTodo = () => {
      emit('toggle-todo', props.todo);
    };

    const deleteTodo = () => {
      emit('delete-todo', props.todo.id);
    };

    return {
      toggleTodo,
      deleteTodo,
    };
  },
});
</script>
