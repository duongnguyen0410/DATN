<template>
  <div class="sider">
    <div class="logo">
      <img src="static/icon/logo.png" class="shortcut" />
      <span style="color: white; font-size: 20px;" v-if="!collapsed">
        SOICT
      </span>

      <div class="trigger-small">
        <a-icon type="menu-fold" @click="() => (collapsed = !collapsed)" />
      </div>
    </div>

    <a-divider class="m-0" style="background: rgba(255, 255, 255, 0.25);"></a-divider>

    <a-menu @click="onClickMenu" mode="vertical" theme="dark">
      <template v-for="menu of siders">
        <template v-if="menu.items && menu.items.length && isRender(menu.key)">
          <a-sub-menu :key="menu.key">
            <span slot="title">
              <a-icon :type="menu.icon" />
              <span>{{ $t("common." + menu.name) }}</span>
            </span>
            <template v-for="item of menu.items">
              <a-menu-item v-if="isRender(item.key)" :key="item.key">
                <router-link :to="item.link">
                  <a-icon :type="item.icon" />
                  {{ $t("common." + item.name) }}
                </router-link>
              </a-menu-item>
            </template>
          </a-sub-menu>
        </template>
        <template v-else>
          <a-menu-item v-if="isRender(menu.key)" :key="menu.key">
            <router-link :to="menu.link">
              <a-icon :type="menu.icon" />
              <span>{{ $t("common." + menu.name) }}</span>
            </router-link>
          </a-menu-item>
        </template>
      </template>
    </a-menu>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { siders } from "@/utils/sider.js";
import { author } from "@/utils/author.js";

export default {
  data() {
    return {
      siders
    };
  },
  props: {
    collapsed: Boolean
  },
  computed: {
    ...mapState({
      role: state => state.currentRole
    })
  },
  methods: {
    ...mapActions({
      logout: "modules/auth/logout"
    }),
    isRender(screenKey) {
      if (!author[screenKey]) return true;
      if (author[screenKey]["view-access"][this.role] === 1) {
        return true;
      } else return false;
    },
    onClickMenu({ item, key, keyPath }) {
      switch (key) {
        case "logout":
          this.logout().then(response => {
            localStorage.clear();
            this.$router.push("/login");
          });
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style scoped>
.logo {
  margin: 16px;
  color: aliceblue;
  font-size: 28px;
}
</style>

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

.shadow {
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
}

.sider {
  z-index: 10;

  .logo {
    height: 64px;
    line-height: 64px;
    position: relative;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    overflow: hidden;
    background-color: #002140;
    background-color: rgba(128, 128, 128, 0.5);

    span {
      color: #fff;
      font-size: 20px;
      margin: 0 0 0 12px;
      font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica, sans-serif;
      font-weight: 600;
      display: inline-block;
      height: 32px;
      line-height: 32px;
      vertical-align: middle;
    }

    img {
      width: 40px;
      margin-left: 4px;
      margin-bottom: 4px;
      display: inline-block;
      vertical-align: middle;
      cursor: pointer;
    }
  }
}

.menu {
  padding: 16px 0;
}

.global-header {
  background: #fff;
  padding: 0px;
}
</style>
