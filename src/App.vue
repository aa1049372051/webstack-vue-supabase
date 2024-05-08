<template>
  <el-row>
    <router-view v-if="noLayout.indexOf($route.name) > -1"></router-view>
    <container v-else></container>
  </el-row>
</template>

<script>
const container = () => import("@/components/layout/container");
export default {
  name: "App",
  components: {
    container,
  },
  data() {
    return {
      noLayout: ["index", "about", "home", "admin_login"],
    };
  },
};
</script>

<style></style>
