import type { ApiResponse, PaginationResponse } from "../type"
import type {
  CreateStoreRequest,
  CreateTagRequest,
  Store,
  StoreListRequest,
  StoreTag,
  TagListRequest,
  UpdateStoreRequest,
  UpdateTagRequest
} from "./type"
import { request } from "@/http/axios"

const BASE_URL = "/api/v1/stores"
const TAG_URL = "/api/v1/tags"

/** 获取商店列表 */
export function getStoreListApi(params: StoreListRequest) {
  return request<ApiResponse<PaginationResponse<Store>>>({
    url: `${BASE_URL}/list`,
    method: "get",
    params
  })
}

/** 获取商店详情 */
export function getStoreDetailApi(storeId: number) {
  return request<ApiResponse<Store>>({
    url: `${BASE_URL}/${storeId}`,
    method: "get"
  })
}

/** 创建商店 */
export function createStoreApi(data: CreateStoreRequest) {
  return request<ApiResponse<Store>>({
    url: BASE_URL,
    method: "post",
    data
  })
}

/** 更新商店 */
export function updateStoreApi(data: UpdateStoreRequest) {
  return request<ApiResponse<Store>>({
    url: `${BASE_URL}/${data.store_id}`,
    method: "put",
    data
  })
}

/** 删除商店 */
export function deleteStoreApi(storeId: number) {
  return request<ApiResponse<void>>({
    url: `${BASE_URL}/${storeId}`,
    method: "delete"
  })
}

/** 获取标签列表 */
export function getTagListApi(params: TagListRequest) {
  return request<ApiResponse<PaginationResponse<StoreTag>>>({
    url: `${TAG_URL}/list`,
    method: "get",
    params
  })
}

/** 创建标签 */
export function createTagApi(data: CreateTagRequest) {
  return request<ApiResponse<StoreTag>>({
    url: TAG_URL,
    method: "post",
    data
  })
}

/** 更新标签 */
export function updateTagApi(data: UpdateTagRequest) {
  return request<ApiResponse<StoreTag>>({
    url: `${TAG_URL}/${data.tag_id}`,
    method: "put",
    data
  })
}

/** 删除标签 */
export function deleteTagApi(tagId: number) {
  return request<ApiResponse<void>>({
    url: `${TAG_URL}/${tagId}`,
    method: "delete"
  })
}

/** 获取商店标签 */
export function getStoreTagsApi(storeId: number) {
  return request<ApiResponse<StoreTag[]>>({
    url: `${BASE_URL}/${storeId}/tags`,
    method: "get"
  })
}

/** 添加商店标签 */
export function addStoreTagApi(storeId: number, tagId: number) {
  return request<ApiResponse<void>>({
    url: `${BASE_URL}/${storeId}/tags/${tagId}`,
    method: "post"
  })
}

/** 移除商店标签 */
export function removeStoreTagApi(storeId: number, tagId: number) {
  return request<ApiResponse<void>>({
    url: `${BASE_URL}/${storeId}/tags/${tagId}`,
    method: "delete"
  })
}
