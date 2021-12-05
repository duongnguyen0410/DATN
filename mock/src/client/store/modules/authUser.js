import { AUTH_REQUEST, AUTH_ERROR, AUTH_SUCCESS, AUTH_LOGOUT, FETCH_AUTHENTICATION } from "../types";
import store from "../index";
import apiCall from "@/utils/callApi";

const state = {
  token: localStorage.getItem("Authorization") || "",
  status: "",
  hasLoadedOnce: false
};

const getters = {
  isAuthenticated: state => state.token,
  authStatus: state => state.status
};

const actions = {
  [AUTH_REQUEST]: ({ commit }, user) => {
    return new Promise(async (resolve, reject) => {
      commit(AUTH_REQUEST);
      try {
        let resp = await apiCall({ url: "login", data: user, method: "POST" });
        console.log(resp);
        if (!resp.data.success) return reject(null);
        localStorage.setItem("Authorization", resp.data.data.item.token);

        commit(AUTH_SUCCESS, resp);
        store.commit("currentRole", resp.data.data.item.admin == true ? "admin" : "employee");
        resolve(resp);
      } catch (err) {
        commit(AUTH_ERROR, err);
        localStorage.removeItem("Authorization");
        reject(err);
      }
    });
  },
  [AUTH_LOGOUT]: ({ commit }) => {
    return new Promise(resolve => {
      apiCall({ url: "logout", method: "GET" })
        .then(resp => {
          commit(AUTH_LOGOUT);
          localStorage.removeItem("Authorization");
          resolve(resp);
        })
        .catch(err => {
          commit(AUTH_ERROR, err);
          localStorage.removeItem("Authorization");
          reject(err);
        });
    });
  },
  [FETCH_AUTHENTICATION]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      apiCall({ url: "test", method: "GET" }).then(result => {
        if (result && result.data.success == true) {
          // commit()
        } else {
          localStorage.removeItem("Authorization");
          commit(AUTH_LOGOUT);
        }
      });
    });
  }
};

const mutations = {
  [AUTH_REQUEST]: state => {
    state.status = "loading";
  },
  [AUTH_SUCCESS]: (state, resp) => {
    state.status = "success";
    state.token = resp.data.data.item.token;
    state.hasLoadedOnce = true;
  },
  [AUTH_ERROR]: state => {
    state.status = "error";
    state.hasLoadedOnce = true;
  },
  [AUTH_LOGOUT]: state => {
    state.token = "";
  }
};

export default {
  // namespaced: true,
  state,
  getters,
  actions,
  mutations
};
