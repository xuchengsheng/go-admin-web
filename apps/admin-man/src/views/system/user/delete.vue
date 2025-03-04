<script lang="ts" setup>
import type { UserApi } from '#/api/system/user';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { deleteUser } from '#/api/system/user';
import { $t } from '#/locales';

const { user } = defineProps<{
  user: null | UserApi.UserResult;
}>();

const emit = defineEmits(['success']);

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  async onConfirm() {
    await deleteUser(user?.userId!);
    ElMessage.success($t('user.tip.delSuccess'));
    modalApi.close();
    emit('success');
  },
});
</script>
<template>
  <Modal :title="$t('user.title.delUser')">
    {{ $t('base.delConfirm', { name: user?.userName }) }}
  </Modal>
</template>
