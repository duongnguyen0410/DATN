import axios from "@/utils/callApi";
const _ = require("lodash");

const state = {
  userFullInfo: {}
};

// getters
const getters = {};

// mutations
const mutations = {
  setUserFullInfo(state, value) {
    state.userFullInfo = value;
  }
};

// actions
const actions = {
  async getUserInfo({ commit }, payload) {
    let { data } = await axios({ url: "api/v2/staff/info", data: payload, method: "POST" });
    if (!data.error) {
      commit("setUserFullInfo", data.data[0]);
    }
    return data;
  },
  async updateUserInfo({ commit }, payload) {
    let { data } = await axios({ url: "api/v2/staff/info", data: payload, method: "PUT" });
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
