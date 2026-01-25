import { mount } from '@vue/test-utils';
import TodoView from '@/views/TodoView.vue';
import { nextTick } from 'vue';

const mockTodos = [
  { id: '1', text: 'Todo 1', done: false },
  { id: '2', text: 'Todo 2', done: true },
];

jest.mock('@/firebase', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  onSnapshot: jest.fn((_, callback) => {
    const snapshot = {
      docs: mockTodos.map((doc) => ({
        id: doc.id,
        data: () => doc,
      })),
    };
    callback(snapshot);
    return jest.fn();
  }),
  addDoc: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
}));

describe('TodoView.vue', () => {
  it('renders a list of todos', async () => {
    const wrapper = mount(TodoView);
    await nextTick();
    expect(wrapper.findAll('li').length).toBe(mockTodos.length);
  });
});
