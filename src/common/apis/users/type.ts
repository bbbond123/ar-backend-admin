// 用户数据模型
export interface User {
  userId: number
  name: string
  nameKana?: string
  email: string
  phoneNumber?: string
  avatar?: string
  birth?: string
  gender?: 'male' | 'female'
  address?: string
  provider: 'email' | 'google' | 'apple'
  status: 'active' | 'pending' | 'inactive'
  googleId?: string
  appleId?: string
  password?: string
  verifyCode?: string
  verifyCodeExpire?: string
  createdAt: string
  updatedAt: string
}

// 创建用户请求
export interface UserReqCreate {
  name?: string
  nameKana?: string
  email: string
  phoneNumber?: string
  birth?: string
  gender?: 'male' | 'female'
  address?: string
  provider: 'email' | 'google' | 'apple'
  status: 'active' | 'pending' | 'inactive'
  googleId?: string
  appleId?: string
  password?: string
}

// 编辑用户请求
export interface UserReqEdit {
  userId: number
  name?: string
  nameKana?: string
  email?: string
  phoneNumber?: string
  birth?: string
  gender?: 'male' | 'female'
  address?: string
  provider?: 'email' | 'google' | 'apple'
  status?: 'active' | 'pending' | 'inactive'
  googleId?: string
  appleId?: string
  password?: string
}

// 用户列表查询请求
export interface UserReqList {
  page: number
  pageSize: number
  userId?: number
  name?: string
  email?: string
  phoneNumber?: string
  gender?: 'male' | 'female'
  provider?: 'email' | 'google' | 'apple'
  status?: 'active' | 'pending' | 'inactive'
}

// 用户统计数据
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
