<script setup lang="ts">
defineOptions({ name: 'ListGroup' });

interface Props {
  menu: App.Global.Menu;
}

defineProps<Props>();
</script>

<template>
  <VListGroup :value="menu.routePath">
    <template #activator="{ props }">
      <VListItem v-bind="props" :prepend-icon="menu.icon" :title="menu.label"></VListItem>
    </template>
    <template v-for="child in menu.children" :key="child.routeKey">
      <ListGroup v-if="child.children" :menu="child" />
      <VListItem
        v-else
        :prepend-icon="child.icon"
        :value="child.routePath"
        :title="child.label"
        :to="child.routePath"
      ></VListItem>
    </template>
  </VListGroup>
</template>

<style scoped></style>
