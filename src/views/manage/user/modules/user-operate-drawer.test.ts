import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import UserOperateDrawer from './user-operate-drawer.vue';

vi.mock('@/service/api', () => ({
  fetchGetAllRoles: vi.fn().mockResolvedValue({
    error: false,
    data: [
      { id: 1, roleName: 'Admin', roleCode: 'admin' },
      { id: 2, roleName: 'User', roleCode: 'user' }
    ]
  })
}));

function mountComponent(props = {}) {
  return mount(UserOperateDrawer, {
    global: {
      stubs: {
        VNavigationDrawer: {
          template: '<div><slot /><slot name="append" /></div>'
        }
      }
    },
    props: {
      operateType: 'add',
      ...props
    }
  });
}

describe('UserOperateDrawer', () => {
  it('renders correctly', () => {
    const wrapper = mountComponent();
    expect(wrapper.findComponent({ name: 'UserOperateDrawer' }).exists()).toBe(true);
  });

  it('contains form fields', () => {
    const wrapper = mountComponent({ operateType: 'add' });
    const textFields = wrapper.findAllComponents({ name: 'VTextField' });
    const radioGroups = wrapper.findAllComponents({ name: 'VRadioGroup' });
    const selects = wrapper.findAllComponents({ name: 'VSelect' });
    expect(textFields.length).toBeGreaterThanOrEqual(3);
    expect(radioGroups.length).toBeGreaterThanOrEqual(1);
    expect(selects.length).toBeGreaterThanOrEqual(1);
  });

  it('has cancel and confirm buttons', () => {
    const wrapper = mountComponent({ operateType: 'add' });
    const buttons = wrapper.findAllComponents({ name: 'VBtn' });
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it('displays title text', () => {
    const wrapper = mountComponent({ operateType: 'add' });
    expect(wrapper.text()).toBeTruthy();
  });
});
