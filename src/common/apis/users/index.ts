import type { ApiResponse, PaginationResponse } from '../type'
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserListRequest,
  UserStatistics,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RegisterRequest,
  VerifyEmailRequest,
  ResendVerifyCodeRequest
} from './type'
import { request } from '@/http/axios'

const BASE_URL = '/api/v1/users'

/** 获取用户列表 */
export function getUserListApi(params: UserListRequest) {
  return request<ApiResponse<PaginationResponse<User>>>({
    url: `${BASE_URL}/list`,
    method: 'get',
    params
  })
}

/** 获取用户详情 */
export function getUserDetailApi(userId: number) {
  return request<ApiResponse<User>>({
    url: `${BASE_URL}/${userId}`,
    method: 'get'
  })
}

/** 创建用户 */
export function createUserApi(data: CreateUserRequest) {
  return request<ApiResponse<User>>({
    url: BASE_URL,
    method: 'post',
    data
  })
}

/** 更新用户 */
export function updateUserApi(data: UpdateUserRequest) {
  return request<ApiResponse<User>>({
    url: `${BASE_URL}/${data.userId}`,
    method: 'put',
    data
  })
}

/** 删除用户 */
export function deleteUserApi(userId: number) {
  return request<ApiResponse<void>>({
    url: `${BASE_URL}/${userId}`,
    method: 'delete'
  })
}

/** 获取用户统计信息 */
export function getUserStatisticsApi() {
  return request<ApiResponse<UserStatistics>>({
    url: `${BASE_URL}/statistics`,
    method: 'get'
  })
}

/** 用户登录 */
export function loginApi(data: LoginRequest) {
  return request<ApiResponse<LoginResponse>>({
    url: `${BASE_URL}/login`,
    method: 'post',
    data
  })
}

/** 刷新令牌 */
export function refreshTokenApi(data: RefreshTokenRequest) {
  return request<ApiResponse<LoginResponse>>({
    url: `${BASE_URL}/refresh-token`,
    method: 'post',
    data
  })
}

/** 用户注册 */
export function registerApi(data: RegisterRequest) {
  return request<ApiResponse<void>>({
    url: `${BASE_URL}/register`,
    method: 'post',
    data
  })
}

/** 验证邮箱 */
export function verifyEmailApi(data: VerifyEmailRequest) {
  return request<ApiResponse<void>>({
    url: `${BASE_URL}/verify-email`,
    method: 'post',
    data
  })
}

/** 重发验证码 */
export function resendVerifyCodeApi(data: ResendVerifyCodeRequest) {
  return request<ApiResponse<void>>({
    url: `${BASE_URL}/resend-verify-code`,
    method: 'post',
    data
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
