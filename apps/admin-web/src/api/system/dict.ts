import { requestClient } from '#/api/request';
import { $t } from '#/locales';

export namespace DictDataApi {
  export interface DictTypesResult {
    label: string;
    value: string;
    listClass:
      | 'danger'
      | 'default'
      | 'info'
      | 'primary'
      | 'success'
      | 'text'
      | 'warning';
  }
}

export async function getDictTypes(type: string) {
  const data = await requestClient.get<DictDataApi.DictTypesResult[]>(
    `/system/dict/data/type/${type}`,
  );
  return data.map((item) => ({
    ...item,
    label: $t(item.label),
  }));
}
