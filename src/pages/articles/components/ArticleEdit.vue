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
                v-if="formData.cover_image"
                :src="formData.cover_image"
                class="cover"
              />
              <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="cover-actions" v-if="formData.cover_image">
              <el-button size="small" type="danger" @click="removeCover"
                >删除封面</el-button
              >
            </div>
          </div>
        </el-form-item>

        <el-form-item label="文章内容" prop="content">
          <el-input
            v-model="formData.content"
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
              @change="(val: CheckboxValueType) => handleLocationToggle(val)"
            >
              启用位置信息
            </el-checkbox>
            <template v-if="enableLocation">
              <el-row :gutter="20" style="margin-top: 12px">
                <el-col :span="8">
                  <el-input
                    v-model="formData.location.latitude"
                    placeholder="纬度"
                    type="number"
                  />
                </el-col>
                <el-col :span="8">
                  <el-input
                    v-model="formData.location.longitude"
                    placeholder="经度"
                    type="number"
                  />
                </el-col>
                <el-col :span="8">
                  <el-input
                    v-model="formData.location.address"
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
import { ref, reactive, watch, nextTick } from "vue";
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
  getArticleApi,
  createArticleWithImageApi,
} from "@@/apis/articles";
import type {
  CreateArticleRequest,
  UpdateArticleRequest,
  Article,
  CreateArticleWithImageRequest,
} from "@@/apis/articles/type";

interface Props {
  modelValue: boolean;
  articleId?: string;
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
const isEdit = ref(false);
const enableLocation = ref(false);

// 常用标签列表
const commonTags = ["技术", "生活", "旅行", "美食", "学习", "工作", "随笔"];

// 表单数据
const formData = reactive<
  CreateArticleRequest & {
    location: { latitude: number; longitude: number; address: string };
  }
>({
  title: "",
  content: "",
  summary: "",
  category: "",
  tags: [],
  cover_image: "",
  status: "draft",
  location: {
    latitude: 0,
    longitude: 0,
    address: "",
  },
});

// 图片文件列表
const imageFileList = ref<any[]>([]);
const uploadedImages = ref<File[]>([]);

// 表单验证规则
const rules = reactive({
  title: [
    { required: true, message: "请输入文章标题", trigger: "blur" },
    {
      min: 1,
      max: 100,
      message: "标题长度在 1 到 100 个字符",
      trigger: "blur",
    },
  ],
  content: [
    { required: true, message: "请输入文章内容", trigger: "blur" },
    { min: 10, message: "内容至少 10 个字符", trigger: "blur" },
  ],
  status: [{ required: true, message: "请选择文章状态", trigger: "change" }],
});

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (val) => {
    dialogVisible.value = val;
    if (val) {
      isEdit.value = !!props.articleId;
      if (props.articleId) {
        getArticleDetail();
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
      fillFormData(res.data);
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

// 填充表单数据
const fillFormData = (article: Article) => {
  Object.assign(formData, {
    title: article.title,
    content: article.content,
    summary: article.summary || "",
    category: article.category || "",
    tags: article.tags || [],
    cover_image: article.cover_image || "",
    status: article.status,
    location: article.location || { latitude: 0, longitude: 0, address: "" },
  });

  enableLocation.value = !!(
    article.location?.latitude && article.location?.longitude
  );
};

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    title: "",
    content: "",
    summary: "",
    category: "",
    tags: [],
    cover_image: "",
    status: "draft",
    location: { latitude: 0, longitude: 0, address: "" },
  });
  enableLocation.value = false;
  imageFileList.value = [];
  uploadedImages.value = [];

  nextTick(() => {
    formRef.value?.clearValidate();
  });
};

// 处理位置信息切换
const handleLocationToggle = (enabled: CheckboxValueType) => {
  if (!enabled) {
    formData.location = { latitude: 0, longitude: 0, address: "" };
  }
};

// 处理封面图上传
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

  // 创建预览URL
  const reader = new FileReader();
  reader.onload = (e) => {
    formData.cover_image = e.target?.result as string;
  };
  reader.readAsDataURL(file);

  return false; // 阻止自动上传
};

// 删除封面
const removeCover = () => {
  formData.cover_image = "";
};

// 处理图片上传
const handleImageUpload: UploadProps["beforeUpload"] = (file) => {
  const isImage = file.type.startsWith("image/");
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isImage) {
    ElMessage.error("只能上传图片文件!");
    return false;
  }
  if (!isLt5M) {
    ElMessage.error("图片大小不能超过 5MB!");
    return false;
  }

  uploadedImages.value.push(file);
  return false; // 阻止自动上传
};

// 删除图片
const handleImageRemove = (file: any) => {
  const index = imageFileList.value.indexOf(file);
  if (index > -1) {
    uploadedImages.value.splice(index, 1);
  }
};

// 保存文章
const handleSave = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    saving.value = true;

    const requestData = {
      title: formData.title,
      content: formData.content,
      summary: formData.summary || undefined,
      category: formData.category || undefined,
      tags:
        formData.tags && formData.tags.length > 0 ? formData.tags : undefined,
      cover_image: formData.cover_image || undefined,
      status: formData.status,
      location:
        enableLocation.value &&
        formData.location.latitude &&
        formData.location.longitude
          ? formData.location
          : undefined,
    };

    if (isEdit.value && props.articleId) {
      const res = await updateArticleApi(
        props.articleId,
        requestData as UpdateArticleRequest
      );
      if (res.success) {
        ElMessage.success("文章更新成功");
        emit("refresh");
        handleClose();
      } else {
        ElMessage.error(res.errMessage || "文章更新失败");
      }
    } else {
      const res = await createArticleApi(requestData as CreateArticleRequest);
      if (res.success) {
        ElMessage.success("文章创建成功");
        emit("refresh");
        handleClose();
      } else {
        ElMessage.error(res.errMessage || "文章创建失败");
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
  if (!formRef.value || isEdit.value) return;

  try {
    await formRef.value.validate();
    saving.value = true;

    const requestData: CreateArticleWithImageRequest = {
      title: formData.title,
      content: formData.content,
      summary: formData.summary || undefined,
      category: formData.category || undefined,
      tags:
        formData.tags && formData.tags.length > 0 ? formData.tags : undefined,
      cover_image: formData.cover_image || undefined,
      status: formData.status,
      location:
        enableLocation.value &&
        formData.location.latitude &&
        formData.location.longitude
          ? formData.location
          : undefined,
      images:
        uploadedImages.value.length > 0 ? uploadedImages.value : undefined,
    };

    const res = await createArticleWithImageApi(requestData);
    if (res.success) {
      ElMessage.success("文章创建成功（已上传图片）");
      emit("refresh");
      handleClose();
    } else {
      ElMessage.error(res.errMessage || "文章创建失败");
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
