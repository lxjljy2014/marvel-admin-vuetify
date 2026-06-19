<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '../../stores/modules/app';
import { $t } from '@/locales';
import pkg from '~/package.json';

const appStore = useAppStore();

const column = computed(() => (appStore.isMobile ? 1 : 2));

interface PkgJson {
  name: string;
  version: string;
  dependencies: PkgVersionInfo[];
  devDependencies: PkgVersionInfo[];
}

interface PkgVersionInfo {
  name: string;
  version: string;
}

const { name, version, dependencies, devDependencies } = pkg;

function transformVersionData(tuple: [string, string]): PkgVersionInfo {
  const [$name, $version] = tuple;
  return {
    name: $name,
    version: $version
  };
}

const pkgJson: PkgJson = {
  name,
  version,
  dependencies: Object.entries(dependencies).map(item => transformVersionData(item)),
  devDependencies: Object.entries(devDependencies).map(item => transformVersionData(item))
};

const latestBuildTime = BUILD_TIME;
</script>

<template>
  <div class="flex flex-col gap-16px">
    <VCard :title="$t('page.about.title')" :flat="true" class="card-wrapper">
      <VCardText>
        <p>{{ $t('page.about.introduction') }}</p>
      </VCardText>
    </VCard>
    <VCard :title="$t('page.about.projectInfo.title')" :flat="true" class="card-wrapper">
      <VCardText>
        <VTable density="compact" class="w-full">
          <tbody>
            <tr>
              <td class="text-no-wrap font-medium" style="min-width: 140px">
                {{ $t('page.about.projectInfo.version') }}
              </td>
              <td>
                <VChip color="primary" size="small">{{ pkgJson.version }}</VChip>
              </td>
            </tr>
            <tr>
              <td class="text-no-wrap font-medium">
                {{ $t('page.about.projectInfo.latestBuildTime') }}
              </td>
              <td>
                <VChip color="primary" size="small">{{ latestBuildTime }}</VChip>
              </td>
            </tr>
            <tr>
              <td class="text-no-wrap font-medium">
                {{ $t('page.about.projectInfo.githubLink') }}
              </td>
              <td>
                <a class="text-primary" :href="pkg.homepage" target="_blank" rel="noopener noreferrer">
                  {{ $t('page.about.projectInfo.githubLink') }}
                </a>
              </td>
            </tr>
            <tr>
              <td class="text-no-wrap font-medium">
                {{ $t('page.about.projectInfo.previewLink') }}
              </td>
              <td>
                <a class="text-primary" :href="pkg.website" target="_blank" rel="noopener noreferrer">
                  {{ $t('page.about.projectInfo.previewLink') }}
                </a>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCardText>
    </VCard>
    <VCard :title="$t('page.about.prdDep')" :flat="true" class="card-wrapper">
      <VCardText>
        <VTable density="compact" class="w-full">
          <tbody>
            <template v-for="(item, index) in pkgJson.dependencies" :key="item.name">
              <tr v-if="column === 1 || index % 2 === 0">
                <td class="text-no-wrap font-medium" style="min-width: 140px">
                  {{ item.name }}
                </td>
                <td>{{ item.version }}</td>
                <template v-if="column === 2 && pkgJson.dependencies[index + 1]">
                  <td class="text-no-wrap font-medium" style="min-width: 140px">
                    {{ pkgJson.dependencies[index + 1].name }}
                  </td>
                  <td>{{ pkgJson.dependencies[index + 1].version }}</td>
                </template>
              </tr>
            </template>
          </tbody>
        </VTable>
      </VCardText>
    </VCard>
    <VCard :title="$t('page.about.devDep')" :flat="true" class="card-wrapper">
      <VCardText>
        <VTable density="compact" class="w-full">
          <tbody>
            <template v-for="(item, index) in pkgJson.devDependencies" :key="item.name">
              <tr v-if="column === 1 || index % 2 === 0">
                <td class="text-no-wrap font-medium" style="min-width: 140px">
                  {{ item.name }}
                </td>
                <td>{{ item.version }}</td>
                <template v-if="column === 2 && pkgJson.devDependencies[index + 1]">
                  <td class="text-no-wrap font-medium" style="min-width: 140px">
                    {{ pkgJson.devDependencies[index + 1].name }}
                  </td>
                  <td>{{ pkgJson.devDependencies[index + 1].version }}</td>
                </template>
              </tr>
            </template>
          </tbody>
        </VTable>
      </VCardText>
    </VCard>
  </div>
</template>
