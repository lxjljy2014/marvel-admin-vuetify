<script setup lang="ts">
import { GLOBAL_HEADER_MENU_ID } from '@/constants/app';
import { useRouteStore } from '../../../../stores/modules/route';
import { useRouterPush } from '@/hooks/common/router';
import { useMenu } from '../context';
import ListGroup from '@/layouts/modules/global-menu/components/ListGroup.vue';

defineOptions({
  name: 'HorizontalMenu'
});

const routeStore = useRouteStore();
const { routerPushByKeyWithMetaQuery } = useRouterPush();
const { selectedKey } = useMenu();

function isMenuActive(menu: App.Global.Menu): boolean {
  if (menu.routeKey === selectedKey.value) return true;
  return menu.children?.some(child => isMenuActive(child)) ?? false;
}
</script>

<template>
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <div class="flex items-center h-full">
      <template v-for="menu in routeStore.menus" :key="menu.routeKey">
        <VMenu v-if="menu.children" open-on-hover close-on-content-click>
          <template #activator="{ props: activatorProps }">
            <VBtn v-bind="activatorProps" variant="text" :prepend-icon="menu.icon" :active="isMenuActive(menu)">
              {{ menu.label }}
              <VIcon end size="x-small">mdi-chevron-down</VIcon>
            </VBtn>
          </template>
          <VList density="compact" nav>
            <template v-for="child in menu.children" :key="child.routeKey">
              <ListGroup v-if="child.children" :menu="child" />
              <VListItem
                v-else
                :prepend-icon="child.icon"
                :value="child.routePath"
                :title="child.label"
                :to="child.routePath"
              />
            </template>
          </VList>
        </VMenu>
        <VBtn
          v-else
          variant="text"
          :prepend-icon="menu.icon"
          :active="isMenuActive(menu)"
          @click="routerPushByKeyWithMetaQuery(menu.routeKey)"
        >
          {{ menu.label }}
        </VBtn>
      </template>
    </div>
  </Teleport>
</template>

<style scoped></style>
