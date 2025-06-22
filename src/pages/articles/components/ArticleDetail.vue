<template>
  <el-dialog
    v-model="dialogVisible"
    title="文章详情"
    width="80%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div v-loading="loading" class="article-detail">
      <template v-if="articleData">
        <!-- 文章头部信息 -->
        <div class="article-header">
          <h1 class="article-title">{{ articleData.title }}</h1>
          <div class="article-meta">
            <el-tag :type="getStatusTagType(articleData.status)" size="small">
              {{ getStatusText(articleData.status) }}
            </el-tag>
            <span class="meta-item">作者：{{ articleData.author }}</span>
            <span class="meta-item" v-if="articleData.category"
              >分类：{{ articleData.category }}</span
            >
            <span class="meta-item"
              >创建时间：{{ formatDateTime(articleData.created_at) }}</span
            >
            <span class="meta-item"
              >更新时间：{{ formatDateTime(articleData.updated_at) }}</span
            >
          </div>
          <div class="article-stats">
            <el-tag type="info" size="small"
              >浏览：{{ articleData.view_count }}</el-tag
            >
            <el-tag type="success" size="small"
              >点赞：{{ articleData.like_count }}</el-tag
            >
            <el-tag type="warning" size="small"
              >评论：{{ articleData.comment_count }}</el-tag
            >
          </div>
        </div>

        <!-- 文章封面图 -->
        <div v-if="articleData.cover_image" class="article-cover">
          <el-image
            :src="articleData.cover_image"
            fit="cover"
            class="cover-image"
            :preview-src-list="[articleData.cover_image]"
          />
        </div>

        <!-- 文章摘要 -->
        <div v-if="articleData.summary" class="article-summary">
          <h3>摘要</h3>
          <p>{{ articleData.summary }}</p>
        </div>

        <!-- 文章标签 -->
        <div
          v-if="articleData.tags && articleData.tags.length"
          class="article-tags"
        >
          <h3>标签</h3>
          <el-tag
            v-for="tag in articleData.tags"
            :key="tag"
            size="small"
            type="primary"
            effect="plain"
            style="margin-right: 8px"
          >
            {{ tag }}
          </el-tag>
        </div>

        <!-- 文章内容 -->
        <div class="article-content">
          <h3>内容</h3>
          <div class="content-body" v-html="articleData.content"></div>
        </div>

        <!-- 文章图片 -->
        <div
          v-if="articleData.images && articleData.images.length"
          class="article-images"
        >
          <h3>相关图片</h3>
          <div class="image-gallery">
            <el-image
              v-for="(image, index) in articleData.images"
              :key="index"
              :src="image"
              fit="cover"
              class="gallery-image"
              :preview-src-list="articleData.images"
              :initial-index="index"
            />
          </div>
        </div>

        <!-- 位置信息 -->
        <div v-if="articleData.location" class="article-location">
          <h3>位置信息</h3>
          <p>
            <el-icon><Location /></el-icon>
            <span v-if="articleData.location.address">{{
              articleData.location.address
            }}</span>
            <span v-else>
              纬度：{{ articleData.location.latitude }}，经度：{{
                articleData.location.longitude
              }}
            </span>
          </p>
        </div>
      </template>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="handleEdit">编辑文章</el-button>
        <el-button type="success" @click="handleLike" :loading="liking">
          点赞 ({{ articleData?.like_count || 0 }})
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { Location } from "@element-plus/icons-vue";
import { getArticleApi, likeArticleApi } from "@@/apis/articles";
import type { Article } from "@@/apis/articles/type";

interface Props {
  modelValue: boolean;
  articleId: string;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "refresh"): void;
  (e: "edit", articleId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const dialogVisible = ref(false);
const loading = ref(false);
const liking = ref(false);
const articleData = ref<Article | null>(null);

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (val) => {
    dialogVisible.value = val;
    if (val && props.articleId) {
      getArticleDetail();
    }
  },
  { immediate: true }
);

// 监听 dialogVisible 变化
watch(dialogVisible, (val) => {
  emit("update:modelValue", val);
});

// 获取文章详情
const getArticleDetail = async () => {
  if (!props.articleId) return;

  loading.value = true;
  try {
    const res = await getArticleApi(props.articleId);
    if (res.success) {
      articleData.value = res.data;
    } else {
      ElMessage.error(res.errMessage || "获取文章详情失败");
    }
  } catch (error) {
    console.error("获取文章详情失败:", error);
    ElMessage.error("获取文章详情失败");
  } finally {
    loading.value = false;
  }
};

// 关闭弹窗
const handleClose = () => {
  dialogVisible.value = false;
  articleData.value = null;
};

// 编辑文章
const handleEdit = () => {
  emit("edit", props.articleId);
  handleClose();
};

// 点赞文章
const handleLike = async () => {
  if (!props.articleId) return;

  liking.value = true;
  try {
    const res = await likeArticleApi(props.articleId);
    if (res.success) {
      if (articleData.value) {
        articleData.value.like_count = res.data.like_count;
      }
      ElMessage.success(res.data.liked ? "点赞成功" : "取消点赞");
      emit("refresh");
    } else {
      ElMessage.error(res.errMessage || "点赞失败");
    }
  } catch (error) {
    console.error("点赞失败:", error);
    ElMessage.error("点赞失败");
  } finally {
    liking.value = false;
  }
};

// 状态标签类型
const getStatusTagType = (status: string): any => {
  switch (status) {
    case "published":
      return "success";
    case "draft":
      return "warning";
    case "archived":
      return "info";
    default:
      return "";
  }
};

// 状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case "published":
      return "已发布";
    case "draft":
      return "草稿";
    case "archived":
      return "已归档";
    default:
      return status;
  }
};

// 格式化日期时间
const formatDateTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleString("zh-CN");
};
</script>

<style lang="scss" scoped>
.article-detail {
  .article-header {
    margin-bottom: 24px;
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 16px;

    .article-title {
      font-size: 28px;
      font-weight: bold;
      margin: 0 0 12px 0;
      color: #303133;
    }

    .article-meta {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
      color: #606266;
      font-size: 14px;

      .meta-item {
        display: flex;
        align-items: center;
      }
    }

    .article-stats {
      display: flex;
      gap: 8px;
    }
  }

  .article-cover {
    margin-bottom: 24px;

    .cover-image {
      width: 100%;
      max-height: 400px;
      border-radius: 8px;
    }
  }

  .article-summary {
    margin-bottom: 24px;
    padding: 16px;
    background-color: #f5f7fa;
    border-radius: 8px;

    h3 {
      margin: 0 0 12px 0;
      color: #303133;
    }

    p {
      margin: 0;
      color: #606266;
      line-height: 1.6;
    }
  }

  .article-tags {
    margin-bottom: 24px;

    h3 {
      margin: 0 0 12px 0;
      color: #303133;
    }
  }

  .article-content {
    margin-bottom: 24px;

    h3 {
      margin: 0 0 16px 0;
      color: #303133;
    }

    .content-body {
      line-height: 1.8;
      color: #303133;

      :deep(p) {
        margin-bottom: 12px;
      }

      :deep(img) {
        max-width: 100%;
        height: auto;
        border-radius: 4px;
      }
    }
  }

  .article-images {
    margin-bottom: 24px;

    h3 {
      margin: 0 0 16px 0;
      color: #303133;
    }

    .image-gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 12px;

      .gallery-image {
        width: 100%;
        height: 150px;
        border-radius: 8px;
        cursor: pointer;
      }
    }
  }

  .article-location {
    h3 {
      margin: 0 0 12px 0;
      color: #303133;
    }

    p {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      color: #606266;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
