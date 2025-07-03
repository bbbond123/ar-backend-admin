import type { IBaseResponse, IResponse } from "../type"
import type { CreateOrUpdateTableRequestData, TableData, TableRequestData } from "./type"
import { request } from "@/http/axios"

/** 增 */
export function createTableDataApi(data: CreateOrUpdateTableRequestData) {
  return request<IBaseResponse<TableData>>({
    url: "tables",
    method: "post",
    data
  })
}

/** 删 */
export function deleteTableDataApi(id: number) {
  return request<IBaseResponse<boolean>>({
    url: `tables/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateTableDataApi(data: CreateOrUpdateTableRequestData) {
  return request<IBaseResponse<TableData>>({
    url: "tables",
    method: "put",
    data
  })
}

/** 查 */
export function getTableDataApi(params: TableRequestData): Promise<IResponse<TableData>> {
  return request({
    url: "tables",
    method: "get",
    params
  })
}
