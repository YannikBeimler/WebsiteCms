<template>
  <li :class="{ done: todo.done }">
    <input
      type="checkbox"
      :checked="todo.done"
      @change="$emit('toggle-todo', todo)"
    />
    <span>{{ todo.text }}</span>
    <button @click="$emit('delete-todo', todo.id)">Delete</button>
  </li>
</template>

<style scoped>
.done span {
  text-decoration: line-through;
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
});
</script>
