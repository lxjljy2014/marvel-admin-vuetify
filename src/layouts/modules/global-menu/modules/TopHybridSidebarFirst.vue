<script setup lang="ts">
import type { RouteKey } from '@elegant-router/types';
import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/constants/app';
import { useAppStore } from '../../../../stores/modules/app';
import { useThemeStore } from '../../../../stores/modules/theme';
import { useRouterPush } from '@/hooks/common/router';
import FirstLevelMenu from '../components/FirstLevelMenu.vue';
import { useMenu, useMixMenuContext } from '../context';
import ListGroup from '@/layouts/modules/global-menu/components/ListGroup.vue';

defineOptions({
  name: 'TopHybridSidebarFirst'
});

const appStore = useAppStore();
const themeStore = useThemeStore();
const { routerPushByKeyWithMetaQuery } = useRouterPush();
const {
  firstLevelMenus,
  secondLevelMenus,
  activeFirstLevelMenuKey,
  handleSelectFirstLevelMenu,
  activeDeepestLevelMenuKey
} = useMixMenuContext('TopHybridSidebarFirst');
const { selectedKey } = useMenu();

function handleSelectMenu(key: RouteKey) {
  handleSelectFirstLevelMenu(key);
  activeDeepestLevelMenuKey();
}

function isMenuActive(menu: App.Global.Menu): boolean {
  if (menu.routeKey === selectedKey.value) return true;
  return menu.children?.some(child => isMenuActive(child)) ?? false;
}
</script>

<template>
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <div class="flex items-center h-full">
      <template v-for="menu in secondLevelMenus" :key="menu.routeKey">
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
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <div class="h-full pt-2">
      <FirstLevelMenu
        :menus="firstLevelMenus"
        :active-menu-key="activeFirstLevelMenuKey"
        :sider-collapse="appStore.siderCollapse"
        :dark-mode="themeStore.darkMode"
        :theme-color="themeStore.themeColor"
        @select="handleSelectMenu"
        @toggle-sider-collapse="appStore.toggleSiderCollapse"
      />
    </div>
  </Teleport>
</template>

<style scoped></style>
