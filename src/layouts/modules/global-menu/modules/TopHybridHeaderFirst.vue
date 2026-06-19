<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { SimpleScrollbar } from '@sa/materials';
import type { RouteKey } from '@elegant-router/types';
import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/constants/app';
import { useAppStore } from '../../../../stores/modules/app';
import { useRouteStore } from '../../../../stores/modules/route';
import { useMenu, useMixMenuContext } from '../context';
import ListGroup from '@/layouts/modules/global-menu/components/ListGroup.vue';

defineOptions({
  name: 'TopHybridHeaderFirst'
});

const route = useRoute();
const appStore = useAppStore();
const routeStore = useRouteStore();
const {
  firstLevelMenus,
  secondLevelMenus,
  activeFirstLevelMenuKey,
  handleSelectFirstLevelMenu,
  activeDeepestLevelMenuKey
} = useMixMenuContext('TopHybridHeaderFirst');
const { selectedKey } = useMenu();

const expandedKeys = ref<string[]>([]);

function handleSelectMenu(key: RouteKey) {
  handleSelectFirstLevelMenu(key);
  activeDeepestLevelMenuKey();
}

function updateExpandedKeys() {
  if (appStore.siderCollapse || !selectedKey.value) {
    expandedKeys.value = [];
    return;
  }
  expandedKeys.value = routeStore.getSelectedMenuKeyPath(selectedKey.value);
}

watch(
  () => route.name,
  () => {
    updateExpandedKeys();
  },
  { immediate: true }
);
</script>

<template>
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <div class="flex items-center h-full">
      <VBtn
        v-for="menu in firstLevelMenus"
        :key="menu.routeKey"
        variant="text"
        :prepend-icon="menu.icon"
        :active="menu.key === activeFirstLevelMenuKey"
        @click="handleSelectMenu(menu.routeKey)"
      >
        {{ menu.label }}
      </VBtn>
    </div>
  </Teleport>
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <SimpleScrollbar>
      <VList color="primary" density="comfortable" nav prepend-gap="16" indent="16">
        <template v-for="menu in secondLevelMenus" :key="menu.routeKey">
          <ListGroup v-if="menu.children" :menu="menu" />
          <VListItem
            v-else
            :prepend-icon="menu.icon"
            :value="menu.routePath"
            :title="menu.label"
            :to="menu.routePath"
          />
        </template>
      </VList>
    </SimpleScrollbar>
  </Teleport>
</template>

<style scoped></style>
