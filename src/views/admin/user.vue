<template>
  <div v-loading="loading" style="width: 500px; margin: 20px">
    <h1>用户信息</h1>
    <el-form
      size="mini"
      :rules="rules"
      ref="formName"
      :model="form"
      label-width="80px"
    >
      <el-form-item prop="name" label="用户名">
        <el-input :disabled="true" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item prop="password2" label="重复密码">
        <el-input type="password" v-model="form.password2"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定修改</el-button>
        <el-button type="primary" @click="init">初始化导航数据</el-button>
        <el-button type="primary" @click="logout">退出登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updateUser, addCategory, addSite } from "../../utils/supabase.js";
import itemsData from "../../assets/data.json";

export default {
  name: "user",
  data() {
    return {
      rules: {
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        password: [{ required: true, message: "请输入", trigger: "blur" }],
        password2: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      form: {
        name: "",
        password: "",
        password2: "",
      },
      loading: false,
    };
  },
  methods: {
    async initData() {
      itemsData.forEach(async (item) => {
        let { data } = await addCategory(item, 0);
        console.log(data);
        let id = data[0]["id"];
        if (item.site) {
          item.site.forEach(async (item) => {
            await addSite(item, id);
          });
        } else {
          item.children.forEach(async (item) => {
            let { data } = await addCategory(item, id);
            console.log(data);
            let pid = data[0]["id"];
            item.site.forEach(async (item) => {
              await addSite(item, pid);
            });
          });
        }
      });
    },
    onSubmit() {
      this.$refs["formName"].validate(async (valid) => {
        if (valid) {
          if (this.form.password != this.form.password2) {
            this.$message.error("两次密码不一样");
            return;
          }
          this.loading = !this.loading;
          let data = await updateUser(this.form.id + "", {
            password: this.form.password,
            username: this.form.name,
            id: this.form.id,
          });
          this.loading = !this.loading;
          console.log(data);
          this.$message.success("更新成功");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    logout() {
      window.localStorage.removeItem("loginData-webstack");
      this.$router.push({
        name: "index",
      });
    },
    init() {
      this.$confirm("此操作将会添加测试分类和网站数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.loading = true;
          this.initData();
          this.loading = false;
        })
        .catch(() => {});
    },
  },
  mounted() {
    let data = window.localStorage.getItem("loginData-webstack");
    if (data) {
      let val = JSON.parse(data);
      this.form.id = val.id;
      this.form.name = val.username;
      console.log(this.form);
    }
  },
};
</script>

<style scoped></style>
