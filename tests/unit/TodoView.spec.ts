import { mount } from '@vue/test-utils';
import TodoView from '@/views/TodoView.vue';
import { nextTick } from 'vue';

const mockTodos = [
  { id: '1', text: 'Todo 1', done: false, color: '#ffffff' },
  { id: '2', text: 'Todo 2', done: true, color: '#ffffff' },
];

jest.mock('@/firebase', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(() =>
    Promise.resolve({
      docs: mockTodos.map((doc) => ({
        id: doc.id,
        data: () => doc,
      })),
    })
  ),
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
    // Wait for the promises to resolve
    await new Promise((resolve) => setTimeout(resolve, 0));
    // Wait for the DOM to update
    await nextTick();
    expect(wrapper.findAll('li').length).toBe(mockTodos.length);
  });
});
