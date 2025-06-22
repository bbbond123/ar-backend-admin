import type { ResponseType } from 'axios'

export interface IResponse<T> {
  data: T[]
  code: number
  message: string
  total: number
  page: number
  page_size: number
}

export interface IBaseResponse<T> {
  data: T
  success: boolean // 请求是否成功
  code: string // 错误码，optional
  errMessage: string // 错误信息，optional
}

