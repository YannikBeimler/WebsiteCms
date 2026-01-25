import { mount } from '@vue/test-utils';
import TodoItem from '@/components/TodoItem.vue';

describe('TodoItem.vue', () => {
  it('renders todo text', () => {
    const todo = { id: '1', text: 'Test Todo', done: false };
    const wrapper = mount(TodoItem, {
      props: { todo },
    });
    expect(wrapper.text()).toMatch('Test Todo');
  });

  it('emits toggle-todo event on checkbox change', async () => {
    const todo = { id: '1', text: 'Test Todo', done: false };
    const wrapper = mount(TodoItem, {
      props: { todo },
    });
    await wrapper.find('input[type="checkbox"]').setValue(true);
    expect(wrapper.emitted('toggle-todo')).toBeTruthy();
  });

  it('emits delete-todo event on button click', async () => {
    const todo = { id: '1', text: 'Test Todo', done: false };
    const wrapper = mount(TodoItem, {
      props: { todo },
    });
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('delete-todo')).toBeTruthy();
  });
});
