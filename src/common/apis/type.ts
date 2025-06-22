// 基础响应（无data）
export interface BaseResponse {
  code: number
  success: boolean
  errCode?: string
  errMessage?: string
}

// 通用响应（带data）
export interface IBaseResponse<T> {
  data: T
  code: number
  success: boolean
  errCode?: string
  errMessage?: string
}

// 列表响应
export interface IResponse<T> {
  total: number
  data: T[]
  page: number
  pageSize: number
  code: number
  success: boolean
  errCode?: string
  errMessage?: string
}

// 错误响应类型
export interface ErrorResponse {
  success: false
  errCode: string
  errMessage: string
}

// 具体错误类型（可选，用于更严格的类型检查）
export interface Error400 extends ErrorResponse {
  errCode: '400'
  errMessage: '请求参数错误'
}

export interface Error401 extends ErrorResponse {
  errCode: '401'
  errMessage: '未授权或token无效'
}

export interface Error403 extends ErrorResponse {
  errCode: '403'
  errMessage: '权限不足'
}

export interface Error404 extends ErrorResponse {
  errCode: '404'
  errMessage: '资源未找到'
}

export interface Error500 extends ErrorResponse {
  errCode: '500'
  errMessage: '服务器内部错误'
}

