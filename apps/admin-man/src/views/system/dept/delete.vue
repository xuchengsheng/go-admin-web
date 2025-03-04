<script lang="ts" setup>
import type { DeptApi } from '#/api/system/dept';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { deleteDept } from '#/api/system/dept';
import { $t } from '#/locales';

const { dept } = defineProps<{
  dept: DeptApi.DeptResult | null;
}>();

const emit = defineEmits(['success']);

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  async onConfirm() {
    await deleteDept(dept?.deptId!);
    ElMessage.success($t('dept.tip.delSuccess'));
    modalApi.close();
    emit('success');
  },
});
</script>
<template>
  <Modal :title="$t('dept.title.delDept')">
    {{ $t('base.delConfirm', { name: dept?.deptName }) }}
  </Modal>
</template>
