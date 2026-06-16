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
    <VBreadcrumbsItem
      v-for="item in routeStore.breadcrumbs"
      :key="item.key"
      :disabled="!item.options?.length"
      class="cursor-pointer"
    >
      <VMenu v-if="item.options?.length" offset-y>
        <template #activator="{ props: menuProps }">
          <div class="flex items-center" v-bind="menuProps">
            <component :is="item.icon" v-if="themeStore.header.breadcrumb.showIcon" class="text-icon mr-1" />
            <span>{{ item.label }}</span>
          </div>
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
        <component :is="item.icon" v-if="themeStore.header.breadcrumb.showIcon" class="text-icon mr-1" />
        <span>{{ item.label }}</span>
      </div>
    </VBreadcrumbsItem>
  </VBreadcrumbs>
</template>

<style scoped></style>
