<template>
  <div v-loading="loading" style="width: 300px; margin: 20px">
    <h1>用户登录</h1>
    <el-form
      size="mini"
      :rules="rules"
      ref="formName"
      :model="form"
      label-width="80px"
    >
      <el-form-item prop="name" label="用户名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getUser } from "../../utils/supabase.js";
export default {
  name: "login",
  data() {
    return {
      rules: {
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        password: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      form: {
        name: "",
        password: "",
      },
      loading: false,
    };
  },
  methods: {
    onSubmit() {
      this.$refs["formName"].validate(async (valid) => {
        if (valid) {
          let data;
          this.loading = !this.loading;
          data = await getUser(this.form.name, this.form.password);
          this.loading = !this.loading;
          if (data.length) {
            window.localStorage.setItem(
              "loginData-webstack",
              JSON.stringify(data[0])
            );
            this.$router.push({
              name: "admin_index",
            });
          } else {
            this.$message.error("用户不存在");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style scoped></style>
