<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/modules/auth';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';

defineOptions({
  name: 'UserAvatar'
});

const authStore = useAuthStore();
const { routerPushByKey, toLogin } = useRouterPush();

function loginOrRegister() {
  toLogin();
}

type DropdownKey = 'logout' | 'user-center';

type DropdownOption =
  | {
      key: DropdownKey;
      label: string;
      icon?: string;
    }
  | {
      type: 'divider';
      key: string;
      icon?: string;
      label?: string;
    };

const options = computed(() => {
  const opts: DropdownOption[] = [
    {
      label: $t('common.logout'),
      key: 'logout',
      icon: 'mdi-logout'
    },
    {
      type: 'divider',
      key: 'divider'
    },
    {
      label: $t('route.user-center'),
      key: 'user-center',
      icon: 'mdi-account-circle'
    }
  ];

  return opts;
});

function logout() {
  window.$dialog?.info({
    title: $t('common.tip'),
    content: $t('common.logoutConfirm'),
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    onPositiveClick: () => {
      authStore.resetStore();
    }
  });
}

function handleDropdown(key: DropdownKey) {
  if (key === 'logout') {
    logout();
  } else {
    routerPushByKey(key as App.I18n.RouteKey);
  }
}
</script>

<template>
  <VBtn v-if="!authStore.isLogin" variant="text" height="40" @click="loginOrRegister">
    {{ $t('page.login.common.loginOrRegister') }}
  </VBtn>
  <VMenu v-else>
    <template #activator="{ props: menuProps }">
      <div v-bind="menuProps">
        <VBtn prepend-icon="mdi-account-circle" height="40" class="mr-4">
          {{ authStore.userInfo.userName }}
        </VBtn>
      </div>
    </template>
    <VList
      :items="options"
      item-props
      item-title="label"
      item-value="key"
      density="compact"
      nav
      slim
      @click:select="value => handleDropdown(value.id as DropdownKey)"
    >
      <template #prepend="{ item }">
        <VIcon :icon="item.icon" size="small"></VIcon>
      </template>
    </VList>
  </VMenu>
</template>

<style scoped></style>
