# V3 Admin Vite 项目记录

> 接手项目时间：2024年
> 前同事离职交接项目

## 项目基本信息

- **项目名称**：V3 Admin Vite
- **项目版本**：5.0.0-beta.7
- **项目类型**：Vue3 后台管理系统模板
- **开发端口**：8000
- **基础路径**：/admin/
- **API代理**：/api -> http://localhost:3000

## 技术架构记录

### 核心依赖版本

```json
{
  "vue": "3.5.16",
  "typescript": "5.8.3",
  "vite": "6.3.5",
  "element-plus": "2.9.11",
  "pinia": "3.0.3",
  "vue-router": "4.5.1",
  "vxe-table": "4.6.25"
}
```

### 关键配置

- **路径别名**：`@` -> src/, `@@` -> src/common/
- **ESLint配置**：使用 @antfu/eslint-config
- **测试框架**：Vitest + happy-dom
- **CSS方案**：UnoCSS + Element Plus + 自定义SCSS

## 目录结构说明

```
src/
├── common/                 # 公共模块 (@@别名指向)
│   ├── apis/              # API接口层
│   │   ├── tables/        # 表格相关API
│   │   └── users/         # 用户相关API
│   ├── assets/            # 静态资源
│   │   ├── icons/         # SVG图标
│   │   ├── images/        # 图片资源
│   │   └── styles/        # 样式文件
│   ├── components/        # 公共组件
│   │   ├── Notify/        # 通知组件
│   │   ├── Screenfull/    # 全屏组件
│   │   ├── SearchMenu/    # 搜索菜单
│   │   └── ThemeSwitch/   # 主题切换
│   ├── composables/       # 组合式函数
│   ├── constants/         # 常量定义
│   └── utils/             # 工具函数
├── http/                  # HTTP配置
├── layouts/               # 布局系统
│   ├── components/        # 布局组件
│   └── modes/             # 布局模式
├── pages/                 # 页面组件
│   ├── dashboard/         # 仪表板
│   ├── demo/              # 示例页面
│   ├── error/             # 错误页面
│   ├── login/             # 登录页面
│   └── redirect/          # 重定向页面
├── pinia/                 # 状态管理
│   └── stores/            # Store定义
├── plugins/               # 插件配置
└── router/                # 路由配置
```

## 核心功能模块

### 1. 认证系统

- **登录页面**：`src/pages/login/index.vue`
- **用户Store**：`src/pinia/stores/user.ts`
- **Token管理**：基于Cookie存储
- **权限控制**：角色权限 + 路由守卫

### 2. 权限管理

- **页面权限**：动态路由 + roles 属性
- **按钮权限**：`v-permission` 指令
- **路由配置**：
  - `constantRoutes`: 常驻路由
  - `dynamicRoutes`: 权限路由

### 3. 布局系统

- **三种布局模式**：
  - `LeftMode`: 左侧布局
  - `TopMode`: 顶部布局
  - `LeftTopMode`: 混合布局
- **主题切换**：普通/黑暗/深蓝
- **响应式适配**：支持移动端

### 4. 组件系统

- **UI框架**：Element Plus + 自定义组件
- **表格方案**：VXE Table (高性能)
- **图标方案**：SVG雪碧图
- **样式方案**：UnoCSS + SCSS

## 开发流程

### 环境要求

- Node.js 20.x 或 22+
- pnpm 9.x 或 10+
- VS Code + 推荐插件

### 常用命令

```bash
pnpm dev              # 开发环境
pnpm build            # 生产构建
pnpm build:staging    # 预发布构建
pnpm preview          # 本地预览
pnpm lint             # 代码检查
pnpm test             # 单元测试
```

### Git工作流

- **提交规范**：使用语义化提交
- **代码检查**：提交前自动运行lint-staged
- **分支管理**：基于master分支开发

## 部署配置

### Docker部署

- **Dockerfile**：多阶段构建
- **Nginx配置**：
  - `nginx.conf`: 开发环境
  - `nginx.prod.conf`: 生产环境

### 环境变量

- `.env.production`: 生产环境配置 (当前有修改)

## 注意事项

### 开发约定

1. **保持一致性**：延续现有代码风格
2. **目录结构**：不要修改既定的目录结构
3. **依赖管理**：谨慎添加新依赖
4. **类型安全**：严格遵循TypeScript约束

### 已知问题

- `.env.production` 文件有未提交的修改
- 项目使用beta版本，需关注稳定性

### 联系信息

- **原项目地址**：https://github.com/un-pany/v3-admin-vite
- **文档地址**：https://juejin.cn/post/7445151895121543209
- **在线预览**：https://un-pany.github.io/v3-admin-vite

## 业务逻辑说明

### 用户角色系统

- 支持多角色权限控制
- 默认角色：admin/editor
- 角色切换会重新加载页面

### 菜单导航

- 动态侧边栏菜单
- 面包屑导航
- 标签页快捷导航
- 搜索菜单功能

### 数据管理

- 基于Pinia的状态管理
- 支持数据持久化
- 组合式函数复用逻辑

### 主题系统

- CSS变量动态切换
- 支持系统主题检测
- 主题配置持久化

## 后续开发建议

1. **熟悉现有代码**：先了解现有实现再进行开发
2. **参考示例**：多参考demo页面的实现方式
3. **保持风格**：新增功能要与现有风格保持一致
4. **逐步完善**：可以逐步优化，但不要大规模重构
5. **文档更新**：重要修改要更新相关文档

---

_记录人：AI Assistant_
_记录时间：2024年_
