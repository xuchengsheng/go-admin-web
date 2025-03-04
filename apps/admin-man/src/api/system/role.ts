import { requestClient } from '#/api/request';

export namespace RoleApi {
  export interface RoleResult {
    roleId: number;
    roleName: string;
    roleKey: string;
    roleSort: number;
    status: string;
    dataScope: string;
    menuCheckStrictly: boolean;
    deptCheckStrictly: boolean;
    remark: string;
    createTime?: string;
  }
}

export async function allRole() {
  return requestClient.get<RoleApi.RoleResult[]>('/system/role/all');
}
