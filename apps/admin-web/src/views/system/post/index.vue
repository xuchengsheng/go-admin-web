<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { DictDataApi } from '#/api/system/dict';
import type { PostApi } from '#/api/system/post';

import { onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconAdd, IconDelete, IconEdit } from '@vben/icons';

import { ElButton, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDictTypes } from '#/api/system/dict';
import {
  deletePost,
  getPost,
  insertPost,
  listPost,
  updatePost,
} from '#/api/system/post';
import { $t } from '#/locales';

const currentPostId = ref<number>();
const deletePostName = ref<string>();
const optionStatus = ref<DictDataApi.DictTypesResult[]>([]);

onMounted(async () => {
  optionStatus.value = await getDictTypes('sys_normal_disable');
});

const filterOptions = (row: string, options: DictDataApi.DictTypesResult[]) => {
  return options.filter((item) => item.value === row);
};

const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'postName',
      label: $t('post.label.postName'),
      labelWidth: 80,
      rules: 'required',
      componentProps: { placeholder: $t('post.placeholder.postName') },
    },
    {
      component: 'Input',
      fieldName: 'postCode',
      label: $t('post.label.postCode'),
      labelWidth: 80,
      rules: 'required',
      componentProps: { placeholder: $t('post.placeholder.postName') },
    },
    {
      component: 'Input',
      fieldName: 'postSort',
      label: $t('post.label.postSort'),
      labelWidth: 80,
      rules: 'required',
      componentProps: { placeholder: $t('post.placeholder.postName') },
    },
    {
      component: 'RadioGroup',
      fieldName: 'status',
      label: $t('post.label.status'),
      labelWidth: 80,
      rules: 'selectRequired',
      componentProps: {
        options: optionStatus,
        placeholder: $t('post.placeholder.postName'),
      },
    },
    {
      component: 'Input',
      fieldName: 'remark',
      label: $t('post.label.remark'),
      labelWidth: 80,
      componentProps: { placeholder: $t('post.placeholder.postName') },
    },
  ],
});

const gridOptions: VxeGridProps<PostApi.PostResult> = {
  height: 'auto',
  columns: [
    {
      field: 'postId',
      title: $t('post.label.postId'),
    },
    {
      field: 'postCode',
      title: $t('post.label.postCode'),
    },
    {
      field: 'postName',
      title: $t('post.label.postName'),
    },
    {
      field: 'postSort',
      title: $t('post.label.postSort'),
    },
    {
      field: 'status',
      title: $t('post.label.status'),
      slots: { default: 'status' },
    },
    {
      field: 'createTime',
      title: $t('post.label.createTime'),
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
        return await listPost({
          currentPage: page.currentPage,
          pageSize: page.pageSize,
          postName: formValues.postName,
          postCode: formValues.postCode,
          status: formValues.status,
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
  submitOnEnter: true,
  schema: [
    {
      component: 'Input',
      fieldName: 'postCode',
      label: $t('post.label.postCode'),
      componentProps: {
        placeholder: $t('post.placeholder.postCode'),
      },
    },
    {
      component: 'Input',
      fieldName: 'postName',
      label: $t('post.label.postName'),
      componentProps: {
        placeholder: $t('post.placeholder.postName'),
      },
    },
    {
      component: 'ApiSelect',
      fieldName: 'status',
      label: $t('post.label.status'),
      componentProps: {
        placeholder: $t('post.placeholder.status'),
        options: optionStatus,
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
    await insertPost({
      postName: result.postName,
      postCode: result.postCode,
      postSort: result.postSort,
      remark: result.remark,
      status: result.status,
    });
    ElMessage.success($t('post.tip.addSuccess'));
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
    await updatePost({
      postId: currentPostId.value!,
      postName: result.postName,
      postCode: result.postCode,
      postSort: result.postSort,
      remark: result.remark,
      status: result.status,
    });
    ElMessage.success($t('post.tip.editSuccess'));
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
    await deletePost(currentPostId.value!);
    ElMessage.success($t('post.tip.delSuccess'));
    gridApi.query();
    delModalApi.close();
  },
});

function handleAdd() {
  addModalApi.open();
}

function handleUpdate(row: PostApi.PostResult) {
  (async () => {
    currentPostId.value = row.postId;
    formApi.setValues(await getPost(row.postId));
    editModalApi.open();
  })();
}

function handleDelete(row: PostApi.PostResult) {
  currentPostId.value = row.postId;
  deletePostName.value = row.postName;
  delModalApi.open();
}
</script>

<template>
  <Page auto-content-height>
    <AddModal :title="$t('post.title.addPost')">
      <Form />
    </AddModal>
    <EditModal :title="$t('post.title.editPost')">
      <Form />
    </EditModal>
    <DelModal :title="$t('post.title.delPost')">
      {{ $t('base.delConfirm', { name: deletePostName }) }}
    </DelModal>
    <Grid :table-title="$t('post.title.listPost')">
      <template #status="{ row }">
        <ElButton
          v-for="item in filterOptions(row.status, optionStatus)"
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
          @click="handleUpdate(row)"
          :icon="IconEdit"
        >
          {{ $t('base.edit') }}
        </ElButton>
        <ElButton
          type="primary"
          link
          @click="handleDelete(row)"
          :icon="IconDelete"
        >
          {{ $t('base.del') }}
        </ElButton>
      </template>
      <template #toolbar-tools>
        <ElButton type="primary" plain :icon="IconAdd" @click="handleAdd">
          {{ $t('base.add') }}
        </ElButton>
      </template>
    </Grid>
  </Page>
</template>
