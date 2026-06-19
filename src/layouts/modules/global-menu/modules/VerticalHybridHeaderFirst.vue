<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { RouteKey } from '@elegant-router/types';
import { SimpleScrollbar } from '@sa/materials';
import { useBoolean } from '@sa/hooks';
import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/constants/app';
import { useAppStore } from '../../../../stores/modules/app';
import { useThemeStore } from '../../../../stores/modules/theme';
import { useRouteStore } from '../../../../stores/modules/route';
import { useMenu, useMixMenuContext } from '../context';
import FirstLevelMenu from '../components/FirstLevelMenu.vue';
import GlobalLogo from '../../global-logo/index.vue';
import ListGroup from '@/layouts/modules/global-menu/components/ListGroup.vue';

defineOptions({
  name: 'VerticalHybridHeaderFirst'
});

const route = useRoute();
const appStore = useAppStore();
const themeStore = useThemeStore();
const routeStore = useRouteStore();
const { bool: drawerVisible, setBool: setDrawerVisible } = useBoolean();
const {
  firstLevelMenus,
  activeFirstLevelMenuKey,
  handleSelectFirstLevelMenu,
  getActiveFirstLevelMenuKey,
  secondLevelMenus,
  activeSecondLevelMenuKey,
  isActiveSecondLevelMenuHasChildren,
  handleSelectSecondLevelMenu,
  getActiveSecondLevelMenuKey,
  childLevelMenus,
  hasChildLevelMenus,
  activeDeepestLevelMenuKey
} = useMixMenuContext('VerticalHybridHeaderFirst');
const { selectedKey } = useMenu();

const inverted = computed(() => !themeStore.darkMode && themeStore.sider.inverted);

const showDrawer = computed(() => hasChildLevelMenus.value && (drawerVisible.value || appStore.mixSiderFixed));

function handleSelectMixMenu(key: RouteKey) {
  handleSelectSecondLevelMenu(key);

  if (isActiveSecondLevelMenuHasChildren.value) {
    setDrawerVisible(true);
  }
}

function handleSelectMenu(key: RouteKey) {
  handleSelectFirstLevelMenu(key);

  if (secondLevelMenus.value.length === 0) return;

  const secondFirstMenuKey = secondLevelMenus.value[0].routeKey;

  if (!themeStore.sider.autoSelectFirstMenu) {
    const hasChildren = secondLevelMenus.value.find(menu => menu.key === secondFirstMenuKey)?.children?.length;

    if (hasChildren) {
      handleSelectMixMenu(secondFirstMenuKey);
    }
    return;
  }

  activeDeepestLevelMenuKey();
  setDrawerVisible(false);
}

function handleResetActiveMenu() {
  setDrawerVisible(false);

  if (!appStore.mixSiderFixed) {
    getActiveFirstLevelMenuKey();
    getActiveSecondLevelMenuKey();
  }
}

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
    <div class="h-full flex" @mouseleave="handleResetActiveMenu">
      <FirstLevelMenu
        :menus="secondLevelMenus"
        :active-menu-key="activeSecondLevelMenuKey"
        :inverted="inverted"
        :sider-collapse="appStore.siderCollapse"
        :dark-mode="themeStore.darkMode"
        :theme-color="themeStore.themeColor"
        @select="handleSelectMixMenu"
        @toggle-sider-collapse="appStore.toggleSiderCollapse"
      >
        <GlobalLogo :show-title="false" :style="{ height: themeStore.header.height + 'px' }" />
      </FirstLevelMenu>
      <div
        class="relative h-full transition-width-300"
        :style="{
          width: appStore.mixSiderFixed && hasChildLevelMenus ? themeStore.sider.mixChildMenuWidth + 'px' : '0px'
        }"
      >
        <DarkModeContainer
          class="absolute-lt h-full flex-col-stretch nowrap-hidden shadow-sm transition-all-300"
          :inverted="inverted"
          :style="{ width: showDrawer ? themeStore.sider.mixChildMenuWidth + 'px' : '0px' }"
        >
          <header class="flex-y-center justify-between px-12px" :style="{ height: themeStore.header.height + 'px' }">
            <h2 class="text-16px text-primary font-bold">{{ $t('system.title') }}</h2>
            <PinToggler
              :pin="appStore.mixSiderFixed"
              :class="{ 'text-white:88 !hover:text-white': inverted }"
              @click="appStore.toggleMixSiderFixed"
            />
          </header>
          <SimpleScrollbar>
            <VList color="primary" density="comfortable" nav prepend-gap="16" indent="16">
              <template v-for="menu in childLevelMenus" :key="menu.routeKey">
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
        </DarkModeContainer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped></style>
