import axios from "@/utils/callApi";
const _ = require("lodash");

const state = {
  listAssets: [],
  listUnits: [],
  dataFilter: {
    sorter: {
      name: "ascend",
      count: "descend"
    },
    filter: {
      name: null,
      unit: [],
      created_at: null,
      type: null
    }
  },
  listImportAsset: [],
  listExportAsset: []
};

// getters
const getters = {};

// mutations
const mutations = {
  setListAssets(state, list) {
    state.listAssets = list;
  },
  setListUnits(state, list) {
    state.listUnits = list;
  },
  setListImportAsset(state, list) {
    state.listImportAsset = list;
  },
  setListExportAsset(state, list) {
    state.listExportAsset = list;
  }
};

// actions
const actions = {
  async getListAssets({ commit }) {
    let { data } = await axios({ url: "api/v2/assets", data: null, method: "GET" });
    commit("setListAssets", data.data);
    return data;
  },
  async createAsset({ commit, state }, payload) {
    let { data } = await axios({ url: "api/v2/assets", data: payload, method: "POST" });
    if (!data.error) {
      commit("setListAssets", [...state.listAssets, { ...payload, count: 0, id: data.data[0] }]);
    }
    return data;
  },
  async updateAsset({ commit, state }, payload) {
    let { data } = await axios({ url: "api/v2/assets", data: payload, method: "PUT" });
    if (!data.error) {
      let asset = state.listAssets.find(item => item.id == payload.id);
      asset.name = payload.name;
      asset.unit == payload.unit;
    }
    return data;
  },
  async deleteAsset({ commit, state }, payload) {
    let { data } = await axios({ url: "api/v2/assets", data: payload, method: "DELETE" });
    if (!data.error) {
      state.listAssets = state.listAssets.filter(item => item.id != payload.id);
    }
    return data;
  },
  async getListUnits({ commit }) {
    let { data } = await axios({ url: "api/v2/assets/units", data: null, method: "GET" });
    commit("setListUnits", data.data);
    return data;
  },

  async importAssets({ commit, state }, payload) {
    let { data } = await axios({ url: "api/v2/assets/import", data: payload, method: "POST" });
    if (!data.error) {
      payload.data.map(item => {
        let find = state.listAssets.find(e => e.id == item.id);
        find.count = +find.count + +item.count;
      });
    }
    return data;
  },

  async exportAssets({ commit, state }, payload) {
    let { data } = await axios({ url: "api/v2/assets/export", data: payload, method: "POST" });
    if (!data.error) {
      payload.map(item => {
        let find = state.listAssets.find(e => e.id == item.id);
        find.count = +find.count - +item.count;
      });
    }
    return data;
  },

  async getListImportAssets({ commit }) {
    let { data } = await axios({ url: "api/v2/assets/import", data: null, method: "GET" });
    data.data = data.data.filter(item => {
      item.data = JSON.parse(item.data);
      item.type = "import";
      return true;
    });
    commit("setListImportAsset", data.data);
    return data.data;
  },
  async getListExportAssets({ commit }) {
    let { data } = await axios({ url: "api/v2/assets/export", data: null, method: "GET" });
    data.data = data.data.filter(item => {
      item.data = JSON.parse(item.data);
      item.type = "export";
      return true;
    });
    commit("setListExportAsset", data.data);
    return data.data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
