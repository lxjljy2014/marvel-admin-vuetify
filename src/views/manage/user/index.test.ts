import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import UserIndex from './index.vue';

vi.mock('@/service/api', () => ({
  fetchGetUserList: vi.fn().mockResolvedValue({
    error: false,
    data: {
      records: [
        {
          id: 1,
          userName: 'admin',
          userGender: '1',
          nickName: 'Admin',
          userPhone: '13800138000',
          userEmail: 'admin@test.com',
          status: '1',
          userRoles: ['admin'],
          createTime: '2024-01-01'
        }
      ],
      current: 1,
      size: 10,
      total: 1
    }
  })
}));

vi.mock('@/stores/modules/tab', () => ({
  useTabStore: vi.fn(() => ({
    activeTab: '',
    addTab: vi.fn(),
    removeTab: vi.fn(),
    setActiveTab: vi.fn()
  }))
}));

vi.mock('@/hooks/common/router', () => ({
  useRouterPush: vi.fn(() => ({
    routerPush: vi.fn(),
    routerBack: vi.fn(),
    routerReplace: vi.fn()
  }))
}));

function mountComponent() {
  return mount(UserIndex, {
    global: {
      stubs: {
        UserSearch: true,
        UserOperateDrawer: true,
        TableHeaderOperation: true,
        TableColumnSetting: true
      }
    }
  });
}

describe('UserIndex', () => {
  it('renders VCard component', () => {
    const wrapper = mountComponent();
    expect(wrapper.findComponent({ name: 'VCard' }).exists()).toBe(true);
  });

  it('contains VDataTable', () => {
    const wrapper = mountComponent();
    expect(wrapper.findComponent({ name: 'VDataTable' }).exists()).toBe(true);
  });

  it('contains UserSearch component', () => {
    const wrapper = mountComponent();
    expect(wrapper.findComponent({ name: 'UserSearch' }).exists()).toBe(true);
  });

  it('contains UserOperateDrawer component', () => {
    const wrapper = mountComponent();
    expect(wrapper.findComponent({ name: 'UserOperateDrawer' }).exists()).toBe(true);
  });

  it('has delete confirmation dialog', () => {
    const wrapper = mountComponent();
    const dialogs = wrapper.findAllComponents({ name: 'VDialog' });
    expect(dialogs.length).toBeGreaterThanOrEqual(1);
  });
});
