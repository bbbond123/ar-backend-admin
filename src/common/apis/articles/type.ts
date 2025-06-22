/** 文章基础信息 */
export interface Article {
  id: string
  title: string
  content: string
  summary?: string
  author: string
  category?: string
  tags?: string[]
  cover_image?: string
  images?: string[]
  status: 'draft' | 'published' | 'archived'
  view_count: number
  like_count: number
  comment_count: number
  location?: {
    latitude: number
    longitude: number
    address?: string
  }
  created_at: string
  updated_at: string
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
  content: string
  summary?: string
  category?: string
  tags?: string[]
  cover_image?: string
  status: 'draft' | 'published'
  location?: {
    latitude: number
    longitude: number
    address?: string
  }
}

/** 更新文章请求 */
export interface UpdateArticleRequest {
  title?: string
  content?: string
  summary?: string
  category?: string
  tags?: string[]
  cover_image?: string
  status?: 'draft' | 'published' | 'archived'
  location?: {
    latitude: number
    longitude: number
    address?: string
  }
}

/** 文章列表请求 */
export interface ArticleListRequest {
  page?: number
  pageSize?: number
  category?: string
  author?: string
  status?: 'draft' | 'published' | 'archived'
  keyword?: string
  start_date?: string
  end_date?: string
  sort_by?: 'created_at' | 'updated_at' | 'view_count' | 'like_count'
  sort_order?: 'asc' | 'desc'
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
