<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { ConfigApi } from '#/api/system/config';
import type { DictDataApi } from '#/api/system/dict';

import { onMounted, ref } from 'vue';

import { Page, useVbenForm, useVbenModal } from '@vben/common-ui';
import { IconAdd, IconDelete, IconEdit, IconRefresh } from '@vben/icons';

import { ElButton, ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteConfig,
  getConfig,
  insertConfig,
  listConfig,
  refreshCache,
  updateConfig,
} from '#/api/system/config';
import { getDictTypes } from '#/api/system/dict';
import { $t } from '#/locales';

const currentConfigId = ref<number>();
const deleteConfigName = ref<string>();
const optionConfigType = ref<DictDataApi.DictTypesResult[]>([]);

onMounted(async () => {
  optionConfigType.value = await getDictTypes('sys_yes_no');
});

const filterOptions = (row: string, options: DictDataApi.DictTypesResult[]) => {
  return options.filter((item) => item.value === row);
};

const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'configName',
      label: $t('config.label.configName'),
      labelWidth: 80,
      rules: 'required',
      componentProps: { placeholder: $t('config.placeholder.configName') },
    },
    {
      component: 'Input',
      fieldName: 'configKey',
      label: $t('config.label.configKey'),
      labelWidth: 80,
      rules: 'required',
      componentProps: { placeholder: $t('config.placeholder.configKey') },
    },
    {
      component: 'Input',
      fieldName: 'configValue',
      label: $t('config.label.configValue'),
      labelWidth: 80,
      rules: 'required',
      componentProps: { placeholder: $t('config.placeholder.configValue') },
    },
    {
      component: 'RadioGroup',
      fieldName: 'configType',
      label: $t('config.label.configType'),
      labelWidth: 80,
      rules: 'selectRequired',
      componentProps: {
        options: optionConfigType,
        placeholder: $t('config.placeholder.configType'),
      },
    },
    {
      component: 'Input',
      fieldName: 'remark',
      label: $t('config.label.remark'),
      labelWidth: 80,
      componentProps: { placeholder: $t('config.placeholder.remark') },
    },
  ],
});

const gridOptions: VxeGridProps<ConfigApi.ConfigResult> = {
  height: 'auto',
  columns: [
    {
      field: 'configId',
      title: $t('config.label.configId'),
    },
    {
      field: 'configName',
      title: $t('config.label.configName'),
    },
    {
      field: 'configKey',
      title: $t('config.label.configKey'),
    },
    {
      field: 'configValue',
      title: $t('config.label.configValue'),
    },
    {
      field: 'configType',
      title: $t('config.label.configType'),
      slots: { default: 'configType' },
    },
    {
      field: 'remark',
      title: $t('config.label.remark'),
    },
    {
      field: 'createTime',
      title: $t('config.label.createTime'),
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: $t('base.operate'),
      width: 200,
    },
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await listConfig({
          currentPage: page.currentPage,
          pageSize: page.pageSize,
          configName: formValues.configName,
          configKey: formValues.configKey,
          configType: formValues.configType,
          beginTime: formValues.beginTime,
          endTime: formValues.endTime,
        });
      },
    },
  },
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: { code: 'query' },
    zoom: true,
  },
  exportConfig: {},
};

const formOptions: VbenFormProps = {
  wrapperClass: 'grid-cols-5',
  showCollapseButton: false,
  submitOnChange: false,
  submitOnEnter: false,
  fieldMappingTime: [['rangePicker', ['beginTime', 'endTime'], 'YYYY-MM-DD']],
  schema: [
    {
      component: 'Input',
      fieldName: 'configName',
      label: $t('config.label.configName'),
      componentProps: {
        placeholder: $t('config.placeholder.configName'),
      },
    },
    {
      component: 'Input',
      fieldName: 'configKey',
      label: $t('config.label.configKey'),
      componentProps: {
        placeholder: $t('config.placeholder.configKey'),
      },
    },
    {
      component: 'ApiSelect',
      fieldName: 'configType',
      label: $t('config.label.configType'),
      componentProps: {
        placeholder: $t('config.placeholder.configType'),
        options: optionConfigType,
      },
    },
    {
      fieldName: 'rangePicker',
      label: $t('config.label.createTime'),
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        startPlaceholder: $t('base.beginTime'),
        endPlaceholder: $t('base.endTime'),
      },
    },
  ],
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions,
});

const [AddModal, addModalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel() {
    addModalApi.close();
  },
  onConfirm: async () => {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const result = await formApi.getValues();
    await insertConfig({
      configName: result.configName,
      configKey: result.configKey,
      configValue: result.configValue,
      configType: result.configType,
      remark: result.remark,
    });
    ElMessage.success($t('config.tip.addSuccess'));
    addModalApi.close();
    gridApi.query();
  },
});

const [EditModal, editModalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel() {
    editModalApi.close();
  },
  onConfirm: async () => {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const result = await formApi.getValues();
    await updateConfig({
      configId: currentConfigId.value!,
      configName: result.configName,
      configKey: result.configKey,
      configValue: result.configValue,
      configType: result.configType,
      remark: result.remark,
    });
    ElMessage.success($t('config.tip.editSuccess'));
    editModalApi.close();
    gridApi.query();
  },
});

const [DelModal, delModalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel() {
    delModalApi.close();
  },
  onConfirm: async () => {
    await deleteConfig(currentConfigId.value!);
    ElMessage.success($t('config.tip.delSuccess'));
    gridApi.query();
    delModalApi.close();
  },
});

function handleAdd() {
  addModalApi.open();
}

function handleUpdate(row: ConfigApi.ConfigResult) {
  (async () => {
    currentConfigId.value = row.configId;
    const config = await getConfig(row.configId);
    formApi.setValues({ ...config });
    editModalApi.open();
  })();
}

function handleDelete(row: ConfigApi.ConfigResult) {
  currentConfigId.value = row.configId;
  deleteConfigName.value = row.configName;
  delModalApi.open();
}

function handleRefreshCache() {
  (async () => {
    await refreshCache();
    ElMessage.success($t('config.tip.refreshCacheSuccess'));
  })();
}
</script>

<template>
  <Page auto-content-height>
    <AddModal :title="$t('config.title.addConfig')">
      <Form />
    </AddModal>
    <EditModal :title="$t('config.title.editConfig')">
      <Form />
    </EditModal>
    <DelModal :title="$t('config.title.delConfig')">
      {{ $t('base.delConfirm', { name: deleteConfigName }) }}
    </DelModal>
    <Grid :table-title="$t('config.title.listConfig')">
      <template #configType="{ row }">
        <ElButton
          v-for="item in filterOptions(row.configType, optionConfigType)"
          :key="item.value"
          :type="item.listClass"
          size="small"
          plain
        >
          {{ item.label }}
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton
          type="primary"
          link
          :icon="IconEdit"
          @click="handleUpdate(row)"
        >
          {{ $t('base.edit') }}
        </ElButton>
        <ElButton
          type="primary"
          link
          :icon="IconDelete"
          @click="handleDelete(row)"
        >
          {{ $t('base.del') }}
        </ElButton>
      </template>
      <template #toolbar-tools>
        <ElButton type="primary" plain :icon="IconAdd" @click="handleAdd">
          {{ $t('base.add') }}
        </ElButton>
        <ElButton
          type="primary"
          plain
          :icon="IconRefresh"
          @click="handleRefreshCache"
        >
          {{ $t('config.title.refreshConfig') }}
        </ElButton>
      </template>
    </Grid>
  </Page>
</template>
