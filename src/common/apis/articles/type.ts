/** 文章状态 */
export type ArticleStatus = "draft" | "published" | "archived"

/** 文章基础信息 */
export interface Article {
  articleId: number
  title: string
  bodyText: string
  summary?: string
  category?: string
  status?: ArticleStatus
  tags?: string[]
  address?: string
  locationName?: string
  latitude?: number
  longitude?: number
  imageUrl?: string
  imageFileId?: number
  articleImage?: number[]
  likeCount: number
  commentCount: number
  createdAt: string
  updatedAt: string
}

/** 文章评论 */
export interface ArticleComment {
  id: string
  article_id: string
  user_id: string
  username: string
  content: string
  parent_id?: string
  like_count: number
  created_at: string
  updated_at: string
}

/** 创建文章请求 */
export interface CreateArticleRequest {
  title: string
  bodyText?: string
  summary?: string
  category?: string
  status?: ArticleStatus
  tags?: string[]
  address?: string
  locationName?: string
  latitude?: number
  longitude?: number
  imageFileId?: number
  articleImage?: number[]
  likeCount?: number
  commentCount?: number
}

/** 更新文章请求 */
export interface UpdateArticleRequest {
  articleId: number
  title?: string
  bodyText?: string
  summary?: string
  category?: string
  status?: ArticleStatus
  tags?: string[]
  address?: string
  locationName?: string
  latitude?: number
  longitude?: number
  imageFileId?: number
  articleImage?: number[]
  likeCount?: number
  commentCount?: number
}

/** 文章列表请求 */
export interface ArticleListRequest {
  page: number
  pageSize: number
  title?: string
  bodyText?: string
  summary?: string
  category?: string
  status?: ArticleStatus
  tags?: string[]
  address?: string
  locationName?: string
  latitude?: number
  longitude?: number
  likeCount?: number
  commentCount?: number
}

/** 文章统计请求 */
export interface ArticleStatsRequest {
  page: number
  pageSize: number
  category?: string
  status?: ArticleStatus
  keyword?: string
}

/** 文章统计响应 */
export interface ArticleStatsResponse {
  currentPage: number
  pageSize: number
  total: number
  hasPrev: boolean
  hasNext: boolean
  articles: Article[]
}

/** 附近文章请求 */
export interface NearbyArticlesRequest {
  latitude: number
  longitude: number
  radius?: number // 半径，单位：公里
  limit?: number
}

/** 带图片上传的文章创建请求 */
export interface CreateArticleWithImageRequest extends CreateArticleRequest {
  images?: File[]
}

export interface ArticleComments {
  comments: ArticleComment[]
  total: number
}

export interface LikeAricle {
  liked: boolean
  like_count: number
}
