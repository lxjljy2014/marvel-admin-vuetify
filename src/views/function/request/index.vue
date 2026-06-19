<script setup lang="ts">
import { fetchCustomBackendError } from '@/service/api';
import { $t } from '@/locales';

async function logout() {
  await fetchCustomBackendError('8888', $t('request.logoutMsg'));
}

async function logoutWithModal() {
  await fetchCustomBackendError('7777', $t('request.logoutWithModalMsg'));
}

async function refreshToken() {
  await fetchCustomBackendError('9999', $t('request.tokenExpired'));
}

async function handleRepeatedMessageError() {
  await Promise.all([
    fetchCustomBackendError('2222', $t('page.function.request.repeatedErrorMsg1')),
    fetchCustomBackendError('2222', $t('page.function.request.repeatedErrorMsg1')),
    fetchCustomBackendError('2222', $t('page.function.request.repeatedErrorMsg1')),
    fetchCustomBackendError('3333', $t('page.function.request.repeatedErrorMsg2')),
    fetchCustomBackendError('3333', $t('page.function.request.repeatedErrorMsg2')),
    fetchCustomBackendError('3333', $t('page.function.request.repeatedErrorMsg2'))
  ]);
}

async function handleRepeatedModalError() {
  await Promise.all([
    fetchCustomBackendError('7777', $t('request.logoutWithModalMsg')),
    fetchCustomBackendError('7777', $t('request.logoutWithModalMsg')),
    fetchCustomBackendError('7777', $t('request.logoutWithModalMsg'))
  ]);
}
</script>

<template>
  <div class="flex flex-col gap-16px">
    <VCard :title="$t('request.logout')" :flat="true" class="card-wrapper">
      <VCardText>
        <VBtn @click="logout">{{ $t('common.trigger') }}</VBtn>
      </VCardText>
    </VCard>
    <VCard :title="$t('request.logoutWithModal')" :flat="true" class="card-wrapper">
      <VCardText>
        <VBtn @click="logoutWithModal">{{ $t('common.trigger') }}</VBtn>
      </VCardText>
    </VCard>
    <VCard :title="$t('request.refreshToken')" :flat="true" class="card-wrapper">
      <VCardText>
        <VBtn @click="refreshToken">{{ $t('common.trigger') }}</VBtn>
      </VCardText>
    </VCard>
    <VCard :title="$t('page.function.request.repeatedErrorOccurOnce')" :flat="true" class="card-wrapper">
      <VCardText>
        <VBtn @click="handleRepeatedMessageError">{{ $t('page.function.request.repeatedError') }}(Message)</VBtn>
        <VBtn class="ml-12px" @click="handleRepeatedModalError">
          {{ $t('page.function.request.repeatedError') }}(Modal)
        </VBtn>
      </VCardText>
    </VCard>
  </div>
</template>
