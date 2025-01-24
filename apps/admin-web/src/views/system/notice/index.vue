<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { DictDataApi } from '#/api/system/dict';
import type { NoticeApi } from '#/api/system/notice';

import { onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconAdd, IconDelete, IconEdit } from '@vben/icons';

import { ElButton, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDictTypes } from '#/api/system/dict';
import {
  deleteNotice,
  getNotice,
  insertNotice,
  listNotice,
  updateNotice,
} from '#/api/system/notice';
import Editor from '#/component/editor.vue';
import { $t } from '#/locales';

const currentNoticeId = ref<number>();
const deleteNoticeTitle = ref<string>();
const noticeContent = ref<string>();

const optionStatus = ref<DictDataApi.DictTypesResult[]>([]);
const optionNoticeType = ref<DictDataApi.DictTypesResult[]>([]);

onMounted(async () => {
  const [noticeStatusData, noticeTypeData] = await Promise.all([
    getDictTypes('sys_notice_status'),
    getDictTypes('sys_notice_type'),
  ]);
  optionStatus.value = noticeStatusData;
  optionNoticeType.value = noticeTypeData;
});

const filterOptions = (row: string, options: DictDataApi.DictTypesResult[]) => {
  return options.filter((item) => item.value === row);
};

const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'noticeTitle',
      label: $t('notice.label.noticeTitle'),
      labelWidth: 80,
      rules: 'required',
      componentProps: { placeholder: $t('notice.placeholder.noticeTitle') },
    },
    {
      component: 'Select',
      fieldName: 'noticeType',
      label: $t('notice.label.noticeType'),
      labelWidth: 80,
      rules: 'required',
      componentProps: {
        placeholder: $t('notice.placeholder.noticeType'),
        options: optionNoticeType,
      },
    },
    {
      component: 'RadioGroup',
      fieldName: 'status',
      label: $t('notice.label.status'),
      labelWidth: 80,
      rules: 'selectRequired',
      componentProps: {
        options: optionStatus,
        placeholder: $t('notice.placeholder.status'),
      },
    },
    {
      component: 'Input',
      fieldName: 'noticeContent',
      label: $t('notice.label.noticeContent'),
      labelWidth: 80,
      rules: 'required',
      componentProps: {
        placeholder: $t('notice.placeholder.noticeContent'),
        content: noticeContent,
      },
    },
    {
      component: 'Input',
      fieldName: 'remark',
      label: $t('notice.label.remark'),
      labelWidth: 80,
      componentProps: { placeholder: $t('notice.placeholder.remark') },
    },
  ],
});

const gridOptions: VxeGridProps<NoticeApi.NoticeResult> = {
  height: 'auto',
  columns: [
    {
      field: 'noticeId',
      title: $t('notice.label.noticeId'),
    },
    {
      field: 'noticeTitle',
      title: $t('notice.label.noticeTitle'),
    },
    {
      field: 'noticeType',
      title: $t('notice.label.noticeType'),
      slots: { default: 'noticeType' },
    },
    {
      field: 'status',
      title: $t('notice.label.status'),
      slots: { default: 'status' },
    },
    {
      field: 'createBy',
      title: $t('notice.label.createBy'),
    },
    {
      field: 'createTime',
      title: $t('notice.label.createTime'),
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
        return await listNotice({
          currentPage: page.currentPage,
          pageSize: page.pageSize,
          noticeTitle: formValues.noticeTitle,
          noticeType: formValues.noticeType,
          createBy: formValues.createBy,
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
      fieldName: 'noticeTitle',
      label: $t('notice.label.noticeTitle'),
      componentProps: {
        placeholder: $t('notice.placeholder.noticeTitle'),
      },
    },
    {
      component: 'Input',
      fieldName: 'createBy',
      label: $t('notice.label.createBy'),
      componentProps: {
        placeholder: $t('notice.placeholder.createBy'),
      },
    },
    {
      component: 'ApiSelect',
      fieldName: 'noticeType',
      label: $t('notice.label.noticeType'),
      componentProps: {
        placeholder: $t('notice.placeholder.noticeType'),
        options: optionNoticeType,
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
    await insertNotice({
      noticeTitle: result.noticeTitle,
      noticeType: result.noticeType,
      noticeContent: result.noticeContent,
      status: result.status,
      remark: result.remark,
    });
    ElMessage.success($t('notice.tip.addSuccess'));
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
    await updateNotice({
      noticeId: currentNoticeId.value!,
      noticeTitle: result.noticeTitle,
      noticeType: result.noticeType,
      noticeContent: result.noticeContent,
      status: result.status,
      remark: result.remark,
    });
    ElMessage.success($t('notice.tip.editSuccess'));
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
    await deleteNotice(currentNoticeId.value!);
    ElMessage.success($t('notice.tip.delSuccess'));
    gridApi.query();
    delModalApi.close();
  },
});

function handleAdd() {
  addModalApi.open();
}

function handleUpdate(row: NoticeApi.NoticeResult) {
  (async () => {
    currentNoticeId.value = row.noticeId;
    const notice = await getNotice(row.noticeId);
    noticeContent.value = notice.noticeContent;
    formApi.setValues({ ...notice });
    editModalApi.open();
  })();
}

function handleDelete(row: NoticeApi.NoticeResult) {
  currentNoticeId.value = row.noticeId;
  deleteNoticeTitle.value = row.noticeTitle;
  delModalApi.open();
}

function handleEditorChange(data: string) {
  formApi.setFieldValue('noticeContent', data);
}
</script>

<template>
  <Page auto-content-height>
    <AddModal class="w-[800px]" :title="$t('notice.title.addNotice')">
      <Form>
        <template #noticeContent="slotProps">
          <Editor @on-change="handleEditorChange" v-bind="slotProps" />
        </template>
      </Form>
    </AddModal>
    <EditModal class="w-[800px]" :title="$t('notice.title.editNotice')">
      <Form>
        <template #noticeContent="slotProps">
          <Editor @on-change="handleEditorChange" v-bind="slotProps" />
        </template>
      </Form>
    </EditModal>
    <DelModal :title="$t('notice.title.delNotice')">
      {{ $t('base.delConfirm', { name: deleteNoticeTitle }) }}
    </DelModal>
    <Grid :table-title="$t('notice.title.listNotice')">
      <template #noticeType="{ row }">
        <ElButton
          v-for="item in filterOptions(row.noticeType, optionNoticeType)"
          :key="item.value"
          :type="item.listClass"
          size="small"
          plain
        >
          {{ item.label }}
        </ElButton>
      </template>
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
          :icon="IconEdit"
          @click="handleUpdate(row)"
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
