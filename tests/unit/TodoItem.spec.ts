import { mount } from '@vue/test-utils';
import TodoItem from '@/components/TodoItem.vue';
import { nextTick } from 'vue';

describe('TodoItem.vue', () => {
  it('renders todo text', () => {
    const todo = { id: '1', text: 'Test Todo', done: false };
    const wrapper = mount(TodoItem, {
      props: { todo },
    });
    expect(wrapper.text()).toMatch('Test Todo');
  });

  it('emits update event on checkbox change', async () => {
    const todo = { id: '1', text: 'Test Todo', done: false };
    const wrapper = mount(TodoItem, {
      props: { todo },
    });
    await wrapper.find('input[type="checkbox"]').setValue(true);
    expect(wrapper.emitted('update')).toBeTruthy();
    expect(wrapper.emitted('update')![0]).toEqual([{ ...todo, done: true }]);
  });

  it('emits delete-todo event on button click', async () => {
    const todo = { id: '1', text: 'Test Todo', done: false };
    const wrapper = mount(TodoItem, {
      props: { todo },
    });
    // Click delete button (now there are multiple buttons, find by class)
    await wrapper.find('.delete-btn').trigger('click');
    expect(wrapper.emitted('delete-todo')).toBeTruthy();
  });

  it('enters edit mode when Edit button is clicked', async () => {
    const todo = { id: '1', text: 'Test Todo', done: false };
    const wrapper = mount(TodoItem, {
      props: { todo },
    });
    await wrapper.find('.edit-btn').trigger('click');
    expect(wrapper.find('.edit-input').exists()).toBe(true);
    expect((wrapper.find('.edit-input').element as HTMLInputElement).value).toBe('Test Todo');
  });

  it('emits update event when saving valid edit', async () => {
    const todo = { id: '1', text: 'Test Todo', done: false };
    const wrapper = mount(TodoItem, {
      props: { todo },
    });
    await wrapper.find('.edit-btn').trigger('click');
    const input = wrapper.find('.edit-input');
    await input.setValue('Updated Todo');
    await input.trigger('keyup.enter');
    expect(wrapper.emitted('update')).toBeTruthy();
    expect(wrapper.emitted('update')![0]).toEqual([{ ...todo, text: 'Updated Todo' }]);
    expect(wrapper.find('.edit-input').exists()).toBe(false);
  });

  it('reverts and exits edit mode when saving empty string', async () => {
    const todo = { id: '1', text: 'Test Todo', done: false };
    const wrapper = mount(TodoItem, {
      props: { todo },
    });
    await wrapper.find('.edit-btn').trigger('click');
    const input = wrapper.find('.edit-input');
    await input.setValue('   ');
    await input.trigger('keyup.enter');
    expect(wrapper.emitted('update')).toBeFalsy();
    expect(wrapper.find('.edit-input').exists()).toBe(false);
  });

  it('exits edit mode when Esc is pressed', async () => {
    const todo = { id: '1', text: 'Test Todo', done: false };
    const wrapper = mount(TodoItem, {
      props: { todo },
    });
    await wrapper.find('.edit-btn').trigger('click');
    await wrapper.find('.edit-input').trigger('keyup.esc');
    expect(wrapper.find('.edit-input').exists()).toBe(false);
  });

  it('hides edit button when todo is done', () => {
    const todo = { id: '1', text: 'Test Todo', done: true };
    const wrapper = mount(TodoItem, {
      props: { todo },
    });
    expect(wrapper.find('.edit-btn').exists()).toBe(false);
  });
});
