<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑文章' : '新增文章'"
    width="90%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div v-loading="loading">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
        class="article-form"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="文章标题" prop="title">
              <el-input
                v-model="formData.title"
                placeholder="请输入文章标题"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文章状态" prop="status">
              <el-select v-model="formData.status" placeholder="请选择状态">
                <el-option label="草稿" value="draft" />
                <el-option label="已发布" value="published" />
                <el-option label="已归档" value="archived" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="文章分类" prop="category">
              <el-input
                v-model="formData.category"
                placeholder="请输入文章分类"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文章标签" prop="tags">
              <el-select
                v-model="formData.tags"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请输入标签，支持多个"
                style="width: 100%"
              >
                <el-option
                  v-for="tag in commonTags"
                  :key="tag"
                  :label="tag"
                  :value="tag"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="文章摘要" prop="summary">
          <el-input
            v-model="formData.summary"
            type="textarea"
            :rows="3"
            placeholder="请输入文章摘要"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="封面图片" prop="cover_image">
          <div class="cover-upload">
            <el-upload
              class="cover-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="handleCoverUpload"
              accept="image/*"
            >
              <img
                v-if="formData.imageUrl"
                :src="formData.imageUrl"
                class="cover"
              />
              <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="cover-actions" v-if="formData.imageUrl">
              <el-button size="small" type="danger" @click="removeCover"
                >删除封面</el-button
              >
            </div>
          </div>
        </el-form-item>

        <el-form-item label="文章内容" prop="bodyText">
          <el-input
            v-model="formData.bodyText"
            type="textarea"
            :rows="15"
            placeholder="请输入文章内容"
            class="content-textarea"
          />
        </el-form-item>

        <!-- 位置信息 -->
        <el-form-item label="位置信息">
          <div class="location-section">
            <el-checkbox
              v-model="enableLocation"
              @change="handleLocationToggle"
            >
              启用位置信息
            </el-checkbox>
            <template v-if="enableLocation">
              <el-row :gutter="20" style="margin-top: 12px">
                <el-col :span="8">
                  <el-input
                    v-model="formData.latitude"
                    placeholder="纬度"
                    type="number"
                  />
                </el-col>
                <el-col :span="8">
                  <el-input
                    v-model="formData.longitude"
                    placeholder="经度"
                    type="number"
                  />
                </el-col>
                <el-col :span="8">
                  <el-input
                    v-model="formData.address"
                    placeholder="地址描述（可选）"
                  />
                </el-col>
              </el-row>
            </template>
          </div>
        </el-form-item>

        <!-- 图片上传 -->
        <el-form-item label="相关图片">
          <el-upload
            class="image-uploader"
            action="#"
            :file-list="imageFileList"
            :before-upload="handleImageUpload"
            :on-remove="handleImageRemove"
            multiple
            accept="image/*"
            list-type="picture-card"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">
          {{ isEdit ? "更新" : "创建" }}
        </el-button>
        <el-button
          v-if="!isEdit"
          type="success"
          @click="handleSaveWithImage"
          :loading="saving"
        >
          创建（支持图片）
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick, computed } from "vue";
import {
  ElMessage,
  type FormInstance,
  type UploadProps,
  type CheckboxValueType,
} from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import {
  createArticleApi,
  updateArticleApi,
  createArticleWithImageApi,
  getArticleApi,
} from "@@/apis/articles";
import type {
  Article,
  CreateArticleRequest,
  UpdateArticleRequest,
  CreateArticleWithImageRequest,
} from "@@/apis/articles/type";

interface Props {
  modelValue: boolean;
  articleId: number;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "refresh"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const dialogVisible = ref(false);
const loading = ref(false);
const saving = ref(false);
const formRef = ref<FormInstance>();

// 是否为编辑模式
const isEdit = computed(() => Boolean(props.articleId));

// 表单数据
const formData = reactive<CreateArticleRequest & { imageUrl?: string }>({
  title: "",
  bodyText: "",
  category: "",
  address: "",
  locationName: "",
  latitude: undefined,
  longitude: undefined,
  imageFileId: undefined,
  imageUrl: "",
});

// 启用位置信息
const enableLocation = ref(false);

// 图片上传相关
const imageFileList = ref<any[]>([]);
const uploadImages = ref<File[]>([]);

// 常用标签
const commonTags = ref([
  "旅游",
  "美食",
  "文化",
  "历史",
  "自然",
  "建筑",
  "人文",
  "摄影",
]);

// 表单验证规则
const rules = {
  title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
};

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  async (val) => {
    dialogVisible.value = val;
    if (val) {
      if (isEdit.value) {
        await getArticleDetail();
      } else {
        resetForm();
      }
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
      const article = res.data;
      Object.assign(formData, {
        title: article.title,
        bodyText: article.bodyText,
        category: article.category,
        address: article.address,
        locationName: article.locationName,
        latitude: article.latitude,
        longitude: article.longitude,
        imageFileId: article.imageFileId,
        imageUrl: article.imageUrl || "",
      });

      // 设置位置信息状态
      enableLocation.value = !!(article.latitude && article.longitude);
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

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    title: "",
    bodyText: "",
    category: "",
    address: "",
    locationName: "",
    latitude: undefined,
    longitude: undefined,
    imageFileId: undefined,
    imageUrl: "",
  });
  enableLocation.value = false;
  imageFileList.value = [];
  uploadImages.value = [];
  nextTick(() => {
    formRef.value?.clearValidate();
  });
};

// 位置信息切换
const handleLocationToggle = (val: CheckboxValueType) => {
  if (!val) {
    formData.latitude = undefined;
    formData.longitude = undefined;
    formData.address = "";
    formData.locationName = "";
  }
};

// 封面图上传处理
const handleCoverUpload: UploadProps["beforeUpload"] = (file) => {
  const isImage = file.type.startsWith("image/");
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error("只能上传图片文件!");
    return false;
  }
  if (!isLt2M) {
    ElMessage.error("图片大小不能超过 2MB!");
    return false;
  }

  // 这里可以上传到服务器并获取URL，暂时使用本地预览
  const reader = new FileReader();
  reader.onload = (e) => {
    formData.imageUrl = e.target?.result as string;
  };
  reader.readAsDataURL(file);

  return false; // 阻止自动上传
};

// 删除封面
const removeCover = () => {
  formData.imageUrl = "";
};

// 图片上传处理
const handleImageUpload: UploadProps["beforeUpload"] = (file) => {
  const isImage = file.type.startsWith("image/");
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error("只能上传图片文件!");
    return false;
  }
  if (!isLt2M) {
    ElMessage.error("图片大小不能超过 2MB!");
    return false;
  }

  uploadImages.value.push(file);
  return false; // 阻止自动上传
};

// 删除图片
const handleImageRemove = (file: any) => {
  const index = uploadImages.value.findIndex((img) => img.name === file.name);
  if (index > -1) {
    uploadImages.value.splice(index, 1);
  }
};

// 保存文章
const handleSave = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    saving.value = true;

    if (isEdit.value) {
      const updateData: UpdateArticleRequest = {
        articleId: props.articleId,
        ...formData,
      };
      const res = await updateArticleApi(updateData);
      if (res.success) {
        ElMessage.success("更新成功");
        emit("refresh");
        handleClose();
      } else {
        ElMessage.error(res.errMessage || "更新失败");
      }
    } else {
      const res = await createArticleApi(formData);
      if (res.success) {
        ElMessage.success("创建成功");
        emit("refresh");
        handleClose();
      } else {
        ElMessage.error(res.errMessage || "创建失败");
      }
    }
  } catch (error) {
    console.error("保存失败:", error);
    ElMessage.error("保存失败");
  } finally {
    saving.value = false;
  }
};

// 保存文章（支持图片上传）
const handleSaveWithImage = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    saving.value = true;

    const createData: CreateArticleWithImageRequest = {
      ...formData,
      images: uploadImages.value,
    };

    const res = await createArticleWithImageApi(createData);
    if (res.success) {
      ElMessage.success("创建成功");
      emit("refresh");
      handleClose();
    } else {
      ElMessage.error(res.errMessage || "创建失败");
    }
  } catch (error) {
    console.error("保存失败:", error);
    ElMessage.error("保存失败");
  } finally {
    saving.value = false;
  }
};

// 关闭弹窗
const handleClose = () => {
  dialogVisible.value = false;
  resetForm();
};
</script>

<style lang="scss" scoped>
.article-form {
  .content-textarea {
    :deep(.el-textarea__inner) {
      font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
      font-size: 14px;
      line-height: 1.5;
    }
  }

  .cover-upload {
    .cover-uploader {
      :deep(.el-upload) {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: border-color 0.2s;

        &:hover {
          border-color: #409eff;
        }
      }

      .cover-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        text-align: center;
        line-height: 120px;
      }

      .cover {
        width: 120px;
        height: 120px;
        display: block;
        object-fit: cover;
      }
    }

    .cover-actions {
      margin-top: 8px;
    }
  }

  .location-section {
    .el-checkbox {
      margin-bottom: 0;
    }
  }

  .image-uploader {
    :deep(.el-upload--picture-card) {
      width: 100px;
      height: 100px;
    }

    :deep(.el-upload-list--picture-card .el-upload-list__item) {
      width: 100px;
      height: 100px;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
