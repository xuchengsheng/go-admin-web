import { requestClient } from '#/api/request';

export namespace DeptApi {
  export interface DeptParams {
    deptName?: string;
    status?: string;
  }
  export interface DeptResult {
    deptId?: number;
    parentId?: number;
    ancestors?: string;
    deptName?: string;
    orderNum?: number;
    leader?: string;
    phone?: string;
    email?: string;
    status?: string;
    createTime?: string;
  }
  export interface DeptAddParams {
    parentId?: number;
    deptName?: string;
    orderNum?: number;
    leader?: string;
    phone?: string;
    email?: string;
    status?: string;
  }
  export interface DeptUpdateParams {
    deptId?: number;
    parentId?: number;
    deptName?: string;
    orderNum?: number;
    leader?: string;
    phone?: string;
    email?: string;
    status?: string;
  }
  export interface DeptTreeResult {
    id: number;
    label: string;
    children: DeptTreeResult[];
  }
}

export async function listDept(params: DeptApi.DeptParams) {
  return requestClient.get<DeptApi.DeptResult[]>('/system/dept/list', {
    params,
  });
}

export async function getDept(deptId: number) {
  return requestClient.get<DeptApi.DeptResult>(`/system/dept/${deptId}`);
}

export async function deptTree() {
  return requestClient.get<DeptApi.DeptTreeResult[]>(`/system/user/deptTree`);
}

export async function deleteDept(deptId: number) {
  return requestClient.delete<string>(`/system/dept/${deptId}`);
}

export async function insertDept(params: DeptApi.DeptAddParams) {
  return requestClient.post<string>('/system/dept', params);
}

export async function updateDept(params: DeptApi.DeptUpdateParams) {
  return requestClient.put<string>('/system/dept', params);
}
