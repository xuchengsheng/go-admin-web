<script lang="ts" setup>
import type { PropType } from 'vue';

import type { DictDataApi } from '#/api/system/dict';

import { defineProps } from 'vue';

import { ElButton } from 'element-plus';

defineProps({
  rowStatus: {
    type: String,
    required: true,
  },
  statusOptions: {
    type: Array as PropType<DictDataApi.DictTypesResult[]>,
    required: true,
  },
});

const filterOptions = (
  rowStatus: string,
  options: DictDataApi.DictTypesResult[],
) => {
  return options.filter((item) => item.value === rowStatus);
};
</script>

<template>
  <div>
    <ElButton
      v-for="item in filterOptions(rowStatus, statusOptions)"
      :key="item.value"
      :type="item.listClass"
      size="small"
      plain
    >
      {{ item.label }}
    </ElButton>
  </div>
</template>
