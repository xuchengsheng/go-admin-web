import { requestClient } from '#/api/request';

export namespace NoticeApi {
  export interface NoticeParams {
    currentPage: number;
    pageSize: number;
    noticeTitle: string;
    noticeType: string;
    createBy: string;
  }
  export interface NoticeResult {
    noticeId: number;
    noticeTitle: string;
    noticeType: string;
    noticeContent: string;
    status: string;
    remark: string;
    createBy: string;
    createTime: string;
  }
  export interface NoticeAddParams {
    noticeTitle: string;
    noticeType: string;
    noticeContent: string;
    status: string;
    remark: string;
  }
  export interface NoticeEditParams {
    noticeId: number;
    noticeTitle: string;
    noticeType: string;
    noticeContent: string;
    status: string;
    remark: string;
  }
}

export async function listNotice(params: NoticeApi.NoticeParams) {
  return requestClient.get<NoticeApi.NoticeResult[]>('/system/notice/list', {
    params,
  });
}

export async function getNotice(noticeId: number) {
  return requestClient.get<NoticeApi.NoticeResult>(
    `/system/notice/${noticeId}`,
  );
}

export async function deleteNotice(noticeId: number) {
  return requestClient.delete<string>(`/system/notice/${noticeId}`);
}

export async function insertNotice(params: NoticeApi.NoticeAddParams) {
  return requestClient.post<string>('/system/notice', params);
}

export async function updateNotice(params: NoticeApi.NoticeEditParams) {
  return requestClient.put<string>('/system/notice', params);
}
