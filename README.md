# webstack-vue-supabase

基于 Vue2、Element UI 和 Supabase 的静态网址导航站。项目支持前台展示、后台管理分类和站点、上传站点 Logo，可部署到 GitHub Pages、Vercel 或任意静态资源服务器。

> 项目借鉴自 [WebStack-vue](https://github.com/Anjaxs/WebStack-vue)。

## 在线预览

- Demo: <https://aa1049372051.github.io/webstack-vue-supabase/>

![首页截图](https://github.com/aa1049372051/aa1049372051.github.io/assets/13846404/c3dd89d9-a566-479d-b9af-1946f40a7840)

![后台截图](https://github.com/aa1049372051/aa1049372051.github.io/assets/13846404/7ef8303e-629f-4af4-8058-c1c93e100e31)

## 技术栈

- Vue 2
- Vue Router
- Element UI
- Supabase Auth / Database / Storage
- GitHub Actions + GitHub Pages

## 重要安全说明

浏览器端代码会被所有访问者看到，因此：

- **不要在前端使用或提交 Supabase `service_role` key**。
- **不要把真实密钥写进 README、截图、`.env`、`.env.production` 或 GitHub Actions 日志**。
- 前端只能使用 Supabase 的 `anon` / `publishable` key，并配合 RLS 和 Storage Policy 控制权限。
- 如果你曾经把 `service_role`、真实 `anon` key 或其他敏感信息提交到公开仓库，请立即去 Supabase 控制台轮换对应 key。
- 管理后台建议使用 Supabase Auth 创建管理员账号，不要使用明文密码表作为生产登录方案。

## 本地开发

### 1. 安装依赖

```bash
yarn install
```

### 2. 配置环境变量

复制一份本地环境变量文件：

```bash
cp .env .env.local
```

在 `.env.local` 中填写：

```env
VUE_APP_SUPABASE_URL=https://your-project-ref.supabase.co
VUE_APP_SUPABASE_ANON_KEY=your-anon-or-publishable-key
VUE_APP_BUCKET_NAME=webstack-vue
```

变量说明：

| 变量名 | 说明 |
| --- | --- |
| `VUE_APP_SUPABASE_URL` | Supabase 项目 URL |
| `VUE_APP_SUPABASE_ANON_KEY` | Supabase `anon` / `publishable` key，不能使用 `service_role` |
| `VUE_APP_BUCKET_NAME` | 用于保存网站 Logo 的 Storage bucket 名称，默认 `webstack-vue` |

### 3. 启动开发服务

```bash
yarn serve
```

### 4. 构建生产包

```bash
yarn build
```

### 5. 代码检查

```bash
yarn lint
```

## Supabase 初始化

### 1. 创建项目

进入 [Supabase](https://supabase.com/) 创建项目，记录项目 URL 和 `anon` / `publishable` key。

### 2. 初始化数据库表

打开 Supabase SQL Editor，执行 [sql/webstack-vue.sql](sql/webstack-vue.sql) 中的 SQL。

脚本会创建：

- `category`：分类表
- `site`：站点表
- `children(category)`：分类子级查询函数
- `father(category)`：分类父级查询函数
- 基础 RLS policy：公开读取，认证用户写入

> 如果你的后台要开放到公网，请根据自己的管理员规则进一步收紧写入策略。示例 SQL 中的写入策略允许所有 Supabase 已登录用户管理数据，适合个人项目或低风险场景，不适合多人开放注册场景。

### 3. 创建管理员账号

在 Supabase Dashboard 中进入 **Authentication -> Users**，创建后台管理员邮箱和密码。

后台登录页使用 Supabase Auth 登录：

- 登录成功后可以管理分类和网站。
- 修改密码会调用 Supabase Auth 的 `updateUser`。
- 退出登录会调用 Supabase Auth 的 `signOut`。

### 4. 创建 Storage bucket

进入 **Storage** 创建 bucket：

- bucket 名称默认：`webstack-vue`
- 如需使用其他名称，请同步修改 `VUE_APP_BUCKET_NAME`
- Logo 需要公开读取时，可将 bucket 设置为 public read
- 上传写入必须通过认证策略限制，不要依赖 `service_role` key 放在前端绕过权限

Storage policy 示例方向：

- 公开读取 Logo：允许 `anon` / `authenticated` `select`
- 仅认证管理员上传：允许 `authenticated` `insert` / `update` / `delete`

## 管理后台使用

1. 使用 Supabase Auth 中创建的管理员邮箱登录后台。
2. 在分类管理中新增、编辑、删除分类。
3. 在网站管理中新增、编辑、删除站点。
4. 站点 Logo 支持：
   - 手动填写静态图片路径或 URL
   - 上传 JPG、PNG、WebP、GIF 图片到 Supabase Storage
5. 在“用户信息”页面可以修改当前登录账号密码、退出登录、初始化示例数据。

## 初始化示例数据

示例数据来自 [src/assets/data.json](src/assets/data.json)。

后台进入“用户信息”页面，点击“初始化导航数据”会把示例分类和站点写入 Supabase。

注意：

- 初始化会追加数据，不会自动清空已有数据。
- 重复点击可能产生重复分类和站点。
- 建议只在新项目首次初始化时使用。

## 更换 Supabase 项目

如果你想把项目切换到一个全新的 Supabase 项目，**不是只执行 SQL 就可以**。SQL 只会创建数据库表、函数和数据库 RLS policy，不会创建 Auth 用户、Storage bucket、Storage policy，也不会迁移旧项目的数据。

### 1. 创建新的 Supabase 项目

在 Supabase Dashboard 创建新项目，记录：

- Project URL：`https://your-new-project-ref.supabase.co`
- `anon` / `publishable` key

不要复制或使用 `service_role` key 到前端项目。

### 2. 执行数据库 SQL

进入新项目的 **SQL Editor**，执行 [sql/webstack-vue.sql](sql/webstack-vue.sql) 中的全部 SQL。

执行后会创建：

- `category` 表
- `site` 表
- `children(category)` 函数
- `father(category)` 函数
- `category` / `site` 的基础 RLS policy

如果初始化数据时报：

```text
new row violates row-level security policy for table "category"
```

通常需要检查：

1. 当前是否真的使用 Supabase Auth 登录。
2. 浏览器中是否存在当前项目的 Auth session，例如 `sb-<project-ref>-auth-token`。
3. 前端环境变量是否指向新项目。
4. SQL 是否已经在 Supabase 云端 SQL Editor 实际执行，而不是只改了本地文件。
5. `category` / `site` 写入 policy 是否允许 `authenticated` 用户写入。

如需重新创建写入 policy，可在 SQL Editor 中执行：

```sql
drop policy if exists "Authenticated category insert" on public.category;
drop policy if exists "Authenticated category update" on public.category;
drop policy if exists "Authenticated category delete" on public.category;
drop policy if exists "Authenticated site insert" on public.site;
drop policy if exists "Authenticated site update" on public.site;
drop policy if exists "Authenticated site delete" on public.site;

create policy "Authenticated category insert"
on public.category
for insert
to authenticated
with check (true);

create policy "Authenticated category update"
on public.category
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated category delete"
on public.category
for delete
to authenticated
using (true);

create policy "Authenticated site insert"
on public.site
for insert
to authenticated
with check (true);

create policy "Authenticated site update"
on public.site
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated site delete"
on public.site
for delete
to authenticated
using (true);
```

> 上面的 policy 允许所有 Supabase 已登录用户写入，适合个人项目或低风险场景。如果你的项目允许多人注册，请按自己的管理员规则进一步收紧。

### 3. 修改本地环境变量

修改 `.env.local`：

```env
VUE_APP_SUPABASE_URL=https://your-new-project-ref.supabase.co
VUE_APP_SUPABASE_ANON_KEY=your-new-anon-or-publishable-key
VUE_APP_BUCKET_NAME=webstack-vue
```

修改后需要重启本地开发服务：

```bash
yarn serve
```

如果是生产环境，需要重新构建：

```bash
yarn build
```

### 4. 创建新的后台管理员

新 Supabase 项目不会自动继承旧项目的 Auth 用户。

进入新项目：

```text
Authentication -> Users -> Add user
```

创建后台管理员邮箱和密码，然后用这个账号登录后台。

### 5. 创建 Storage bucket

Logo 上传到 Supabase Storage。默认 bucket 名称是：

```text
webstack-vue
```

进入新项目：

```text
Storage -> New bucket
```

创建 `webstack-vue` bucket。如果你使用其他 bucket 名称，需要同步修改：

```env
VUE_APP_BUCKET_NAME=your-bucket-name
```

当前项目上传 Logo 时会保存到：

```text
logos/<timestamp>-<md5>.<extension>
```

最终公开访问地址来自 Supabase Storage 的 public URL。

### 6. 配置 Storage policy

如果 bucket 需要公开展示 Logo，可以允许公开读取；上传、修改、删除建议只允许已登录用户。

可在 SQL Editor 中执行示例 policy：

```sql
create policy "Public can read logos"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'webstack-vue');

create policy "Authenticated users can upload logos"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'webstack-vue');

create policy "Authenticated users can update logos"
on storage.objects
for update
to authenticated
using (bucket_id = 'webstack-vue')
with check (bucket_id = 'webstack-vue');

create policy "Authenticated users can delete logos"
on storage.objects
for delete
to authenticated
using (bucket_id = 'webstack-vue');
```

如果你的 bucket 名称不是 `webstack-vue`，需要把 SQL 里的 `bucket_id` 一起改掉。

### 7. 更新部署平台配置

如果使用 GitHub Actions 部署，需要在仓库的 **Settings -> Secrets and variables -> Actions** 中更新：

```text
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_BUCKET_NAME
PERSONAL_ACCESS_TOKEN
```

其中：

- `SUPABASE_URL` 填新项目 URL。
- `SUPABASE_ANON_KEY` 填新项目的 `anon` / `publishable` key。
- `SUPABASE_BUCKET_NAME` 填新项目的 Storage bucket 名称，默认 `webstack-vue`。
- `PERSONAL_ACCESS_TOKEN` 是 GitHub Pages 发布用 token，和 Supabase 无关；如果旧 token 仍有效，可以不改。

如果使用 Vercel、Netlify 或其他平台，也需要同步更新平台环境变量。

### 8. 初始化示例数据

完成以上步骤后：

1. 重新启动本地服务或重新部署生产环境。
2. 使用新项目中创建的 Supabase Auth 管理员登录后台。
3. 进入“用户信息”页面。
4. 点击“初始化导航数据”。

初始化数据来自 [src/assets/data.json](src/assets/data.json)，会写入新项目的 `category` 和 `site` 表。

注意：初始化会追加数据，不会自动清空已有数据，重复点击可能产生重复分类和站点。

### 9. 旧项目数据不会自动迁移

更换 Supabase 项目后，以下内容都不会自动迁移：

- Supabase Auth 用户
- `category` / `site` 数据
- Storage bucket
- 已上传的 Logo 文件
- Storage policy
- RLS policy 以外的项目设置

如果需要保留旧数据，需要额外做：

1. 从旧项目导出数据库数据，再导入新项目。
2. 从旧 Storage 下载 Logo 文件，再上传到新 Storage。
3. 确认新旧 Logo URL 是否变化；如果变化，需要同步更新 `site.logo` 数据。
4. 在新项目重新创建 Auth 管理员和 Storage policy。

## GitHub Pages 部署

项目内置 GitHub Actions 示例：[.github/workflows/build.yml](.github/workflows/build.yml)。

需要在仓库的 **Settings -> Secrets and variables -> Actions** 中配置：

| Secret | 说明 |
| --- | --- |
| `SUPABASE_URL` | Supabase 项目 URL |
| `SUPABASE_ANON_KEY` | Supabase `anon` / `publishable` key |
| `SUPABASE_BUCKET_NAME` | Storage bucket 名称，可选，默认 `webstack-vue` |
| `PERSONAL_ACCESS_TOKEN` | 用于推送构建产物到 Pages 仓库的 GitHub token |

GitHub token 建议使用最小权限：

- 只授权需要发布的目标仓库。
- 只授予写入 Pages 分支所需的权限。
- 不要选择无关仓库或过大的权限范围。

每次 push 到 `main` 分支后，Actions 会自动构建并发布 `dist` 目录。

## Vercel 或其他静态部署

如果使用 Vercel、Netlify 或自建静态服务器：

1. 在平台环境变量中配置 `VUE_APP_SUPABASE_URL`、`VUE_APP_SUPABASE_ANON_KEY`、`VUE_APP_BUCKET_NAME`。
2. 构建命令设置为：`yarn build`。
3. 输出目录设置为：`dist`。

## 可选：Supabase 保活

免费 Supabase 项目长时间不活跃可能会暂停。项目提供了一个可选脚本：[cron/supabase.js](cron/supabase.js)，用于执行一次低权限只读查询：

```js
category.select('id').limit(1)
```

这个脚本只需要 Supabase URL 和 `anon` / `publishable` key，不需要 `service_role`。

### GitHub Actions 定时执行

项目已提供定时保活 workflow：[.github/workflows/supabase-keep-alive.yml](.github/workflows/supabase-keep-alive.yml)。

默认配置为每 3 天执行一次，也支持在 GitHub 页面手动触发：

```yaml
on:
  schedule:
    - cron: '0 4 */3 * *'
  workflow_dispatch:
```

> GitHub Actions 的 cron 使用 UTC 时间，不是北京时间。

使用前需要在仓库的 **Settings -> Secrets and variables -> Actions** 中配置：

| Secret | 说明 |
| --- | --- |
| `SUPABASE_URL` | Supabase 项目 URL |
| `SUPABASE_ANON_KEY` | Supabase `anon` / `publishable` key |

配置完成后，可在 GitHub 仓库的 **Actions -> Supabase Keep Alive** 中手动运行一次，确认脚本可以成功连接 Supabase。

### 本地手动执行

保活脚本同时兼容两组变量名。推荐直接使用和前端一致的 `VUE_APP_*` 变量：

```bash
VUE_APP_SUPABASE_URL=https://your-project-ref.supabase.co \
VUE_APP_SUPABASE_ANON_KEY=your-anon-or-publishable-key \
node cron/supabase.js
```

GitHub Actions 会从仓库 Secrets 读取 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY`，再将它们注入为 `VUE_APP_SUPABASE_URL` 和 `VUE_APP_SUPABASE_ANON_KEY`。

注意：

- 保活脚本不需要 `service_role`。
- 不要把真实 key 写死到脚本里。
- 不要提交包含真实 key 的 `.env` 文件。
- 如果你不需要保活功能，可以删除 [.github/workflows/supabase-keep-alive.yml](.github/workflows/supabase-keep-alive.yml)。

## 常见问题

### 为什么不能使用 `service_role` key？

`service_role` 会绕过 RLS，等同于高权限服务端密钥。前端代码会暴露给所有用户，因此一旦把它放进浏览器端，任何人都可能拿到 key 并读写你的数据库和 Storage。

### 登录后仍然不能写入数据怎么办？

检查：

1. 当前账号是否已通过 Supabase Auth 登录。
2. `category`、`site` 是否启用了正确的 RLS policy。
3. Storage bucket 是否配置了认证用户上传权限。
4. 环境变量是否使用了正确项目的 URL 和 `anon` / `publishable` key。

### 上传 Logo 失败怎么办？

检查：

1. `VUE_APP_BUCKET_NAME` 是否和 Supabase bucket 名称一致。
2. bucket 是否存在。
3. 当前用户是否已登录。
4. Storage policy 是否允许认证用户上传。
5. 图片类型是否为 JPG、PNG、WebP、GIF，大小是否小于限制。

### GitHub Actions 构建失败怎么办？

检查：

1. Secrets 名称是否和 workflow 中一致。
2. `PERSONAL_ACCESS_TOKEN` 是否有目标仓库写入权限。
3. 构建日志中是否有依赖安装或 ESLint 错误。
4. 不要在 workflow 中打印 `.env.production` 或其他包含密钥的文件。

## 目录说明

```text
src/
  assets/          示例数据和静态资源
  components/      通用组件
  router/          路由配置
  utils/           Supabase 访问层
  views/           页面
sql/               Supabase 初始化 SQL
cron/              可选保活脚本
.github/workflows/ GitHub Actions 部署配置
```

## 致谢

- [WebStack-vue](https://github.com/Anjaxs/WebStack-vue)
- [Supabase](https://supabase.com/)
- [Element UI](https://element.eleme.io/)
