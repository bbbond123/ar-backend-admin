import type { ApiResponse, PaginationResponse } from "../type"
import type {
  CreateVisitHistoryRequest,
  UpdateVisitHistoryRequest,
  VisitHistory,
  VisitHistoryListRequest,
  VisitHistoryResult
} from "./type"
import { request } from "@/http/axios"

const BASE_URL = "/api/v1/visit-history"

/** 获取访问历史列表 */
export function getVisitHistoryListApi(params: VisitHistoryListRequest) {
  return request<ApiResponse<PaginationResponse<VisitHistory>>>({
    url: `${BASE_URL}/list`,
    method: "get",
    params
  })
}

/** 获取访问历史详情 */
export function getVisitHistoryDetailApi(visionId: number) {
  return request<ApiResponse<VisitHistory>>({
    url: `${BASE_URL}/${visionId}`,
    method: "get"
  })
}

/** 创建访问历史 */
export function createVisitHistoryApi(data: CreateVisitHistoryRequest) {
  return request<ApiResponse<VisitHistory>>({
    url: BASE_URL,
    method: "post",
    data
  })
}

/** 更新访问历史 */
export function updateVisitHistoryApi(data: UpdateVisitHistoryRequest) {
  return request<ApiResponse<VisitHistory>>({
    url: `${BASE_URL}/${data.vision_id}`,
    method: "put",
    data
  })
}

/** 删除访问历史 */
export function deleteVisitHistoryApi(visionId: number) {
  return request<ApiResponse<void>>({
    url: `${BASE_URL}/${visionId}`,
    method: "delete"
  })
}

/** 处理访问记录 */
export function processVisitApi(imageFile: File, userId?: number) {
  const formData = new FormData()
  formData.append("image", imageFile)
  if (userId) {
    formData.append("user_id", userId.toString())
  }

  return request<ApiResponse<VisitHistoryResult>>({
    url: `${BASE_URL}/process`,
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data: formData
  })
}

/** 获取用户的访问历史 */
export function getUserVisitHistoryApi(userId: number) {
  return request<ApiResponse<VisitHistory[]>>({
    url: `${BASE_URL}/users/${userId}`,
    method: "get"
  })
}

/** 获取特定地区的访问历史 */
export function getLocationVisitHistoryApi(latitude: number, longitude: number, radius: number = 1) {
  return request<ApiResponse<VisitHistory[]>>({
    url: `${BASE_URL}/location`,
    method: "get",
    params: {
      latitude,
      longitude,
      radius
    }
  })
}
