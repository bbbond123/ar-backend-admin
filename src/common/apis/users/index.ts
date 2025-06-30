import type * as Users from "./type"
import { request } from "@/http/axios"
import { IBaseResponse, IResponse } from "../type"

/** 获取当前登录用户详情 */
export function getCurrentUserApi() {
  return request<IBaseResponse<{ username: string, roles: string[] }>>({
    url: "/users/me",
    method: "get"
  })
}

/** 获取用户列表 */
export function getUserListApi(data: Users.UserReqList) {
  return request<IResponse<Users.User>>({
    url: "/api/users/list",
    method: "post",
    data
  })
}

/** 创建用户 */
export function createUserApi(data: Users.UserReqCreate) {
  return request<IBaseResponse<Users.User>>({
    url: "/api/users",
    method: "post",
    data
  })
}

/** 更新用户 */
export function updateUserApi(data: Users.UserReqEdit) {
  return request<IBaseResponse<any>>({
    url: "/api/users",
    method: "put",
    data
  })
}

/** 获取用户详情 */
export function getUserDetailApi(userId: number) {
  return request<IBaseResponse<Users.User>>({
    url: `/api/users/${userId}`,
    method: "get"
  })
}

/** 删除用户 */
export function deleteUserApi(userId: number) {
  return request<IBaseResponse<any>>({
    url: `/api/users/${userId}`,
    method: "delete"
  })
}

/** 获取用户统计信息 */
export function getUserStatisticsApi() {
  return request<IBaseResponse<Users.UserStatistics>>({
    url: "/api/users/statistics",
    method: "get"
  })
}

/** 初始化示例用户数据 */
export function initSampleUsersApi() {
  return request<IBaseResponse<any>>({
    url: "/api/users/init-sample",
    method: "post"
  })
}
