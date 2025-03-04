import { requestClient } from '#/api/request';

export namespace UserApi {
  export interface UserParams {
    currentPage: number;
    pageSize: number;
    userName: string;
    status: string;
    phonenumber: string;
    deptId: number;
  }
  export interface UserResult {
    userId: number;
    deptId: number;
    userName: string;
    nickName: string;
    email: string;
    phonenumber: string;
    sex: string;
    status: string;
    remark: string;
    createTime: string;
  }
  export interface UserAddParams {
    deptId?: number;
    roleIds?: number[];
    postIds?: number[];
    userName?: string;
    nickName?: string;
    userType?: string;
    email?: string;
    phonenumber?: string;
    sex?: string;
    password?: string;
    status?: string;
    remark?: string;
  }
  export interface UserUpdateParams {
    userId?: number;
    roleIds?: number[];
    postIds?: number[];
    deptId?: number;
    userName?: string;
    nickName?: string;
    userType?: string;
    email?: string;
    phonenumber?: string;
    sex?: string;
    status?: string;
    remark?: string;
  }
}

export async function listUser(params: UserApi.UserParams) {
  return requestClient.get<UserApi.UserResult[]>('/system/user/list', {
    params,
  });
}

export async function getUser(userId: number) {
  return requestClient.get<UserApi.UserResult>(`/system/user/${userId}`);
}

export async function deleteUser(userId: number) {
  return requestClient.delete<string>(`/system/user/${userId}`);
}

export async function insertUser(params: UserApi.UserAddParams) {
  return requestClient.post<string>('/system/user', params);
}

export async function updateUser(params: UserApi.UserUpdateParams) {
  return requestClient.put<string>('/system/user', params);
}
