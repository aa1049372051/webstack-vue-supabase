<template>
  <div class="page-container">
    <div class="sidebar-menu toggle-others fixed">
      <div class="sidebar-menu-inner">
        <header class="logo-env">
          <!-- logo -->
          <div class="logo">
            <a href="javascript:void(0)" class="logo-expanded">
              <img src="../assets/images/logo@2x.png" width="100%" alt="" />
            </a>
            <a href="javascript:void(0)" class="logo-collapsed">
              <img
                src="../assets/images/logo-collapsed@2x.png"
                width="40"
                alt=""
              />
            </a>
          </div>
          <div class="mobile-menu-toggle visible-xs">
            <a href="javascript:void(0)" data-toggle="user-info-menu">
              <i class="linecons-cog"></i>
            </a>
            <a href="javascript:void(0)" data-toggle="mobile-menu">
              <i class="fa-bars"></i>
            </a>
          </div>
        </header>
        <!-- 侧边栏 -->
        <ul id="main-menu" class="main-menu">
          <li v-for="(menu, idx) in items" :key="idx">
            <a :href="'#' + transName(menu)" class="smooth">
              <i :class="menu.icon"></i>
              <span class="title">{{ transName(menu) }}</span>
            </a>
            <ul v-if="menu.children && menu.children.length">
              <li v-for="(submenu, idx) in menu.children" :key="idx">
                <a :href="'#' + transName(submenu)" class="smooth">
                  <span class="title">{{ transName(submenu) }}</span>
                  <span
                    v-show="submenu.is_hot"
                    class="label label-pink pull-right hidden-collapsed"
                    >Hot</span
                  >
                </a>
              </li>
            </ul>
          </li>
          <!-- 关于本站 -->
          <li class="submit-tag">
            <router-link to="/about">
              <i class="linecons-heart"></i>
              <span class="tooltip-blue">关于本站</span>
              <span class="label label-Primary pull-right hidden-collapsed"
                >♥︎</span
              >
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <div class="main-content">
      <nav class="navbar user-info-navbar" role="navigation">
        <ul class="user-info-menu left-links list-inline list-unstyled">
          <li class="hidden-sm hidden-xs">
            <a href="javascript:void(0)" data-toggle="sidebar"
              ><i class="fa-bars"></i
            ></a>
          </li>
          <li class="dropdown hover-line language-switcher">
            <a
              href="javascript:void(0)"
              class="dropdown-toggle"
              data-toggle="dropdown"
            >
              <img :src="lang.flag" /> {{ lang.name }}
            </a>
            <ul class="dropdown-menu languages">
              <li
                :class="{ active: langItem.key === lang.key }"
                v-for="langItem in langList"
                :key="langItem.key"
              >
                <a href="javascript:void(0)" @click="lang = langItem">
                  <img :src="langItem.flag" /> {{ langItem.name }}
                </a>
              </li>
            </ul>
          </li>
        </ul>
        <ul class="user-info-menu right-links list-inline list-unstyled">
          <li class="hidden-sm hidden-xs">
            <a
              href="javascript:void(0)"
              :class="{ disabled: refreshing }"
              @click="refreshList"
            >
              <i class="fa-refresh" :class="{ 'fa-spin': refreshing }"></i>
              {{ refreshing ? "刷新中" : "刷新" }}
            </a>
          </li>
          <li class="hidden-sm hidden-xs">
            <!-- <a href="https://github.com/Anjaxs/WebStack-vue" target="_blank">
              <i class="fa-github"></i> GitHub
            </a> -->
            <a
              style="cursor: pointer"
              @click="$router.push({ name: 'admin_index' })"
              target="_blank"
            >
              管理台
            </a>
          </li>
        </ul>
      </nav>

      <div v-for="(item, idx) in items" :key="idx">
        <div v-if="item.site && item.site.length">
          <WebItem :item="item" :transName="transName" />
        </div>
        <div v-else v-for="(subItem, idx) in item.children" :key="idx">
          <WebItem :item="subItem" :transName="transName" />
        </div>
      </div>

      <Footer />
    </div>
  </div>
</template>

<script>
import WebItem from "../components/WebItem.vue";
import Footer from "../components/Footer.vue";
import { loadJs } from "../assets/js/app.js";
import { getMainList } from "../utils/supabase.js";

export default {
  name: "Index",
  components: {
    WebItem,
    Footer,
  },
  data() {
    return {
      items: [],
      lang: {},
      langList: [
        {
          key: "zh",
          name: "简体中文",
          flag: "./assets/images/flags/flag-cn.png",
        },
        {
          key: "en",
          name: "English",
          flag: "./assets/images/flags/flag-us.png",
        },
      ],
      refreshing: false,
    };
  },
  created() {
    this.lang = this.langList[0];
  },
  methods: {
    transName(webItem) {
      return this.lang.key === "en" ? webItem.en_name : webItem.name;
    },
    async getList() {
      try {
        this.items = await getMainList();
        loadJs();
      } catch (error) {
        this.$message.error(error.message || "加载导航数据失败");
      }
    },
    async refreshList() {
      if (this.refreshing) return;
      this.refreshing = true;
      try {
        this.items = await getMainList({ refresh: true });
        loadJs();
        this.$message.success("刷新成功");
      } catch (error) {
        this.$message.error(error.message || "刷新失败");
      } finally {
        this.refreshing = false;
      }
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style>
.user-info-menu a.disabled {
  cursor: default;
  opacity: 0.6;
  pointer-events: none;
}
</style>
