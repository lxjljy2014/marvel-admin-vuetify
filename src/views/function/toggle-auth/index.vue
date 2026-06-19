<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useLoading } from '@sa/hooks';
import { useAppStore } from '../../../stores/modules/app';
import { useAuthStore } from '../../../stores/modules/auth';
import { useTabStore } from '../../../stores/modules/tab';
import { useAuth } from '@/hooks/business/auth';
import { $t } from '@/locales';

const route = useRoute();
const appStore = useAppStore();
const authStore = useAuthStore();
const tabStore = useTabStore();
const { hasAuth } = useAuth();
const { loading, startLoading, endLoading } = useLoading();

type AccountKey = 'super' | 'admin' | 'user';

interface Account {
  key: AccountKey;
  label: string;
  userName: string;
  password: string;
}

const accounts = computed<Account[]>(() => [
  {
    key: 'super',
    label: $t('page.login.pwdLogin.superAdmin'),
    userName: 'Super',
    password: '123456'
  },
  {
    key: 'admin',
    label: $t('page.login.pwdLogin.admin'),
    userName: 'Admin',
    password: '123456'
  },
  {
    key: 'user',
    label: $t('page.login.pwdLogin.user'),
    userName: 'User',
    password: '123456'
  }
]);

const loginAccount = ref<AccountKey>('super');

async function handleToggleAccount(account: Account) {
  loginAccount.value = account.key;

  startLoading();
  await authStore.login(account.userName, account.password, false);
  tabStore.initTabStore(route);
  endLoading();
  appStore.reloadPage();
}
</script>

<template>
  <div class="flex flex-col gap-16px">
    <VCard :title="$t('route.function_toggle-auth')" :flat="true" class="card-wrapper">
      <VCardText>
        <VTable density="compact" class="w-full">
          <tbody>
            <tr>
              <td class="text-no-wrap font-medium" style="min-width: 120px">
                {{ $t('page.manage.user.userRole') }}
              </td>
              <td>
                <div class="flex gap-8px">
                  <VChip v-for="role in authStore.userInfo.roles" :key="role" size="small">{{ role }}</VChip>
                </div>
              </td>
            </tr>
            <tr>
              <td class="text-no-wrap font-medium">
                {{ $t('page.function.toggleAuth.toggleAccount') }}
              </td>
              <td>
                <div class="flex gap-8px">
                  <VBtn
                    v-for="account in accounts"
                    :key="account.key"
                    :loading="loading && loginAccount === account.key"
                    :disabled="loading && loginAccount !== account.key"
                    @click="handleToggleAccount(account)"
                  >
                    {{ account.label }}
                  </VBtn>
                </div>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCardText>
    </VCard>
    <VCard :title="$t('page.function.toggleAuth.authHook')" :flat="true" class="card-wrapper">
      <VCardText>
        <div class="flex gap-8px">
          <VBtn v-if="hasAuth('B_CODE1')">{{ $t('page.function.toggleAuth.superAdminVisible') }}</VBtn>
          <VBtn v-if="hasAuth('B_CODE2')">{{ $t('page.function.toggleAuth.adminVisible') }}</VBtn>
          <VBtn v-if="hasAuth('B_CODE3')">
            {{ $t('page.function.toggleAuth.adminOrUserVisible') }}
          </VBtn>
        </div>
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped></style>
