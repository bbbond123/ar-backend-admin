import type * as Articles from "./type"
import { request } from "@/http/axios"
import { Article } from "./type"
import { IBaseResponse, IResponse } from "../type"

/** 获取文章列表 */
export function getArticleListApi(data: Articles.ArticleListRequest) {
  return request<IResponse<Article>>({
    url: "articles/list",
    method: "post",
    data
  })
}

/** 获取文章详情 */
export function getArticleApi(articleId: string) {
  return request<IBaseResponse<Article>>({
    url: `articles/${articleId}`,
    method: "get"
  })
}

/** 创建文章 */
export function createArticleApi(data: Articles.CreateArticleRequest) {
  return request<IBaseResponse<Article>>({
    url: "articles",
    method: "post",
    data
  })
}

/** 创建文章（支持图片上传） */
export function createArticleWithImageApi(data: Articles.CreateArticleWithImageRequest) {
  const formData = new FormData()

  // 添加文章基本信息
  Object.keys(data).forEach(key => {
    if (key === 'images') return
    const value = data[key as keyof Articles.CreateArticleWithImageRequest]
    if (value !== undefined && value !== null) {
      if (typeof value === 'object') {
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

  return request<IBaseResponse<Article>>({
    url: "articles/with-image",
    method: "post",
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/** 更新文章 */
export function updateArticleApi(articleId: string, data: Articles.UpdateArticleRequest) {
  return request<IBaseResponse<Article>>({
    url: "articles",
    method: "put",
    data: { ...data, id: articleId }
  })
}

/** 删除文章 */
export function deleteArticleApi(articleId: string) {
  return request<IBaseResponse<boolean>>({
    url: `articles/${articleId}`,
    method: "delete"
  })
}

/** 获取文章评论 */
export function getArticleCommentsApi(articleId: string) {
  return request<IBaseResponse<{
    comments: Articles.ArticleComment[]
    total: number
  }>>({
    url: `articles/${articleId}/comments`,
    method: "get"
  })
}

/** 文章点赞 */
export function likeArticleApi(articleId: string) {
  return request<IBaseResponse<{
    liked: boolean
    like_count: number
  }>>({
    url: `articles/${articleId}/like`,
    method: "post"
  })
}

/** 搜索附近文章 */
export function getNearbyArticlesApi(data: Articles.NearbyArticlesRequest) {
  return request<IResponse<Articles.Article>>({
    url: "articles/nearby",
    method: "post",
    data
  })
}
