<script setup lang="ts">
import type { User, UserReqList, UserStatistics } from "@@/apis/users/type"
import * as UserApi from "@@/apis/users"
import { usePagination } from "@@/composables/usePagination"
import { formatDateTime } from "@@/utils/datetime"
import { Check, CirclePlus, Clock, Close, Refresh, RefreshRight, Search, User as UserIcon } from "@element-plus/icons-vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { onMounted, reactive, ref, watchEffect } from "vue"
import UserDialog from "./components/UserDialog.vue"

defineOptions({
  name: "Users"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

// #region 搜索
const searchFormRef = ref()
const searchData = reactive<UserReqList>({
  page: 1,
  pageSize: 10,
  userId: undefined,
  name: "",
  email: "",
  status: undefined,
  provider: undefined
})

function handleSearch() {
  paginationData.currentPage = 1
  getTableData()
}

function resetSearch() {
  searchFormRef.value?.resetFields()
  handleSearch()
}
// #endregion

// #region 用户统计
const userStatistics = ref<UserStatistics>({
  totalUsers: 0,
  activeUsers: 0,
  pendingUsers: 0,
  inactiveUsers: 0,
  emailUsers: 0,
  googleUsers: 0,
  appleUsers: 0,
  timestamp: ""
})

async function getUserStatistics() {
  try {
    const res = await UserApi.getUserStatisticsApi()
    if (res.data) {
      userStatistics.value = res.data
    }
  } catch (error) {
    console.error("获取用户统计信息失败:", error)
  }
}
// #endregion

// #region 增删改查
const tableData = ref<User[]>([])

async function getTableData() {
  loading.value = true
  try {
    const params: UserReqList = {
      page: paginationData.currentPage,
      pageSize: paginationData.page_size,
      userId: searchData.userId,
      name: searchData.name,
      email: searchData.email,
      phoneNumber: searchData.phoneNumber,
      gender: searchData.gender,
      provider: searchData.provider,
      status: searchData.status
    }
    const res = await UserApi.getUserListApi(params)
    tableData.value = res.data || []
    paginationData.total = res.total || 0
  } catch (error) {
    console.error("获取用户列表失败:", error)
  } finally {
    loading.value = false
  }
}

// #region 弹窗
const dialogVisible = ref<boolean>(false)
const dialogType = ref<"view" | "create" | "edit">("view")
const currentUser = ref<Partial<User>>({})

function handleCreate() {
  dialogType.value = "create"
  currentUser.value = {}
  dialogVisible.value = true
}

function handleView(row: User) {
  dialogType.value = "view"
  currentUser.value = { ...row }
  dialogVisible.value = true
}

function handleEdit(row: User) {
  dialogType.value = "edit"
  currentUser.value = { ...row }
  dialogVisible.value = true
}
// #endregion

function handleDelete(row: User) {
  ElMessageBox.confirm(`确认删除用户"${row.name}"吗？`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    try {
      await UserApi.deleteUserApi(row.userId)
      ElMessage.success("删除成功")
      getTableData()
      getUserStatistics()
    } catch (error) {
      console.error("删除用户失败:", error)
    }
  })
}

function handleInitSample() {
  ElMessageBox.confirm("确认初始化示例用户数据吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "info"
  }).then(async () => {
    try {
      await UserApi.initSampleUsersApi()
      ElMessage.success("初始化示例数据成功")
      getTableData()
      getUserStatistics()
    } catch (error) {
      console.error("初始化示例数据失败:", error)
    }
  })
}
// #endregion

/** 监听分页参数的变化 */
watchEffect(() => {
  getTableData()
})

onMounted(() => {
  getUserStatistics()
})
</script>

<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="userId" label="用户ID">
          <el-input
            v-model="searchData.userId"
            placeholder="请输入用户ID"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item prop="name" label="用户名">
          <el-input
            v-model="searchData.name"
            placeholder="请输入用户名"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input
            v-model="searchData.email"
            placeholder="请输入邮箱"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select
            v-model="searchData.status"
            placeholder="请选择状态"
            clearable
            style="width: 120px"
          >
            <el-option label="活跃" value="active" />
            <el-option label="待验证" value="pending" />
            <el-option label="非活跃" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item prop="provider" label="注册方式">
          <el-select
            v-model="searchData.provider"
            placeholder="请选择注册方式"
            clearable
            style="width: 120px"
          >
            <el-option label="邮箱" value="email" />
            <el-option label="Google" value="google" />
            <el-option label="Apple" value="apple" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="resetSearch">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 统计信息卡片 -->
    <div class="statistics-wrapper">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-card shadow="hover" class="statistics-card">
            <div class="statistics-item">
              <div class="statistics-icon total">
                <el-icon><UserIcon /></el-icon>
              </div>
              <div class="statistics-content">
                <div class="statistics-title">
                  用户总数
                </div>
                <div class="statistics-value">
                  {{ userStatistics.totalUsers }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="statistics-card">
            <div class="statistics-item">
              <div class="statistics-icon active">
                <el-icon><Check /></el-icon>
              </div>
              <div class="statistics-content">
                <div class="statistics-title">
                  活跃用户
                </div>
                <div class="statistics-value">
                  {{ userStatistics.activeUsers }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="statistics-card">
            <div class="statistics-item">
              <div class="statistics-icon pending">
                <el-icon><Clock /></el-icon>
              </div>
              <div class="statistics-content">
                <div class="statistics-title">
                  待验证用户
                </div>
                <div class="statistics-value">
                  {{ userStatistics.pendingUsers }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="statistics-card">
            <div class="statistics-item">
              <div class="statistics-icon inactive">
                <el-icon><Close /></el-icon>
              </div>
              <div class="statistics-content">
                <div class="statistics-title">
                  非活跃用户
                </div>
                <div class="statistics-value">
                  {{ userStatistics.inactiveUsers }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 用户表格 -->
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="handleCreate">
            新建用户
          </el-button>
          <el-button type="success" :icon="RefreshRight" @click="handleInitSample">
            初始化示例数据
          </el-button>
        </div>
        <div>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" border>
          <el-table-column prop="userId" label="用户ID" width="80" align="center" />
          <el-table-column prop="avatar" label="头像" width="80" align="center">
            <template #default="{ row }">
              <el-avatar :src="row.avatar" :size="40">
                <el-icon><UserIcon /></el-icon>
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="用户名" min-width="120" />
          <el-table-column prop="email" label="邮箱" min-width="200" />
          <el-table-column prop="phoneNumber" label="手机号" min-width="120" />
          <el-table-column prop="gender" label="性别" width="80" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.gender === 'male'" type="primary" size="small">
                男
              </el-tag>
              <el-tag v-else-if="row.gender === 'female'" type="danger" size="small">
                女
              </el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="provider" label="注册方式" width="100" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.provider === 'email'" type="info" size="small">
                邮箱
              </el-tag>
              <el-tag v-else-if="row.provider === 'google'" type="warning" size="small">
                Google
              </el-tag>
              <el-tag v-else-if="row.provider === 'apple'" type="success" size="small">
                Apple
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.status === 'active'" type="success" size="small">
                活跃
              </el-tag>
              <el-tag v-else-if="row.status === 'pending'" type="warning" size="small">
                待验证
              </el-tag>
              <el-tag v-else-if="row.status === 'inactive'" type="danger" size="small">
                非活跃
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" width="180" align="center">
            <template #default="{ row }">
              {{ formatDateTime(row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200" align="center">
            <template #default="{ row }">
              <el-button type="primary" text bg size="small" @click="handleView(row)">
                查看
              </el-button>
              <el-button type="success" text bg size="small" @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.page_size"
          :current-page="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 用户详情/编辑弹窗 -->
    <UserDialog
      v-model="dialogVisible"
      :user-data="currentUser"
      :dialog-type="dialogType"
      @refresh="getTableData"
    />
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.statistics-wrapper {
  margin-bottom: 20px;

  .statistics-card {
    .statistics-item {
      display: flex;
      align-items: center;

      .statistics-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;
        color: white;
        font-size: 24px;

        &.total {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        &.active {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        &.pending {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }

        &.inactive {
          background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
        }
      }

      .statistics-content {
        flex: 1;

        .statistics-title {
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
        }

        .statistics-value {
          font-size: 28px;
          font-weight: bold;
          color: #333;
        }
      }
    }
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
