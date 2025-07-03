import type { PaginationRequest } from "../type"

/** 商店基础信息 */
export interface Store {
  store_id: number
  store_name: string
  store_category: string
  description?: string
  address: string
  location: string
  latitude: number
  longitude: number
  phone_number: string
  business_hours: string
  rating_score: number
  created_at: string
  updated_at: string
}

/** 创建商店请求 */
export interface CreateStoreRequest {
  store_name: string
  store_category: string
  description?: string
  address: string
  location: string
  latitude: number
  longitude: number
  phone_number: string
  business_hours: string
  rating_score: number
}

/** 更新商店请求 */
export interface UpdateStoreRequest {
  store_id: number
  store_name?: string
  store_category?: string
  description?: string
  address?: string
  location?: string
  latitude?: number
  longitude?: number
  phone_number?: string
  business_hours?: string
  rating_score?: number
}

/** 商店列表请求 */
export interface StoreListRequest extends PaginationRequest {
  store_category?: string
  rating_min?: number
  rating_max?: number
}

/** 商店标签 */
export interface StoreTag {
  tag_id: number
  tag_name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

/** 创建标签请求 */
export interface CreateTagRequest {
  tag_name: string
  is_active?: boolean
}

/** 更新标签请求 */
export interface UpdateTagRequest {
  tag_id: number
  tag_name?: string
  is_active?: boolean
}

/** 标签列表请求 */
export interface TagListRequest extends PaginationRequest {
  is_active?: boolean
}
