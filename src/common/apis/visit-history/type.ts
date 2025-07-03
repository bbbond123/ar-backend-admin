import type { PaginationRequest } from '../type'

/** 访问历史记录 */
export interface VisitHistory {
  vision_id: number
  user_id?: number
  image_file_id: number
  api_source: string
  recognized_landmarks: string
  recognized_labels: string
  text_content?: string
  confidence_score: number
  location_latitude?: number
  location_longitude?: number
  country?: string
  is_in_japan: boolean
  processed_at: string
  created_at: string
  updated_at: string
}

/** 创建访问历史请求 */
export interface CreateVisitHistoryRequest {
  user_id?: number
  image_file_id: number
  api_source: string
  recognized_landmarks: string
  recognized_labels: string
  text_content?: string
  confidence_score: number
  location_latitude?: number
  location_longitude?: number
  country?: string
  is_in_japan: boolean
}

/** 更新访问历史请求 */
export interface UpdateVisitHistoryRequest {
  vision_id: number
  user_id?: number
  image_file_id?: number
  api_source?: string
  recognized_landmarks?: string
  recognized_labels?: string
  text_content?: string
  confidence_score?: number
  location_latitude?: number
  location_longitude?: number
  country?: string
  is_in_japan?: boolean
}

/** 访问历史列表请求 */
export interface VisitHistoryListRequest extends PaginationRequest {
  user_id?: number
  country?: string
  is_in_japan?: boolean
}

/** 访问历史结果 */
export interface VisitHistoryResult {
  api_source: string
  has_landmark: boolean
  landmarks: {
    name: string
    confidence: number
    latitude?: number
    longitude?: number
    description?: string
  }[]
  labels: string[]
  text_content?: string
  country?: string
  is_in_japan: boolean
  processed_at: string
  saved_to_database: boolean
  error_message?: string
  nearby_recommendations: {
    name: string
    type: string
    distance: number
    rating?: number
    description?: string
  }[]
} 