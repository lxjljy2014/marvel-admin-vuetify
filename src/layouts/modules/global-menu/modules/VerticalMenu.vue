<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { SimpleScrollbar } from '@sa/materials';
import { GLOBAL_SIDER_MENU_ID } from '@/constants/app';
import { useAppStore } from '@/stores/modules/app';
import { useRouteStore } from '@/stores/modules/route';
import { useMenu } from '../context';
import ListGroup from '@/layouts/modules/global-menu/components/ListGroup.vue';

defineOptions({
  name: 'VerticalMenu'
});

const route = useRoute();
const appStore = useAppStore();
const routeStore = useRouteStore();
const { selectedKey } = useMenu();

const expandedKeys = ref<string[]>([]);

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
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <VList color="primary" density="comfortable" nav prepend-gap="16" indent="16">
      <template v-for="menu in routeStore.menus" :key="menu.routeKey">
        <ListGroup v-if="menu.children" :menu="menu" />
        <VListItem
          v-else
          :prepend-icon="menu.icon"
          :value="menu.routePath"
          :title="menu.label"
          :to="menu.routePath"
        ></VListItem>
      </template>
    </VList>
  </Teleport>
</template>

<style scoped></style>
