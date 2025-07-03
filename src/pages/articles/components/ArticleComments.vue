<script setup lang="ts">
import type { ArticleComment } from "@@/apis/articles/type"
import { getArticleCommentsApi } from "@@/apis/articles"
import { RefreshRight, Star } from "@element-plus/icons-vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { computed, ref, watch } from "vue"

interface Props {
  modelValue: boolean
  articleId: number
  articleTitle: string
}

interface Emits {
  (e: "update:modelValue", value: boolean): void
}

// 扩展评论类型，支持回复
interface CommentWithReplies extends ArticleComment {
  replies?: ArticleComment[]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const dialogVisible = ref(false)
const loading = ref(false)
const rawComments = ref<ArticleComment[]>([])

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (val) => {
    dialogVisible.value = val
    if (val && props.articleId) {
      getComments()
    }
  },
  { immediate: true }
)

// 监听 dialogVisible 变化
watch(dialogVisible, (val) => {
  emit("update:modelValue", val)
})

// 处理嵌套评论结构
const comments = computed(() => {
  const commentMap = new Map<string, CommentWithReplies>()
  const rootComments: CommentWithReplies[] = []

  // 首先创建所有评论的映射
  rawComments.value.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] })
  })

  // 然后建立父子关系
  rawComments.value.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id)!

    if (comment.parent_id) {
      // 这是一个回复
      const parent = commentMap.get(comment.parent_id)
      if (parent) {
        parent.replies = parent.replies || []
        parent.replies.push(commentWithReplies)
      }
    } else {
      // 这是一个根评论
      rootComments.push(commentWithReplies)
    }
  })

  return rootComments
})

// 总评论数
const totalComments = computed(() => rawComments.value.length)

// 获取评论列表
async function getComments() {
  if (!props.articleId) return

  loading.value = true
  try {
    const res = await getArticleCommentsApi(props.articleId)
    if (res.success) {
      rawComments.value = res.data.comments
    } else {
      ElMessage.error(res.errMessage || "获取评论失败")
    }
  } catch (error) {
    console.error("获取评论失败:", error)
    ElMessage.error("获取评论失败")
  } finally {
    loading.value = false
  }
}

// 删除评论
function handleDeleteComment(comment: ArticleComment) {
  ElMessageBox.confirm(
    `确认删除用户 ${comment.username} 的评论吗？`,
    "删除确认",
    {
      confirmButtonText: "确定删除",
      cancelButtonText: "取消",
      type: "warning"
    }
  ).then(async () => {
    try {
      // 这里应该调用删除评论的 API
      // await deleteCommentApi(comment.id)
      ElMessage.success("评论删除成功")
      getComments() // 重新加载评论
    } catch (error) {
      console.error("删除评论失败:", error)
      ElMessage.error("删除评论失败")
    }
  })
}

// 生成头像URL
function getAvatarUrl(username: string) {
  // 这里可以根据用户名生成头像，或者返回默认头像
  return `https://api.dicebear.com/7.x/initials/svg?seed=${username}`
}

// 格式化日期时间
function formatDateTime(dateTime: string) {
  const date = new Date(dateTime)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  // 小于1分钟
  if (diff < 60 * 1000) {
    return "刚刚"
  }
  // 小于1小时
  if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))} 分钟前`
  }
  // 小于1天
  if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))} 小时前`
  }
  // 小于7天
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))} 天前`
  }

  // 超过7天显示具体日期
  return date.toLocaleString("zh-CN")
}

// 关闭弹窗
function handleClose() {
  dialogVisible.value = false
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="`文章评论 - ${articleTitle}`"
    width="80%"
    :close-on-click-modal="false"
  >
    <div v-loading="loading" class="comments-container">
      <div class="comments-header">
        <el-statistic title="总评论数" :value="totalComments" />
        <el-button type="primary" :icon="RefreshRight" @click="getComments">
          刷新
        </el-button>
      </div>

      <div class="comments-list">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="comment-item"
        >
          <div class="comment-header">
            <div class="comment-user">
              <el-avatar :size="40" :src="getAvatarUrl(comment.username)">
                {{ comment.username.charAt(0).toUpperCase() }}
              </el-avatar>
              <div class="user-info">
                <span class="username">{{ comment.username }}</span>
                <span class="comment-time">{{ formatDateTime(comment.created_at) }}</span>
              </div>
            </div>
            <div class="comment-actions">
              <el-tag v-if="comment.parent_id" type="info" size="small">
                回复
              </el-tag>
              <el-button
                type="danger"
                text
                size="small"
                @click="handleDeleteComment(comment)"
              >
                删除
              </el-button>
            </div>
          </div>

          <div class="comment-content">
            {{ comment.content }}
          </div>

          <div class="comment-footer">
            <div class="comment-stats">
              <span class="like-count">
                <el-icon><Star /></el-icon>
                {{ comment.like_count }}
              </span>
            </div>
          </div>

          <!-- 子评论 -->
          <div v-if="comment.replies && comment.replies.length" class="comment-replies">
            <div
              v-for="reply in comment.replies"
              :key="reply.id"
              class="reply-item"
            >
              <div class="reply-header">
                <div class="reply-user">
                  <el-avatar :size="32" :src="getAvatarUrl(reply.username)">
                    {{ reply.username.charAt(0).toUpperCase() }}
                  </el-avatar>
                  <div class="user-info">
                    <span class="username">{{ reply.username }}</span>
                    <span class="reply-time">{{ formatDateTime(reply.created_at) }}</span>
                  </div>
                </div>
                <el-button
                  type="danger"
                  text
                  size="small"
                  @click="handleDeleteComment(reply)"
                >
                  删除
                </el-button>
              </div>
              <div class="reply-content">
                {{ reply.content }}
              </div>
            </div>
          </div>
        </div>

        <el-empty v-if="!comments.length && !loading" description="暂无评论" />
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.comments-container {
  .comments-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid #ebeef5;
  }

  .comments-list {
    max-height: 600px;
    overflow-y: auto;

    .comment-item {
      margin-bottom: 20px;
      padding: 16px;
      background-color: #fafafa;
      border-radius: 8px;

      .comment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .comment-user {
          display: flex;
          align-items: center;
          gap: 12px;

          .user-info {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .username {
              font-weight: 500;
              color: #303133;
            }

            .comment-time {
              font-size: 12px;
              color: #909399;
            }
          }
        }

        .comment-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      }

      .comment-content {
        margin-bottom: 12px;
        line-height: 1.6;
        color: #606266;
        white-space: pre-wrap;
      }

      .comment-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .comment-stats {
          display: flex;
          gap: 16px;

          .like-count {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 14px;
            color: #909399;
          }
        }
      }

      .comment-replies {
        margin-top: 16px;
        padding-left: 20px;
        border-left: 2px solid #e4e7ed;

        .reply-item {
          margin-bottom: 12px;
          padding: 12px;
          background-color: #ffffff;
          border-radius: 6px;

          .reply-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;

            .reply-user {
              display: flex;
              align-items: center;
              gap: 8px;

              .user-info {
                display: flex;
                flex-direction: column;
                gap: 2px;

                .username {
                  font-size: 14px;
                  font-weight: 500;
                  color: #303133;
                }

                .reply-time {
                  font-size: 12px;
                  color: #909399;
                }
              }
            }
          }

          .reply-content {
            font-size: 14px;
            line-height: 1.5;
            color: #606266;
            white-space: pre-wrap;
          }
        }
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
