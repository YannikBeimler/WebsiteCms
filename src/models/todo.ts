export type TodoColor =
  | '#ffffff'
  | '#ffcdd2'
  | '#c8e6c9'
  | '#bbdefb'
  | '#fff9c4';

export interface Todo {
  id: string;
  text: string;
  done: boolean;
  color: TodoColor;
}
