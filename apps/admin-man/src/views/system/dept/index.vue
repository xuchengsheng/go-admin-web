<script lang="ts" setup>
import type { ExtendedModalApi } from '@vben/common-ui';

import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { DeptApi } from '#/api/system/dept';
import type { DictDataApi } from '#/api/system/dict';

import { onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import {
  IconAdd,
  IconDelete,
  IconEdit,
  IconExpand,
  IconFold,
} from '@vben/icons';

import { ElButton, ElTooltip } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { listDept } from '#/api/system/dept';
import { getDictTypes } from '#/api/system/dict';
import Status from '#/component/status.vue';
import { $t } from '#/locales';

import DelDeptModal from './delete.vue';
import SaveDeptModal from './save.vue';

const currentDept = ref<DeptApi.DeptResult | null>(null);
const statusOptions = ref<DictDataApi.DictTypesResult[]>([]);
const expend = ref<boolean>(false);

onMounted(async () => {
  statusOptions.value = await getDictTypes('sys_normal_disable');
});

const gridOptions: VxeGridProps<DeptApi.DeptResult> = {
  columns: [
    {
      field: 'deptId',
      title: $t('dept.label.deptId'),
      treeNode: true,
    },
    {
      field: 'deptName',
      title: $t('dept.label.deptName'),
    },
    {
      field: 'orderNum',
      title: $t('dept.label.orderNum'),
    },
    {
      field: 'leader',
      title: $t('dept.label.leader'),
    },
    {
      field: 'status',
      title: $t('dept.label.status'),
      slots: { default: 'status' },
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
      width: 220,
    },
  ],
  proxyConfig: {
    ajax: {
      query: async (_, formValues) => {
        return { items: await listDept({ ...formValues }) };
      },
    },
  },
  treeConfig: {
    parentField: 'parentId',
    rowField: 'deptId',
    transform: true,
    expandRowKeys: [100],
  },
  pagerConfig: {
    enabled: false,
  },
  rowConfig: {
    keyField: 'deptId',
  },
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: { code: 'query' },
    zoom: true,
  },
};

const formOptions: VbenFormProps = {
  wrapperClass: 'grid-cols-5',
  showCollapseButton: false,
  submitOnChange: false,
  submitOnEnter: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'deptName',
      label: $t('dept.label.deptName'),
      labelWidth: 80,
      componentProps: { placeholder: $t('dept.placeholder.deptName') },
    },
    {
      component: 'ApiSelect',
      fieldName: 'status',
      label: $t('dept.label.status'),
      labelWidth: 80,
      componentProps: {
        options: statusOptions,
        placeholder: $t('dept.placeholder.status'),
      },
    },
  ],
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions,
});

const refreshGrid = () => gridApi.query();

const [SaveModal, saveModalApi] = useVbenModal({
  connectedComponent: SaveDeptModal,
});

const [DeleteModal, deleteModalApi] = useVbenModal({
  connectedComponent: DelDeptModal,
});

const handleModal = (
  modalApi: ExtendedModalApi,
  deptRow: DeptApi.DeptResult | null,
) => {
  currentDept.value = deptRow;
  modalApi.open();
};

const handleExpend = () => {
  expend.value = !expend.value;
  gridApi.grid.setAllTreeExpand(expend.value);
};
</script>

<template>
  <Page auto-content-height>
    <SaveModal
      :status-options="statusOptions"
      :dept="currentDept"
      @success="refreshGrid"
    />
    <DeleteModal :dept="currentDept" @success="refreshGrid" />
    <Grid :table-title="$t('dept.title.listDept')">
      <template #status="{ row }">
        <Status :row-status="row.status" :status-options="statusOptions" />
      </template>
      <template #action="{ row }">
        <ElButton
          type="primary"
          link
          :icon="IconAdd"
          @click="handleModal(saveModalApi, { parentId: row.deptId })"
        >
          {{ $t('base.add') }}
        </ElButton>
        <ElButton
          type="primary"
          link
          :icon="IconEdit"
          @click="handleModal(saveModalApi, row)"
        >
          {{ $t('base.edit') }}
        </ElButton>
        <ElButton
          type="primary"
          link
          :icon="IconDelete"
          @click="handleModal(deleteModalApi, row)"
        >
          {{ $t('base.del') }}
        </ElButton>
      </template>
      <template #toolbar-tools>
        <ElButton
          type="primary"
          plain
          :icon="IconAdd"
          @click="handleModal(saveModalApi, null)"
        >
          {{ $t('base.add') }}
        </ElButton>

        <ElTooltip
          effect="light"
          :content="expend ? '展开' : '收起'"
          placement="bottom-end"
        >
          <ElButton
            :icon="expend ? IconFold : IconExpand"
            circle
            @click="handleExpend"
          />
        </ElTooltip>
      </template>
    </Grid>
  </Page>
</template>
