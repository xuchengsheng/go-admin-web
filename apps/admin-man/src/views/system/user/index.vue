<script lang="ts" setup>
import type { ExtendedModalApi } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';
import type { DeptApi } from '#/api/system/dept';
import type { DictDataApi } from '#/api/system/dict';
import type { UserApi } from '#/api/system/user';

import { onMounted, ref, watch } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconAdd, IconDelete, IconEdit, IconSearch } from '@vben/icons';

import { ElButton, ElInput, ElScrollbar, ElTree } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deptTree } from '#/api/system/dept';
import { getDictTypes } from '#/api/system/dict';
import { listUser } from '#/api/system/user';
import Status from '#/component/status.vue';
import { $t } from '#/locales';

import DelUserModal from './delete.vue';
import SaveUserModal from './save.vue';

const filterText = ref('');
const treeRef = ref<InstanceType<typeof ElTree>>();
const statusOptions = ref<DictDataApi.DictTypesResult[]>([]);
const newDeptTree = ref<DeptApi.DeptTreeResult[]>();
const selectDeptId = ref<number>();
const currentUser = ref<null | UserApi.UserResult>(null);

onMounted(async () => {
  statusOptions.value = await getDictTypes('sys_normal_disable');
  newDeptTree.value = await deptTree();
});

const gridOptions: VxeGridProps<UserApi.UserParams> = {
  height: 'auto',
  columns: [
    {
      field: 'userId',
      title: $t('user.label.userId'),
    },
    {
      field: 'userName',
      title: $t('user.label.userName'),
    },
    {
      field: 'nickName',
      title: $t('user.label.nickName'),
    },
    {
      field: 'deptName',
      title: $t('user.label.deptName'),
    },
    {
      field: 'phonenumber',
      title: $t('user.label.phonenumber'),
    },
    {
      field: 'status',
      title: $t('user.label.status'),
      slots: { default: 'status' },
    },
    {
      field: 'createTime',
      title: $t('user.label.createTime'),
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
      query: async ({ page }, formValues) => {
        console.info('formValues', formValues);
        return await listUser({
          currentPage: page.currentPage,
          pageSize: page.pageSize,
          deptId: selectDeptId.value,
          ...formValues,
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

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions: {
    wrapperClass: 'grid-cols-5',
    showCollapseButton: false,
    submitOnChange: false,
    submitOnEnter: true,
    fieldMappingTime: [['rangePicker', ['beginTime', 'endTime'], 'YYYY-MM-DD']],
    schema: [
      {
        component: 'Input',
        fieldName: 'userName',
        label: $t('user.label.userName'),
        componentProps: {
          placeholder: $t('user.placeholder.userName'),
        },
      },
      {
        component: 'Input',
        fieldName: 'phonenumber',
        label: $t('user.label.phonenumber'),
        componentProps: {
          placeholder: $t('user.placeholder.phonenumber'),
        },
      },
      {
        component: 'ApiSelect',
        fieldName: 'status',
        label: $t('user.label.status'),
        componentProps: {
          placeholder: $t('user.placeholder.status'),
          options: statusOptions,
          clearable: true,
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
  },
});

const [SaveModal, saveModalApi] = useVbenModal({
  connectedComponent: SaveUserModal,
});

const [DeleteModal, deleteModalApi] = useVbenModal({
  connectedComponent: DelUserModal,
});

watch(filterText, (val) => {
  treeRef.value!.filter(val);
});

const filterNode = (
  value: string,
  data: {
    [key: string]: any;
  },
) => {
  if (!value) return true;
  return data.label.includes(value);
};

const handleNodeClick = (data: DeptApi.DeptTreeResult) => {
  selectDeptId.value = data.id;
  gridApi.reload();
};

const handleModal = (
  modalApi: ExtendedModalApi,
  userRow: null | UserApi.UserResult,
) => {
  currentUser.value = userRow;
  modalApi.open();
};
</script>

<template>
  <Page auto-content-height>
    <SaveModal :user-id="currentUser?.userId" @success="gridApi.query()" />
    <DeleteModal :user="currentUser" @success="gridApi.query()" />
    <div class="flex h-full space-x-4">
      <ElScrollbar class="bg-background flex w-1/6 flex-col rounded-md p-2">
        <ElInput
          v-model="filterText"
          placeholder="请输入部门名称"
          :prefix-icon="IconSearch"
        />
        <ElTree
          class="h-full pt-2.5"
          ref="treeRef"
          :data="newDeptTree"
          node-key="id"
          :expand-on-click-node="false"
          default-expand-all
          highlight-current
          @node-click="handleNodeClick"
          :filter-node-method="filterNode"
        />
      </ElScrollbar>
      <Grid class="w-5/6" :table-title="$t('user.title.listUser')">
        <template #status="{ row }">
          <Status :row-status="row.status" :status-options="statusOptions" />
        </template>
        <template #action="{ row }">
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
        </template>
      </Grid>
    </div>
  </Page>
</template>
