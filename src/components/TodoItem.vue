<template>
  <li :class="{ done: todo.done }">
    <input type="checkbox" :checked="todo.done" @change="toggleTodo" />
    <template v-if="!isEditing">
      <span>{{ todo.text }}</span>
      <button v-if="!todo.done" @click="startEdit" class="edit-btn">Edit</button>
    </template>
    <template v-else>
      <input
        ref="editInput"
        v-model="editText"
        class="edit-input"
        @keyup.enter="saveEdit"
        @keyup.esc="cancelEdit"
        @blur="saveEdit"
      />
    </template>
    <button @click="deleteTodo" class="delete-btn">Delete</button>
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

.edit-input {
  flex-grow: 1;
  padding: 5px;
  margin-right: 10px;
}

button {
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 5px;
}

.edit-btn {
  background-color: #2196f3;
}

.delete-btn {
  background-color: #f44336;
}
</style>

<script lang="ts">
import { defineComponent, PropType, ref, nextTick, watch } from 'vue';
import type { Todo } from '../models/todo';

export default defineComponent({
  name: 'TodoItem',
  props: {
    todo: {
      type: Object as PropType<Todo>,
      required: true,
    },
  },
  emits: ['update', 'delete-todo'],
  setup(props, { emit }) {
    const isEditing = ref(false);
    const editText = ref(props.todo.text);
    const editInput = ref<HTMLInputElement | null>(null);

    watch(() => props.todo.done, (isDone) => {
      if (isDone) {
        isEditing.value = false;
      }
    });

    const startEdit = () => {
      if (!props.todo.done) {
        isEditing.value = true;
        editText.value = props.todo.text;
        nextTick(() => {
          editInput.value?.focus();
        });
      }
    };

    const saveEdit = () => {
      if (!isEditing.value) return;
      
      const trimmedText = editText.value.trim();
      if (trimmedText === '') {
        editText.value = props.todo.text;
      } else if (trimmedText !== props.todo.text) {
        emit('update', { ...props.todo, text: trimmedText });
      }
      isEditing.value = false;
    };

    const cancelEdit = () => {
      isEditing.value = false;
    };

    const toggleTodo = () => {
      emit('update', { ...props.todo, done: !props.todo.done });
    };

    const deleteTodo = () => {
      emit('delete-todo', props.todo.id);
    };

    return {
      isEditing,
      editText,
      editInput,
      startEdit,
      saveEdit,
      cancelEdit,
      toggleTodo,
      deleteTodo,
    };
  },
});
</script>
