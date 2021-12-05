import axios from "@/utils/callApi";
const _ = require("lodash");

const state = {
  listProduct: [],
  listBill: [],
  listUser: []
};

// getters
const getters = {};

// mutations
const mutations = {
  setListProduct(state, list) {
    state.listProduct = list;
  },
  setListBill(state, list) {
    state.listBill = list;
  },
  setListUser(state, list) {
    state.listUser = list;
  }
};

// actions
const actions = {
  async createBill({ commit }, payload) {
    let { data } = await axios({ url: "api/v2/bill", data: payload, method: "POST" });
    return data;
  },
  async getBill({ commit }) {
    let { data } = await axios({ url: "api/v2/bill", data: null, method: "GET" });
    commit("setListBill", data.data);
    return data;
  },
  async getListStaff({ commit }) {
    let { data } = await axios({ url: "api/v2/staff", data: null, method: "GET" });
    if (!data.error) {
      commit("setListUser", data.data);
    }
    return data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
