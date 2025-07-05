import type { IBaseResponse, IResponse } from "../type"
import type {
  CreateUserRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RegisterRequest,
  ResendVerifyCodeRequest,
  UpdateUserRequest,
  User,
  UserListRequest,
  UserStatistics,
  VerifyEmailRequest
} from "./type"
import { request } from "@/http/axios"

const BASE_URL = "/api"

/** 获取当前登录用户详情 */
export function getCurrentUserApi() {
  return request<IBaseResponse<{ username: string, roles: string[] }>>({
    url: "/auth/user/profile",
    method: "get"
  })
}

/** 获取用户列表 */
export function getUserListApi(data: UserListRequest) {
  return request<IResponse<User>>({
    url: `${BASE_URL}/list`,
    method: "post",
    data
  })
}

/** 创建用户 */
export function createUserApi(data: CreateUserRequest) {
  return request<IBaseResponse<User>>({
    url: BASE_URL,
    method: "post",
    data
  })
}

/** 更新用户 */
export function updateUserApi(data: UpdateUserRequest) {
  return request<IBaseResponse<any>>({
    url: BASE_URL,
    method: "put",
    data
  })
}

/** 获取用户详情 */
export function getUserDetailApi(userId: number) {
  return request<IBaseResponse<User>>({
    url: `${BASE_URL}/${userId}`,
    method: "get"
  })
}

/** 删除用户 */
export function deleteUserApi(userId: number) {
  return request<IBaseResponse<any>>({
    url: `${BASE_URL}/${userId}`,
    method: "delete"
  })
}

/** 获取用户统计信息 */
export function getUserStatisticsApi() {
  return request<IBaseResponse<UserStatistics>>({
    url: `${BASE_URL}/statistics`,
    method: "get"
  })
}

/** 用户登录 */
export function loginApi(data: LoginRequest) {
  return request<IBaseResponse<LoginResponse>>({
    url: "/api/auth/login",
    method: "post",
    data
  })
}

/** 刷新令牌 */
export function refreshTokenApi(data: RefreshTokenRequest) {
  return request<IBaseResponse<LoginResponse>>({
    url: "/api/auth/refresh-token",
    method: "post",
    data
  })
}

/** 用户注册 */
export function registerApi(data: RegisterRequest) {
  return request<IBaseResponse<void>>({
    url: "/api/auth/register",
    method: "post",
    data
  })
}

/** 验证邮箱 */
export function verifyEmailApi(data: VerifyEmailRequest) {
  return request<IBaseResponse<void>>({
    url: "/api/auth/verify-email",
    method: "post",
    data
  })
}

/** 重发验证码 */
export function resendVerifyCodeApi(data: ResendVerifyCodeRequest) {
  return request<IBaseResponse<void>>({
    url: "/api/auth/resend-verify-code",
    method: "post",
    data
  })
}

/** 初始化示例用户数据 */
export function initSampleUsersApi() {
  return request<IBaseResponse<any>>({
    url: `${BASE_URL}/init-sample`,
    method: "post"
  })
}
