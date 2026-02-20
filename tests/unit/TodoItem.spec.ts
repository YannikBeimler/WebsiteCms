import { mount } from '@vue/test-utils';
import TodoItem from '@/components/TodoItem.vue';

describe('TodoItem.vue', () => {
  const defaultTodo = {
    id: '1',
    text: 'Test Todo',
    done: false,
    color: '#ffffff' as const,
  };

  it('renders todo text', () => {
    const wrapper = mount(TodoItem, {
      props: { todo: defaultTodo },
    });
    expect(wrapper.text()).toMatch('Test Todo');
  });

  it('applies background color', () => {
    const todo = { ...defaultTodo, color: '#ffcdd2' as const };
    const wrapper = mount(TodoItem, {
      props: { todo },
    });
    expect((wrapper.element as HTMLElement).style.backgroundColor).toBe(
      'rgb(255, 205, 210)'
    );
  });

  it('emits update event on checkbox change', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo: defaultTodo },
    });
    await wrapper.find('input[type="checkbox"]').setValue(true);
    const emitted = wrapper.emitted('update');
    expect(emitted).toBeTruthy();
    expect(emitted?.[0]).toEqual([{ ...defaultTodo, done: true }]);
  });

  it('emits delete-todo event on button click', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo: defaultTodo },
    });
    await wrapper.find('.delete-btn').trigger('click');
    expect(wrapper.emitted('delete-todo')).toBeTruthy();
  });

  it('enters edit mode and shows color picker', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo: defaultTodo },
    });
    await wrapper.find('.edit-btn').trigger('click');
    expect(wrapper.find('.edit-input').exists()).toBe(true);
    expect(wrapper.find('.color-picker').exists()).toBe(true);
  });

  it('emits update event when color is selected', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo: defaultTodo },
    });
    await wrapper.find('.edit-btn').trigger('click');
    const colorOptions = wrapper.findAll('.color-option');
    // Find the red one (#ffcdd2) which is index 1
    await colorOptions[1].trigger('mousedown');
    const emitted = wrapper.emitted('update');
    expect(emitted).toBeTruthy();
    expect(emitted?.[0]).toEqual([{ ...defaultTodo, color: '#ffcdd2' }]);
  });

  it('emits update event when saving valid edit', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo: defaultTodo },
    });
    await wrapper.find('.edit-btn').trigger('click');
    const input = wrapper.find('.edit-input');
    await input.setValue('Updated Todo');
    await input.trigger('keyup.enter');
    const emitted = wrapper.emitted('update');
    expect(emitted).toBeTruthy();
    expect(emitted?.[0]).toEqual([{ ...defaultTodo, text: 'Updated Todo' }]);
  });
});
