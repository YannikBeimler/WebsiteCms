<template>
  <li :class="{ done: todo.done }" :style="{ backgroundColor: todo.color }">
    <div class="main-content">
      <input type="checkbox" :checked="todo.done" @change="toggleTodo" />
      <template v-if="!isEditing">
        <span class="todo-text">{{ todo.text }}</span>
        <button v-if="!todo.done" @click="startEdit" class="edit-btn">
          Edit
        </button>
      </template>
      <template v-else>
        <div class="edit-container">
          <input
            ref="editInput"
            v-model="editText"
            class="edit-input"
            @keyup.enter="saveEdit"
            @keyup.esc="cancelEdit"
            @blur="handleBlur"
          />
          <div class="color-picker">
            <div
              v-for="color in colors"
              :key="color"
              :style="{ backgroundColor: color }"
              :class="['color-option', { selected: todo.color === color }]"
              @mousedown.prevent="selectColor(color)"
            ></div>
          </div>
        </div>
      </template>
      <button @click="deleteTodo" class="delete-btn">Delete</button>
    </div>
  </li>
</template>

<style scoped>
li {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s ease;
  border-radius: 4px;
  margin-bottom: 5px;
}

.main-content {
  display: flex;
  align-items: center;
  width: 100%;
}

li.done .todo-text {
  text-decoration: line-through;
  color: #aaa;
}

input[type='checkbox'] {
  margin-right: 10px;
}

.todo-text {
  flex-grow: 1;
}

.edit-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-right: 10px;
}

.edit-input {
  width: 100%;
  padding: 5px;
  margin-bottom: 5px;
}

.color-picker {
  display: flex;
  gap: 10px;
}

.color-option {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-option:hover {
  transform: scale(1.2);
}

.color-option.selected {
  border: 2px solid #333;
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
import type { Todo, TodoColor } from '../models/todo';

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
    const colors: TodoColor[] = [
      '#ffffff',
      '#ffcdd2',
      '#c8e6c9',
      '#bbdefb',
      '#fff9c4',
    ];

    watch(
      () => props.todo.done,
      (isDone) => {
        if (isDone) {
          isEditing.value = false;
        }
      }
    );

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
      } else if (
        trimmedText !== props.todo.text ||
        props.todo.color !== props.todo.color
      ) {
        emit('update', { ...props.todo, text: trimmedText });
      }
      isEditing.value = false;
    };

    const handleBlur = () => {
      // Use a small timeout to allow color selection which uses mousedown.prevent
      setTimeout(() => {
        if (isEditing.value) {
          saveEdit();
        }
      }, 200);
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

    const selectColor = (color: TodoColor) => {
      if (color !== props.todo.color) {
        emit('update', { ...props.todo, color });
      }
    };

    return {
      isEditing,
      editText,
      editInput,
      colors,
      startEdit,
      saveEdit,
      handleBlur,
      cancelEdit,
      toggleTodo,
      deleteTodo,
      selectColor,
    };
  },
});
</script>
