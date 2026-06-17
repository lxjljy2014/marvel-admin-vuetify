<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';

defineOptions({
  name: 'LangSwitch'
});

interface Props {
  /** Current language */
  lang: App.I18n.LangType;
  /** Language options */
  langOptions: App.I18n.LangOption[];
  /** Show tooltip */
  showTooltip?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showTooltip: true
});

type Emits = {
  (e: 'changeLang', lang: App.I18n.LangType): void;
};

const emit = defineEmits<Emits>();

const tooltipContent = computed(() => {
  if (!props.showTooltip) return '';

  return $t('icon.lang');
});

function changeLang(lang: App.I18n.LangType) {
  emit('changeLang', lang);
}

function handleActivate(value: { id: unknown }) {
  changeLang(value.id as App.I18n.LangType);
}
</script>

<template>
  <VMenu location="bottom end">
    <template #activator="{ props: menuProps }">
      <ButtonIcon
        v-bind="menuProps"
        :tooltip-content="tooltipContent"
        tooltip-placement="left"
        icon="mdi-translate"
      ></ButtonIcon>
    </template>
    <VList
      :items="langOptions"
      activatable
      :activated="[lang]"
      item-props
      item-value="key"
      item-title="label"
      color="primary"
      density="compact"
      nav
      slim
      @click:activate="handleActivate"
    ></VList>
  </VMenu>
</template>

<style scoped></style>
