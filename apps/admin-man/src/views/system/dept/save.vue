<script lang="ts" setup>
import type { DeptApi } from '#/api/system/dept';
import type { DictDataApi } from '#/api/system/dict';

import { watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { deptTree, insertDept, updateDept } from '#/api/system/dept';
import { $t } from '#/locales';

const { dept, statusOptions } = defineProps<{
  dept: DeptApi.DeptResult | null;
  statusOptions: DictDataApi.DictTypesResult[];
}>();

const emit = defineEmits(['success']);

const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'deptId',
      dependencies: {
        show: false,
        triggerFields: ['deptName'],
      },
    },
    {
      component: 'ApiTreeSelect',
      fieldName: 'parentId',
      label: $t('dept.label.parentDept'),
      rules: 'required',
      labelWidth: 80,
      componentProps: {
        labelField: 'label',
        valueField: 'id',
        class: 'w-full',
        childrenField: 'children',
        checkStrictly: true,
        api: deptTree,
      },
    },
    {
      component: 'Input',
      fieldName: 'deptName',
      label: $t('dept.label.deptName'),
      rules: 'required',
      labelWidth: 80,
      componentProps: { placeholder: $t('dept.placeholder.deptName') },
    },
    {
      component: 'InputNumber',
      fieldName: 'orderNum',
      label: $t('dept.label.orderNum'),
      rules: 'required',
      labelWidth: 80,
    },
    {
      component: 'Input',
      fieldName: 'leader',
      label: $t('dept.label.leader'),
      labelWidth: 80,
      componentProps: { placeholder: $t('dept.placeholder.leader') },
    },
    {
      component: 'Input',
      fieldName: 'phone',
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
      label: $t('dept.label.status'),
      rules: 'selectRequired',
      labelWidth: 80,
      componentProps: {
        options: statusOptions,
      },
    },
  ],
});

watch(
  () => dept,
  (newDept) => {
    if (newDept) {
      formApi.setValues(newDept);
    }
  },
);

watch(
  () => statusOptions,
  (newStatusOptions) => {
    formApi.updateSchema([
      {
        fieldName: 'status',
        componentProps: {
          options: newStatusOptions,
        },
      },
    ]);
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
    const { deptId, ...restParams } = params;
    const action = deptId ? updateDept : insertDept;
    await action(deptId ? { deptId, ...restParams } : { ...restParams });
    ElMessage.success($t('dept.tip.addSuccess'));
    modalApi.close();
    emit('success');
  },
});
</script>
<template>
  <Modal :title="$t('dept.title.addDept')">
    <Form />
  </Modal>
</template>
