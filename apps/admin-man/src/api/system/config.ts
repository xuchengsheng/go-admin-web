import { requestClient } from '#/api/request';

export namespace ConfigApi {
  export interface ConfigParams {
    currentPage: number;
    pageSize: number;
    beginTime: string;
    endTime: string;
    configName: string;
    configKey: string;
    configType: string;
  }
  export interface ConfigResult {
    configId: number;
    configName: string;
    configKey: string;
    configValue: number;
    configType: string;
    remark: string;
    createTime: string;
  }
  export interface ConfigAddParams {
    configName: string;
    configKey: string;
    configValue: number;
    configType: string;
    remark: string;
  }
  export interface ConfigUpdateParams {
    configId: number;
    configName: string;
    configKey: string;
    configValue: number;
    configType: string;
    remark: string;
  }
}

export async function listConfig(params: ConfigApi.ConfigParams) {
  return requestClient.get<ConfigApi.ConfigResult[]>('/system/config/list', {
    params,
  });
}

export async function getConfig(configId: number) {
  return requestClient.get<ConfigApi.ConfigResult>(
    `/system/config/${configId}`,
  );
}

export async function deleteConfig(configId: number) {
  return requestClient.delete<string>(`/system/config/${configId}`);
}

export async function insertConfig(params: ConfigApi.ConfigAddParams) {
  return requestClient.post<string>('/system/config', params);
}

export async function updateConfig(params: ConfigApi.ConfigUpdateParams) {
  return requestClient.put<string>('/system/config', params);
}

export async function refreshCache() {
  return requestClient.delete<string>('/system/config/refreshCache');
}

export async function configKey(configKey: string) {
  return requestClient.get<string>(`/system/config/configKey/${configKey}`);
}
