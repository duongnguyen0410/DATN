import axios from "@/utils/callApi";
const _ = require("lodash");

const state = {
  listProduct: [],
  listSize: [],
  dataFilter: {
    sorter: {
      name: "descend"
    },
    filter: {
      name: null
    }
  }
};

// getters
const getters = {};

// mutations
const mutations = {
  setListProduct(state, list) {
    state.listProduct = list;
  },
  setListSize(state, list) {
    state.listSize = list;
  }
};

// actions
const actions = {
  async getListSize({ commit }) {
    let { data } = await axios({ url: "api/v2/products/size", data: null, method: "GET" });
    commit("setListSize", data.data);
    return data;
  },
  async getListProduct({ commit }) {
    let { data } = await axios({ url: "api/v2/products", data: null, method: "GET" });
    commit("setListProduct", data.data);
    return data;
  },
  async createProduct({ commit }, payload) {
    let { data } = await axios({ url: "api/v2/products", data: payload, method: "POST" });
    if (!data.error) {
      commit("setListProduct", [...state.listProduct, { ...payload, id: data.data[0] }]);
    }
    return data;
  },
  async updateProduct({ commit, state }, payload) {
    let { data } = await axios({ url: "api/v2/products", data: payload, method: "PUT" });
    if (!data.error) {
      let product = state.listProduct.find(item => item.id == payload.id);
      product.name = payload.name;
      product.price == payload.price;
      product.size == payload.size;
    }
    return data;
  },
  async deleteProduct({ commit, state }, payload) {
    let { data } = await axios({ url: "api/v2/products", data: payload, method: "DELETE" });
    if (!data.error) {
      state.listProduct = state.listProduct.filter(item => item.id != payload.id);
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
