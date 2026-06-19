<script lang="ts" setup>
import { computed, ref } from 'vue';

defineOptions({ name: 'CustomIconSelect' });

interface Props {
  value: string;
  icons: string[];
  emptyIcon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  emptyIcon: 'mdi:apps'
});

interface Emits {
  (e: 'update:value', val: string): void;
}

const emit = defineEmits<Emits>();

const modelValue = computed({
  get() {
    return props.value;
  },
  set(val: string) {
    emit('update:value', val);
  }
});

const selectedIcon = computed(() => modelValue.value || props.emptyIcon);

const searchValue = ref('');

const menuVisible = ref(false);

const iconsList = computed(() => props.icons.filter(v => v.includes(searchValue.value)));

function handleChange(iconItem: string) {
  modelValue.value = iconItem;
  menuVisible.value = false;
}
</script>

<template>
  <VMenu v-model="menuVisible" :close-on-content-click="false" location="bottom end">
    <template #activator="{ props: menuProps }">
      <VTextField
        v-bind="menuProps"
        v-model="modelValue"
        readonly
        placeholder="点击选择图标"
        variant="outlined"
        density="comfortable"
        hide-details
      >
        <template #append-inner>
          <SvgIcon :icon="selectedIcon" class="p-5px text-30px" />
        </template>
      </VTextField>
    </template>
    <VCard min-width="306">
      <VCardText>
        <VTextField v-model="searchValue" placeholder="搜索图标" variant="outlined" density="compact" hide-details />
      </VCardText>
      <VCardText class="max-h-300px overflow-auto">
        <div v-if="iconsList.length > 0" class="grid grid-cols-9">
          <span v-for="iconItem in iconsList" :key="iconItem" @click="handleChange(iconItem)">
            <SvgIcon
              :icon="iconItem"
              class="m-2px cursor-pointer border-1px border-#d9d9d9 p-5px text-30px"
              :class="{ 'border-primary': modelValue === iconItem }"
            />
          </span>
        </div>
        <div v-else class="py-4 text-center text-gray-400">你什么也找不到</div>
      </VCardText>
    </VCard>
  </VMenu>
</template>
