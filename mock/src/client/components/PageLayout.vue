<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider class="sider" v-model="collapsed" :trigger="null" collapsible>
      <Sider :collapsed="collapsed" />
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="global-header">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)"
        />
        <div style="display: inline-flex; float: right;">
          <language />

          <user-info style="text-align: end;">
            <span slot="user-name">Hi {{ this.$store.state.currentRole }}</span>
          </user-info>
        </div>
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          minHeight: '280px'
        }"
      >
        <slot name="table-content"></slot>
        <slot name="table-test"></slot>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import store from "../store";
import { mapMutations, mapState } from "vuex";
import UserInfo from "./UserInfo.vue";
import Language from "./Language.vue";
import Sider from "@/components/Common/Sider.vue";

export default {
  name: "PageLayout",
  components: {
    UserInfo,
    Language,
    Sider
  },
  data() {
    return {
      collapsed: true
    };
  },
  created() {
    this.changeRoute(this.$route.path);
  },
  mounted() {
    document.querySelector("div.logo img").addEventListener("click", () => {
      this.$router.push("/");
    });
  },
  computed: {
    ...mapState({
      role: state => state.currentRole
    }),
    isAdmin() {
      return this.role == "admin";
    }
  },
  methods: {
    ...mapMutations({
      changeRoute: "route"
    }),
    routers(path) {
      this.$router.push(`/${path}`);
      this.changeRoute(path);
    }
  }
};
</script>

<style lang="less" scoped>
#components-layout-demo-custom-trigger {
  height: 100vh;
}

#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

.global-header {
  background: #fff;
  padding: 0px;
}
</style>
