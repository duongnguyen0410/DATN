import "babel-polyfill";
import Vue from "vue";
import VueRouter from "vue-router";
import VueCookies from "vue-cookies";
import store from "@/store/index";
import i18n from "../lang/i18n.js";
import axios from "@/utils/callApi";
import _ from "lodash";
import { author } from "@/utils/author.js";

import Login from "@/pages/PageLogin.vue";
import Employee from "@/pages/Employee/index.vue";
import Asset from "@/pages/Asset/index.vue";
import AnalysisWarehouse from "@/pages/AnalysisWarehouse/index.vue";
import Sale from "@/pages/Sale/index.vue";
import Product from "@/pages/Product/index.vue";
import BillManagement from "@/pages/BillManagement/index.vue";
import Profile from "@/pages/Profile/index.vue";
import Ant from "ant-design-vue";

import "ant-design-vue/dist/antd.css";
import "../../static/style/style.less";
import { AUTH_LOGOUT } from "@/store/types";

Vue.use(Ant);
Vue.use(VueRouter);
Vue.use(VueCookies);

const routes = [
  { path: "/", component: Login },
  { path: "/employee", component: Employee },
  { path: "/asset", component: Asset },
  { path: "/analysis-warehouse", component: AnalysisWarehouse },
  { path: "/sale", component: Sale },
  { path: "/product", component: Product },
  { path: "/bill-management", component: BillManagement },
  { path: "/profile", component: Profile },
  { path: "*", component: Login }
];

const router = new VueRouter({
  mode: "history",
  routes
});

const canAccess = (screenKey, role) => {
  if (!author[screenKey]) return true;
  if (author[screenKey]["view-access"][role] === 1) {
    return true;
  } else return false;
};

router.beforeEach(async (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    if (to.path != "/") return next({ path: "/" });
    else return next();
  } else {
    let distPath = to.path.replace(/\//, "");
    if (!canAccess(distPath, store.state.currentRole)) {
      let result = await store.dispatch(AUTH_LOGOUT);
      if (result.data.success) {
        router.push({ path: `/` }); // -> go to login
        return window.location.reload();
      }
    }

    let match = _.find(routes, e => e.path.match(to.path));
    if (match && match.path != "/") return next();
    else return next({ path: "/employee" });
  }
});

const app = new Vue({
  el: "#app",
  router,
  i18n,
  store,
  mounted() {
    store.commit("route", this.$router.history.current.path.split("/")[1]);
    axios.get("userRole").then(result => {
      if (result && result.data.data) {
        store.commit("currentRole", result.data.data.admin == true ? "admin" : "employee");
      }
    });
  }
});

export default app;
