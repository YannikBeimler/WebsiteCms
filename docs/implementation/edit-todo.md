# Implementation Documentation - Edit Todo Feature

## Overview
The 'Edit Todo' feature allows users to modify the text of existing tasks that are not yet marked as completed.

## User Interface
- **Edit Button**: Visible on each todo item that is not 'done'.
- **Edit Mode**: Clicking the 'Edit' button replaces the todo text with an input field.
- **Saving Changes**: 
  - Pressing **Enter** saves the changes.
  - Clicking away (blurring the input) saves the changes.
  - If the input is empty, it reverts to the original text.
- **Canceling Changes**: 
  - Pressing **Escape** cancels the edit and reverts to the original text.
- **Auto-Cancel**: If a todo is marked as 'done' while in edit mode, the edit mode is automatically closed.

## Technical Implementation

### Components
- **TodoItem.vue**:
  - Added `isEditing` local state.
  - Added `editText` local state to track changes before saving.
  - Implemented `startEdit`, `saveEdit`, and `cancelEdit` methods.
  - Emits an `update` event instead of `toggle-todo`.

### Services
- **todoService.ts**:
  - Updated `updateTodo` to sync both `text` and `done` fields with Firestore.

### Data Model
- The `Todo` interface remains the same, but the `updateTodo` function now handles partial or full updates more comprehensively.

## Verification
- Unit tests in `TodoItem.spec.ts` cover:
  - Transition to edit mode.
  - Saving valid text.
  - Handling empty input.
  - Escape key behavior.
  - Interaction with 'done' status.
