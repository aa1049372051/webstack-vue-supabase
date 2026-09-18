<template>
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <div class="admin-brand">
        <img src="@/assets/images/logo@2x.png" alt="WebStack" />
        <span>管理中心</span>
      </div>

      <div class="admin-nav-label">内容管理</div>
      <el-menu
        class="admin-nav"
        :default-active="$route.name"
        @select="handleSelect"
      >
        <el-menu-item
          v-for="item in menus"
          :key="item.id"
          :index="item.id"
        >
          <i :class="item.icon"></i>
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </el-menu>

      <router-link class="admin-sidebar-link" :to="{ name: 'index' }">
        <i class="el-icon-back"></i>
        <span>返回导航站</span>
      </router-link>
    </aside>

    <section class="admin-workspace">
      <header class="admin-topbar">
        <div>
          <span class="admin-topbar-label">WebStack Workspace</span>
          <h1>{{ currentTitle }}</h1>
        </div>
        <router-link :to="{ name: 'index' }">
          <el-button class="admin-site-button" icon="el-icon-view">查看站点</el-button>
        </router-link>
      </header>

      <main class="admin-content">
        <router-view></router-view>
      </main>
    </section>
  </div>
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
          icon: "el-icon-collection-tag",
        },
        {
          name: "网站列表",
          id: "admin_site",
          icon: "el-icon-monitor",
        },
        {
          name: "账号设置",
          id: "admin_user",
          icon: "el-icon-user",
        },
      ],
    };
  },
  computed: {
    currentTitle() {
      const current = this.menus.find((item) => item.id === this.$route.name);
      return current ? current.name : "管理中心";
    },
  },
  methods: {
    handleSelect(val) {
      if (this.$route.name === val) return;
      this.$router.push({
        name: val,
      });
    },
  },
};
</script>

<style></style>
