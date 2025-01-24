import { requestClient } from '#/api/request';

export namespace PostApi {
  export interface PostParams {
    currentPage: number;
    pageSize: number;
    postCode: string;
    postName: string;
    status: string;
  }
  export interface PostResult {
    postId: number;
    postCode: string;
    postName: string;
    postSort: number;
    remark: string;
    status: string;
    createTime: string;
  }
  export interface PostAddParams {
    postCode: string;
    postName: string;
    postSort: number;
    remark: string;
    status: string;
  }
  export interface PostUpdateParams {
    postId: number;
    postCode: string;
    postName: string;
    postSort: number;
    remark: string;
    status: string;
  }
}

export async function listPost(params: PostApi.PostParams) {
  return requestClient.get<PostApi.PostResult[]>('/system/post/list', {
    params,
  });
}

export async function getPost(postId: number) {
  return requestClient.get<PostApi.PostResult>(`/system/post/${postId}`);
}

export async function deletePost(postId: number) {
  return requestClient.delete<string>(`/system/post/${postId}`);
}

export async function insertPost(params: PostApi.PostAddParams) {
  return requestClient.post<string>('/system/post', params);
}

export async function updatePost(params: PostApi.PostUpdateParams) {
  return requestClient.put<string>('/system/post', params);
}
