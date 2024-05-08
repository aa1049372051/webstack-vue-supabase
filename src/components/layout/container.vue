<template>
  <el-container style="border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu @select="handleSelect">
        <el-menu-item :key="item.id" v-for="item in menus" :index="item.id">{{
          item.name
        }}</el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "container",
  data() {
    return {
      menus: [
        {
          name: "分类列表",
          id: "admin_index",
        },
        {
          name: "网站列表",
          id: "admin_site",
        },
        {
          name: "用户",
          id: "admin_user",
        },
      ],
    };
  },
  methods: {
    handleSelect(val) {
      this.$router.push({
        name: val,
      });
    },
  },
};
</script>

<style></style>
