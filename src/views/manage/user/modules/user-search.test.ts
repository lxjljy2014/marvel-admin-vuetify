import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import UserSearch from './user-search.vue';

function mountComponent() {
  const model = {
    current: 1,
    size: 10,
    status: null,
    userName: null,
    userGender: null,
    nickName: null,
    userPhone: null,
    userEmail: null
  };

  const wrapper = mount(UserSearch, {
    props: {
      model
    }
  });

  return { wrapper, model };
}

describe('UserSearch', () => {
  it('renders correctly', () => {
    const { wrapper } = mountComponent();
    expect(wrapper.findComponent({ name: 'UserSearch' }).exists()).toBe(true);
  });

  it('contains form fields', () => {
    const { wrapper } = mountComponent();
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    const selects = wrapper.findAllComponents({ name: 'VSelect' });
    expect(textFields.length + selects.length).toBeGreaterThanOrEqual(6);
  });

  it('has search and reset buttons', () => {
    const { wrapper } = mountComponent();
    const buttons = wrapper.findAllComponents({ name: 'VBtn' });
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });
});
