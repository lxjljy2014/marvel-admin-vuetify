<script setup lang="ts">
import { useThemeStore } from '@/stores/modules/theme';
import { useRouteStore } from '@/stores/modules/route';

defineOptions({
  name: 'GlobalBreadcrumb'
});

const themeStore = useThemeStore();
const routeStore = useRouteStore();
</script>

<template>
  <VBreadcrumbs v-if="themeStore.header.breadcrumb.visible" density="compact" class="pa-0">
    <VBreadcrumbsItem v-for="(item, index) in routeStore.breadcrumbs" :key="item.key" class="cursor-pointer">
      <VMenu v-if="item.options?.length" offset-y open-on-hover>
        <template #activator="{ props: menuProps }">
          <VBtn v-bind="menuProps" variant="plain" size="small" class="text-14px">
            <template #prepend>
              <component
                :is="item.icon"
                v-if="themeStore.header.breadcrumb.showIcon"
                class="text-icon mr-1 align-text-top text-20px!"
              />
            </template>
            {{ item.label }}
          </VBtn>
        </template>
        <VList density="compact" nav prepend-gap="16" color="primary">
          <VListItem v-for="option in item.options" :key="option.key" :to="option.routePath">
            <template v-if="option.icon" #prepend>
              <VIcon :icon="option.icon" />
            </template>
            <VListItemTitle>{{ option.label }}</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <div v-else class="flex items-center">
        <component :is="item.icon" v-if="themeStore.header.breadcrumb.showIcon" class="text-icon mr-1 text-20px!" />
        <span class="text-14px">{{ item.label }}</span>
      </div>
      <VBreadcrumbsDivider v-if="index !== routeStore.breadcrumbs.length - 1" />
    </VBreadcrumbsItem>
  </VBreadcrumbs>
</template>

<style scoped></style>
