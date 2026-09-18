<template>
  <div class="admin-login" v-loading="loading">
    <div class="admin-login-frame">
      <section class="admin-login-brand">
        <img src="@/assets/images/logo@2x.png" alt="WebStack" />
        <div>
          <span class="admin-login-kicker">CONTENT WORKSPACE</span>
          <h1>WebStack<br />管理中心</h1>
        </div>
        <span class="admin-login-foot">网址导航内容管理</span>
      </section>

      <section class="admin-login-panel">
        <router-link class="admin-login-back" :to="{ name: 'index' }">
          <i class="el-icon-back"></i>
          返回站点
        </router-link>
        <div class="admin-login-heading">
          <span>管理员登录</span>
          <h2>欢迎回来</h2>
        </div>
        <el-form
          :rules="rules"
          ref="formName"
          :model="form"
          label-position="top"
          hide-required-asterisk
        >
          <el-form-item prop="email" label="邮箱">
            <el-input
              v-model="form.email"
              autocomplete="username"
              prefix-icon="el-icon-message"
              placeholder="name@example.com"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input
              type="password"
              v-model="form.password"
              autocomplete="current-password"
              prefix-icon="el-icon-lock"
              placeholder="请输入密码"
              show-password
              @keyup.enter.native="onSubmit"
            ></el-input>
          </el-form-item>
          <el-button
            class="admin-login-submit"
            type="primary"
            :loading="loading"
            @click="onSubmit"
          >登录</el-button>
        </el-form>
      </section>
    </div>
  </div>
</template>

<script>
import { signIn } from '../../utils/supabase.js'

export default {
  name: 'login',
  data() {
    return {
      rules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
      form: {
        email: '',
        password: '',
      },
      loading: false,
    }
  },
  methods: {
    onSubmit() {
      this.$refs.formName.validate(async valid => {
        if (!valid) return

        this.loading = true
        try {
          await signIn(this.form.email, this.form.password)
          this.$router.push({ name: 'admin_index' })
        } catch (error) {
          this.$message.error(error.message || '登录失败')
        } finally {
          this.loading = false
        }
      })
    },
  },
}
</script>

<style scoped></style>
