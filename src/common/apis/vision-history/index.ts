import type { ApiResponse, PaginationResponse } from '../type'
import type {
  VisionHistory,
  CreateVisionHistoryRequest,
  UpdateVisionHistoryRequest,
  VisionHistoryListRequest,
  VisionHistoryStatistics,
  VisionHistoryResult
} from './type'
import { request } from '@/http/axios'

const BASE_URL = '/api/v1/vision-history'

/** 获取视觉识别历史列表 */
export function getVisionHistoryListApi(params: VisionHistoryListRequest) {
  return request<ApiResponse<PaginationResponse<VisionHistory>>>({
    url: `${BASE_URL}/list`,
    method: 'get',
    params
  })
}

/** 获取视觉识别历史详情 */
export function getVisionHistoryDetailApi(visionId: number) {
  return request<ApiResponse<VisionHistory>>({
    url: `${BASE_URL}/${visionId}`,
    method: 'get'
  })
}

/** 创建视觉识别历史 */
export function createVisionHistoryApi(data: CreateVisionHistoryRequest) {
  return request<ApiResponse<VisionHistory>>({
    url: BASE_URL,
    method: 'post',
    data
  })
}

/** 更新视觉识别历史 */
export function updateVisionHistoryApi(data: UpdateVisionHistoryRequest) {
  return request<ApiResponse<VisionHistory>>({
    url: `${BASE_URL}/${data.vision_id}`,
    method: 'put',
    data
  })
}

/** 删除视觉识别历史 */
export function deleteVisionHistoryApi(visionId: number) {
  return request<ApiResponse<void>>({
    url: `${BASE_URL}/${visionId}`,
    method: 'delete'
  })
}

/** 获取视觉识别历史统计信息 */
export function getVisionHistoryStatisticsApi() {
  return request<ApiResponse<VisionHistoryStatistics>>({
    url: `${BASE_URL}/statistics`,
    method: 'get'
  })
}

/** 处理图片识别 */
export function processImageApi(imageFile: File, userId?: number) {
  const formData = new FormData()
  formData.append('image', imageFile)
  if (userId) {
    formData.append('user_id', userId.toString())
  }

  return request<ApiResponse<VisionHistoryResult>>({
    url: `${BASE_URL}/process`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

/** 获取用户的视觉识别历史统计 */
export function getUserVisionHistoryStatsApi(userId: number) {
  return request<ApiResponse<VisionHistoryStatistics>>({
    url: `${BASE_URL}/users/${userId}/statistics`,
    method: 'get'
  })
}

/** 获取特定地区的视觉识别历史 */
export function getLocationVisionHistoryApi(latitude: number, longitude: number, radius: number = 1) {
  return request<ApiResponse<VisionHistory[]>>({
    url: `${BASE_URL}/location`,
    method: 'get',
    params: {
      latitude,
      longitude,
      radius
    }
  })
} 