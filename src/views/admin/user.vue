<template>
  <div class="admin-page" v-loading="loading">
    <div class="admin-page-heading">
      <div>
        <h2>账号设置</h2>
        <span>{{ form.email || '当前管理员' }}</span>
      </div>
      <el-button icon="el-icon-switch-button" @click="logout">退出登录</el-button>
    </div>

    <div class="admin-settings-grid">
      <section class="admin-settings-panel">
        <div class="admin-settings-title">
          <span class="admin-settings-icon"><i class="el-icon-lock"></i></span>
          <h3>账号安全</h3>
        </div>
        <el-form
          :rules="rules"
          ref="formName"
          :model="form"
          label-position="top"
          hide-required-asterisk
        >
          <el-form-item label="登录邮箱">
            <el-input prefix-icon="el-icon-message" :disabled="true" v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="新密码">
            <el-input
              type="password"
              prefix-icon="el-icon-lock"
              show-password
              autocomplete="new-password"
              v-model="form.password"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password2" label="确认新密码">
            <el-input
              type="password"
              prefix-icon="el-icon-lock"
              show-password
              autocomplete="new-password"
              v-model="form.password2"
              @keyup.enter.native="onSubmit"
            ></el-input>
          </el-form-item>
          <el-button type="primary" icon="el-icon-check" @click="onSubmit">更新密码</el-button>
        </el-form>
      </section>

      <section class="admin-settings-panel admin-maintenance-panel">
        <div class="admin-settings-title">
          <span class="admin-settings-icon"><i class="el-icon-coin"></i></span>
          <h3>数据维护</h3>
        </div>
        <div class="admin-maintenance-action">
          <div>
            <strong>初始化导航数据</strong>
          </div>
          <el-button icon="el-icon-upload2" @click="init">开始初始化</el-button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { updatePassword, addCategory, addSite, signOut, getSession, getCurrentUser } from '../../utils/supabase.js'
import itemsData from '../../assets/data.json'

export default {
  name: 'user',
  data() {
    return {
      rules: {
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 8, message: '密码至少 8 位', trigger: 'blur' },
        ],
        password2: [{ required: true, message: '请再次输入新密码', trigger: 'blur' }],
      },
      form: {
        email: '',
        password: '',
        password2: '',
      },
      loading: false,
    }
  },
  methods: {
    async initData() {
      const session = await getSession()
      const user = await getCurrentUser()
      if (!session || !user) {
        throw new Error('登录状态已失效，请重新登录后再初始化数据')
      }
      if (!session.access_token) {
        throw new Error('当前会话缺少 access_token，请退出后重新登录')
      }

      for (const item of itemsData) {
        const categoryData = await addCategory(item, 0)
        const id = categoryData[0].id
        if (item.site) {
          for (const site of item.site) {
            await addSite(site, id)
          }
        } else if (item.children) {
          for (const child of item.children) {
            const childData = await addCategory(child, id)
            const pid = childData[0].id
            for (const site of child.site || []) {
              await addSite(site, pid)
            }
          }
        }
      }
    },
    onSubmit() {
      this.$refs.formName.validate(async valid => {
        if (!valid) return
        if (this.form.password !== this.form.password2) {
          this.$message.error('两次密码不一样')
          return
        }

        this.loading = true
        try {
          await updatePassword(this.form.password)
          this.form.password = ''
          this.form.password2 = ''
          this.$message.success('更新成功')
        } catch (error) {
          this.$message.error(error.message || '更新失败')
        } finally {
          this.loading = false
        }
      })
    },
    async logout() {
      try {
        await signOut()
        this.$router.push({ name: 'index' })
      } catch (error) {
        this.$message.error(error.message || '退出失败')
      }
    },
    init() {
      this.$confirm('此操作将会添加测试分类和网站数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          this.loading = true
          try {
            await this.initData()
            this.$message.success('初始化完成')
          } catch (error) {
            this.$message.error(error.message || '初始化失败')
          } finally {
            this.loading = false
          }
        })
        .catch(() => {})
    },
  },
  async mounted() {
    try {
      const user = await getCurrentUser()
      this.form.email = user && user.email ? user.email : ''
    } catch (error) {
      this.$message.error(error.message || '获取用户信息失败')
    }
  },
}
</script>

<style scoped></style>
