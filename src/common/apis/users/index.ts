import type * as Users from "./type"
import { request } from "@/http/axios"
import { IBaseResponse } from "../type"

/** 获取当前登录用户详情 */
export function getCurrentUserApi() {
  return request<IBaseResponse<{ username: string, roles: string[] }>>({
    url: "/users/me",
    method: "get"
  })
}
