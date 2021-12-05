<template>
  <a-dropdown class="header-right">
    <div style="cursor: pointer">
      <a-icon type="user" />
      <slot name="user-name"></slot>
    </div>
    <a-menu style="width: 150px" slot="overlay">
      <a-menu-item @click="gotoProfile()">
        <a-icon type="user" />
        <span> {{ $t("user.profile") }} </span>
      </a-menu-item>
      <a-menu-item>
        <a-icon type="setting" />
        <span> {{ $t("user.setting") }}</span>
      </a-menu-item>
      <a-menu-divider />
      <a-menu-item @click="logout()">
        <a-icon type="poweroff" />
        <span> {{ $t("user.logout") }}</span>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>
<script>
import { mapActions } from "vuex";
import { AUTH_LOGOUT } from "../store/types";

export default {
  methods: {
    ...mapActions("authUsers", [AUTH_LOGOUT]),
    logout() {
      this.$store.dispatch(AUTH_LOGOUT).then(result => {
        if (result.data.success) {
          this.$router.push({ path: `/` }); // -> go to login
          window.location.reload();
        }
      });
    },
    gotoProfile() {
      this.$router.push({ path: `/profile` }); // -> go to login
    }
  }
};
</script>
<style scoped>
.avatar {
  margin: 20px 4px 20px 0;
  color: #1890ff;
  background: hsla(0, 0%, 100%, 0.85);
  vertical-align: middle;
}
.header-right {
  float: right;
  margin-right: 10px;
}
</style>
