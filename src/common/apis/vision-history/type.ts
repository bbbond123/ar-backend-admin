import type { DateRangeRequest, PaginationRequest } from "../type"

/** 地标结果 */
export interface LandmarkResult {
  name: string
  confidence: number
  latitude?: number
  longitude?: number
  description?: string
}

/** 推荐项目 */
export interface RecommendationItem {
  name: string
  type: string
  distance: number
  rating?: number
  description?: string
}

/** 视觉识别历史记录 */
export interface VisionHistory {
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

/** 创建视觉识别历史请求 */
export interface CreateVisionHistoryRequest {
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

/** 更新视觉识别历史请求 */
export interface UpdateVisionHistoryRequest {
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

/** 视觉识别历史列表请求 */
export interface VisionHistoryListRequest extends PaginationRequest, DateRangeRequest {
  user_id?: number
  api_source?: string
  country?: string
  is_in_japan?: boolean
  has_landmark?: boolean
  min_score?: number
}

/** API 来源统计 */
export interface APISourceStats {
  api_source: string
  count: number
  avg_score: number
}

/** 国家统计 */
export interface CountryStats {
  country: string
  count: number
}

/** 视觉识别历史统计信息 */
export interface VisionHistoryStatistics {
  total_records: number
  unique_users: number
  total_landmarks: number
  japan_records: number
  international_records: number
  anonymous_records: number
  avg_confidence_score: number
  api_source_stats: APISourceStats[]
  top_countries: CountryStats[]
  timestamp: string
}

/** 视觉识别结果 */
export interface VisionHistoryResult {
  api_source: string
  has_landmark: boolean
  landmarks: LandmarkResult[]
  labels: string[]
  text_content?: string
  country?: string
  is_in_japan: boolean
  processed_at: string
  saved_to_database: boolean
  error_message?: string
  nearby_recommendations: RecommendationItem[]
}
