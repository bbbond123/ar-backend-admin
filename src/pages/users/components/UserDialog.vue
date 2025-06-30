<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="800"
    :close-on-click-modal="false"
    @close="resetForm"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      :disabled="dialogType === 'view'"
      label-width="100px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="formData.name" placeholder="请输入用户名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户名假名" prop="nameKana">
            <el-input v-model="formData.nameKana" placeholder="请输入假名" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phoneNumber">
            <el-input v-model="formData.phoneNumber" placeholder="请输入手机号" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="formData.gender" placeholder="请选择性别" style="width: 100%">
              <el-option label="男" value="male" />
              <el-option label="女" value="female" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生日" prop="birth">
            <el-date-picker
              v-model="formData.birth"
              type="date"
              placeholder="请选择生日"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="注册方式" prop="provider">
            <el-select v-model="formData.provider" placeholder="请选择注册方式" style="width: 100%">
              <el-option label="邮箱" value="email" />
              <el-option label="Google" value="google" />
              <el-option label="Apple" value="apple" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
              <el-option label="活跃" value="active" />
              <el-option label="待验证" value="pending" />
              <el-option label="非活跃" value="inactive" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="地址" prop="address">
        <el-input
          v-model="formData.address"
          type="textarea"
          :rows="3"
          placeholder="请输入地址"
        />
      </el-form-item>

      <div v-if="formData.provider === 'google'">
        <el-form-item label="Google ID" prop="googleId">
          <el-input v-model="formData.googleId" placeholder="请输入Google ID" />
        </el-form-item>
      </div>

      <div v-if="formData.provider === 'apple'">
        <el-form-item label="Apple ID" prop="appleId">
          <el-input v-model="formData.appleId" placeholder="请输入Apple ID" />
        </el-form-item>
      </div>

      <div v-if="formData.provider === 'email' && dialogType === 'create'">
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
      </div>

      <div v-if="dialogType === 'view'">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-input :value="formatDateTime(formData.createdAt)" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="更新时间">
              <el-input :value="formatDateTime(formData.updatedAt)" readonly />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          v-if="dialogType !== 'view'"
          type="primary"
          :loading="loading"
          @click="handleConfirm"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue"
import { ElMessage } from "element-plus"
import type { FormInstance, FormRules } from "element-plus"
import { formatDateTime } from "@@/utils/datetime"
import * as UserApi from "@@/apis/users"
import type { User, UserReqCreate, UserReqEdit } from "@@/apis/users/type"

defineOptions({
  name: "UserDialog"
})

interface Props {
  modelValue: boolean
  userData: Partial<User>
  dialogType: "view" | "create" | "edit"
}

interface Emits {
  (e: "update:modelValue", value: boolean): void
  (e: "refresh"): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref<boolean>(false)
const formRef = ref<FormInstance>()

// 弹窗显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value)
})

// 弹窗标题
const dialogTitle = computed(() => {
  const titleMap = {
    view: "查看用户",
    create: "新建用户",
    edit: "编辑用户"
  }
  return titleMap[props.dialogType]
})

// 表单数据
const formData = reactive<Partial<User>>({
  name: "",
  nameKana: "",
  email: "",
  phoneNumber: "",
  gender: undefined,
  birth: "",
  address: "",
  provider: "email",
  status: "active",
  googleId: "",
  appleId: "",
  password: ""
})

// 表单校验规则
const formRules: FormRules = {
  name: [
    { required: false, message: "请输入用户名", trigger: "blur" }
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }
  ],
  provider: [
    { required: true, message: "请选择注册方式", trigger: "change" }
  ],
  status: [
    { required: true, message: "请选择状态", trigger: "change" }
  ],
  password: [
    {
      validator: (rule, value, callback) => {
        if (props.dialogType === "create" && formData.provider === "email" && !value) {
          callback(new Error("请输入密码"))
        } else if (value && value.length < 6) {
          callback(new Error("密码长度不能少于6位"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ]
}

// 监听用户数据变化
watch(
  () => props.userData,
  (newData) => {
    if (newData) {
      Object.assign(formData, {
        ...newData,
        birth: newData.birth || "",
        password: ""
      })
    }
  },
  { immediate: true }
)

// 重置表单
const resetForm = () => {
  formRef.value?.clearValidate()
  Object.assign(formData, {
    name: "",
    nameKana: "",
    email: "",
    phoneNumber: "",
    gender: undefined,
    birth: "",
    address: "",
    provider: "email",
    status: "active",
    googleId: "",
    appleId: "",
    password: ""
  })
}

// 取消操作
const handleCancel = () => {
  dialogVisible.value = false
}

// 确认操作
const handleConfirm = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      if (props.dialogType === "create") {
        await handleCreate()
      } else if (props.dialogType === "edit") {
        await handleEdit()
      }
      ElMessage.success(`${props.dialogType === "create" ? "创建" : "更新"}成功`)
      dialogVisible.value = false
      emit("refresh")
    } catch (error) {
      console.error(`${props.dialogType === "create" ? "创建" : "更新"}用户失败:`, error)
    } finally {
      loading.value = false
    }
  })
}

// 创建用户
const handleCreate = async () => {
  const createData: UserReqCreate = {
    name: formData.name,
    nameKana: formData.nameKana,
    email: formData.email!,
    phoneNumber: formData.phoneNumber,
    birth: formData.birth,
    gender: formData.gender,
    address: formData.address,
    provider: formData.provider!,
    status: formData.status!,
    googleId: formData.googleId,
    appleId: formData.appleId,
    password: formData.password
  }
  await UserApi.createUserApi(createData)
}

// 编辑用户
const handleEdit = async () => {
  const editData: UserReqEdit = {
    userId: formData.userId!,
    name: formData.name,
    nameKana: formData.nameKana,
    email: formData.email,
    phoneNumber: formData.phoneNumber,
    birth: formData.birth,
    gender: formData.gender,
    address: formData.address,
    provider: formData.provider,
    status: formData.status,
    googleId: formData.googleId,
    appleId: formData.appleId
  }
  await UserApi.updateUserApi(editData)
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}
</style>
