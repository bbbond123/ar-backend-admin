import type { PaginationRequest } from '../type'

/** 用户状态 */
export type UserStatus = 'active' | 'pending' | 'inactive'

/** 用户认证提供商 */
export type AuthProvider = 'email' | 'google' | 'apple'

/** 用户性别 */
export type Gender = 'male' | 'female'

/** 用户基础信息 */
export interface User {
  userId: number
  email: string
  name?: string
  nameKana?: string
  phoneNumber?: string
  address?: string
  gender?: Gender
  birth?: string
  avatar?: string
  provider: AuthProvider
  status: UserStatus
  googleId?: string
  appleId?: string
  createdAt: string
  updatedAt: string
}

/** 创建用户请求 */
export interface CreateUserRequest {
  email: string
  password?: string
  name?: string
  nameKana?: string
  phoneNumber?: string
  address?: string
  gender?: Gender
  birth?: string
  provider: AuthProvider
  status: UserStatus
  googleId?: string
  appleId?: string
}

/** 更新用户请求 */
export interface UpdateUserRequest {
  userId: number
  email?: string
  password?: string
  name?: string
  nameKana?: string
  phoneNumber?: string
  address?: string
  gender?: Gender
  birth?: string
  provider?: AuthProvider
  status?: UserStatus
  googleId?: string
  appleId?: string
}

/** 用户列表请求 */
export interface UserListRequest extends PaginationRequest {
  userId?: number
  email?: string
  name?: string
  phoneNumber?: string
  gender?: Gender
  provider?: AuthProvider
  status?: UserStatus
}

/** 用户统计信息 */
export interface UserStatistics {
  totalUsers: number
  activeUsers: number
  pendingUsers: number
  inactiveUsers: number
  emailUsers: number
  googleUsers: number
  appleUsers: number
  timestamp: string
}

// API响应类型
export type CurrentUserResponseData = ApiResponseData<{ username: string, roles: string[] }>
export type UserResponseData = ApiResponseData<User>
export type UserListResponseData = ApiResponseData<User[]>
export type UserStatisticsResponseData = ApiResponseData<UserStatistics>
