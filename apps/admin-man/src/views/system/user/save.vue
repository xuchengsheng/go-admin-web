<script lang="ts" setup>
import type { DictDataApi } from '#/api/system/dict';

import { onMounted, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { configKey } from '#/api/system/config';
import { deptTree } from '#/api/system/dept';
import { getDictTypes } from '#/api/system/dict';
import { allPost } from '#/api/system/post';
import { allRole } from '#/api/system/role';
import { getUser, insertUser, updateUser } from '#/api/system/user';
import { $t } from '#/locales';

const { userId } = defineProps<{
  userId: number | undefined;
}>();

const emit = defineEmits(['success']);

const statusOptions = ref<DictDataApi.DictTypesResult[]>([]);
const initPassword = ref<string>();

onMounted(async () => {
  statusOptions.value = await getDictTypes('sys_normal_disable');
  initPassword.value = await configKey('sys.user.initPassword');
});

const [Form, formApi] = useVbenForm({
  wrapperClass: 'lg:grid-cols-2',
  showDefaultActions: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'userId',
      dependencies: {
        show: false,
        triggerFields: ['userName'],
      },
    },
    {
      component: 'Input',
      fieldName: 'userName',
      label: $t('user.label.userName'),
      rules: 'required',
      labelWidth: 80,
      componentProps: { placeholder: $t('user.placeholder.userName') },
    },
    {
      component: 'Input',
      fieldName: 'password',
      label: $t('user.label.password'),
      rules: 'required',
      labelWidth: 80,
      defaultValue: initPassword,
      componentProps: {
        placeholder: $t('user.placeholder.password'),
        type: 'password',
        show: false,
      },
    },
    {
      component: 'Input',
      fieldName: 'nickName',
      label: $t('user.label.nickName'),
      rules: 'required',
      labelWidth: 80,
      componentProps: { placeholder: $t('user.placeholder.nickName') },
    },
    {
      component: 'ApiTreeSelect',
      fieldName: 'deptId',
      label: $t('user.label.deptName'),
      labelWidth: 80,
      componentProps: {
        labelField: 'label',
        valueField: 'id',
        class: 'w-full',
        childrenField: 'children',
        checkStrictly: true,
        api: deptTree,
        placeholder: $t('user.placeholder.deptName'),
      },
    },
    {
      component: 'Input',
      fieldName: 'phonenumber',
      label: $t('dept.label.phone'),
      labelWidth: 80,
      componentProps: { placeholder: $t('dept.placeholder.phone') },
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: $t('dept.label.email'),
      labelWidth: 80,
      componentProps: { placeholder: $t('dept.placeholder.email') },
    },
    {
      component: 'RadioGroup',
      fieldName: 'status',
      label: $t('user.label.status'),
      rules: 'selectRequired',
      labelWidth: 80,
      componentProps: {
        options: statusOptions,
        placeholder: $t('user.placeholder.status'),
      },
    },
    {
      component: 'ApiSelect',
      fieldName: 'sex',
      label: $t('user.label.sex'),
      labelWidth: 80,
      componentProps: {
        class: 'w-full',
        api: () => getDictTypes('sys_user_sex'),
        placeholder: $t('user.placeholder.sex'),
      },
    },
    {
      component: 'ApiSelect',
      fieldName: 'postIds',
      label: $t('user.label.post'),
      labelWidth: 80,
      componentProps: {
        class: 'w-full',
        afterFetch: (data: { postId: string; postName: string }[]) => {
          return data.map((item: any) => ({
            label: item.postName,
            value: item.postId,
          }));
        },
        api: () => allPost(),
        placeholder: $t('user.placeholder.post'),
        multiple: true,
      },
    },
    {
      component: 'ApiSelect',
      fieldName: 'roleIds',
      label: $t('user.label.role'),
      labelWidth: 80,
      componentProps: {
        class: 'w-full',
        afterFetch: (data: { roleId: string; roleName: string }[]) => {
          return data.map((item: any) => ({
            label: item.roleName,
            value: item.roleId,
          }));
        },
        api: () => allRole(),
        placeholder: $t('user.placeholder.role'),
        multiple: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'remark',
      label: $t('user.label.remark'),
      labelWidth: 80,
      formItemClass: 'col-span-2 items-baseline',
      componentProps: {
        type: 'textarea',
        placeholder: $t('user.placeholder.remark'),
      },
    },
  ],
});

watch(
  () => userId,
  async (newUserId) => {
    if (newUserId) {
      formApi.setValues(await getUser(newUserId));
    }
  },
);

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const params = await formApi.getValues();
    const { userId, ...restParams } = params;
    const action = userId ? updateUser : insertUser;
    await action(userId ? { userId, ...restParams } : { ...restParams });
    ElMessage.success($t('user.tip.addSuccess'));
    modalApi.close();
    emit('success');
  },
});
</script>
<template>
  <Modal class="w-[720px]" :title="$t('user.title.addUser')">
    <Form />
  </Modal>
</template>
