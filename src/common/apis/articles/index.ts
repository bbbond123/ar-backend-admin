import type * as Articles from "./type"
import { request } from "@/http/axios"
import { Article, ArticleComments, LikeAricle } from "./type"
import { IBaseResponse, IResponse } from "../type"

/** 获取文章列表 */
export function getArticleListApi(data: Articles.ArticleListRequest): Promise<IResponse<Article>> {
  return request({
    url: "articles/list",
    method: "post",
    data
  })
}

/** 获取文章统计信息 */
export function getArticleStatsApi(data: Articles.ArticleStatsRequest): Promise<IResponse<Articles.ArticleStatsResponse>> {
  return request({
    url: "articles/stats",
    method: "post",
    data
  })
}

/** 获取文章详情 */
export function getArticleApi(articleId: number): Promise<IBaseResponse<Article>> {
  return request({
    url: `api/articles/${articleId}`,
    method: "get"
  })
}

/** 创建文章 */
export function createArticleApi(data: Articles.CreateArticleRequest): Promise<IBaseResponse<Article>> {
  return request({
    url: "articles",
    method: "post",
    data
  })
}

/** 创建文章（支持图片上传） */
export function createArticleWithImageApi(data: Articles.CreateArticleWithImageRequest): Promise<IBaseResponse<Article>> {
  const formData = new FormData()

  // 添加文章基本信息
  Object.keys(data).forEach(key => {
    if (key === 'images') return
    const value = data[key as keyof Articles.CreateArticleWithImageRequest]
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value))
      } else {
        formData.append(key, String(value))
      }
    }
  })

  // 添加图片文件
  if (data.images && data.images.length > 0) {
    data.images.forEach((file, index) => {
      formData.append(`images`, file)
    })
  }

  return request({
    url: "articles/with-image",
    method: "post",
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/** 更新文章 */
export function updateArticleApi(data: Articles.UpdateArticleRequest): Promise<IBaseResponse<Article>> {
  return request({
    url: "articles",
    method: "put",
    data
  })
}

/** 删除文章 */
export function deleteArticleApi(articleId: number): Promise<IBaseResponse<boolean>> {
  return request({
    url: `articles/${articleId}`,
    method: "delete"
  })
}

/** 获取文章评论 */
export function getArticleCommentsApi(articleId: number): Promise<IBaseResponse<ArticleComments>> {
  return request({
    url: `articles/${articleId}/comments`,
    method: "get"
  })
}

/** 文章点赞 */
export function likeArticleApi(articleId: number): Promise<IBaseResponse<LikeAricle>> {
  return request({
    url: `articles/${articleId}/like`,
    method: "post"
  })
}

/** 搜索附近文章 */
export function getNearbyArticlesApi(data: Articles.NearbyArticlesRequest): Promise<IResponse<Article>> {
  return request({
    url: "articles/nearby",
    method: "post",
    data
  })
}
