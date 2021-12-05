import Vue from "vue";
import Vuex from "vuex";
import app from "../app.js";
import jwtDecode from "jwt-decode";

import employee from "./modules/employee";
import product from "./modules/product";
import bill from "./modules/bill";
import asset from "./modules/asset";
import staff from "./modules/staff";
import authUser from "./modules/authUser";

Vue.use(Vuex);

const getRoleFromToken = () => {
  let token = authUser.state.token;
  if (token) {
    let data = jwtDecode(token);
    return data.data.admin ? "admin" : "employee";
  }
  return "unknown";
};

const getUserInfo = () => {
  return authUser.state.token ? jwtDecode(authUser.state.token) : {};
};

export default new Vuex.Store({
  state: {
    route: "sale",
    currentRole: getRoleFromToken(),
    userInfo: getUserInfo()
  },
  getters: {
    route: state => state.route
  },
  mutations: {
    route: (state, param) => {
      let r = param.split(/\/|\\/);
      state.route = !r[0] ? r[1] : r[0];
    },
    currentRole: (state, param) => {
      if (param == "admin") state.currentRole = "admin";
      else state.currentRole = "employee";
    },
    setLang: (state, payload) => {
      app.$i18n.locale = payload;
    }
  },
  actions: {
    setLang: ({ commit }, payload) => {
      commit("setLang", payload);
    },
    abcd() {
      console.log("action abcd");
    }
  },
  modules: {
    authUser,
    employee,
    asset,
    product,
    bill,
    staff
  }
});
