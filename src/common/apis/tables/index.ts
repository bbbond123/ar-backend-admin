import type * as Tables from "./type"
import { request } from "@/http/axios"
import { IBaseResponse, IResponse } from "../type"

/** 增 */
export function createTableDataApi(data: Tables.CreateOrUpdateTableRequestData) {
  return request<IBaseResponse<Tables.TableData>>({
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
export function updateTableDataApi(data: Tables.CreateOrUpdateTableRequestData) {
  return request<IBaseResponse<Tables.TableData>>({
    url: "tables",
    method: "put",
    data
  })
}

/** 查 */
export function getTableDataApi(params: Tables.TableRequestData) {
  return request<IResponse<Tables.TableData>>({
    url: "tables",
    method: "get",
    params
  })
}
