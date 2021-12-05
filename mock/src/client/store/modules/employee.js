import axios from "../../utils/callApi";
const _ = require("lodash");
import { FETCH, CREATE, UPDATE, DELETE, EMPLOYEE_FETCH_ROLE, EMPLOYEE_FETCH_USER } from "../types";

const state = {
  dataSource: [],
  avaiable: [],
  add: [],
  listRole: [],
  listUser: []
};

// getters
const getters = {};

// actions
const actions = {
  [FETCH]: ({ state, commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      dispatch(EMPLOYEE_FETCH_ROLE);
      dispatch(EMPLOYEE_FETCH_USER);
      axios
        .get("employees")
        .then(resp => {
          console.log("FETCH data response");
          console.log(resp);
          if (resp.data.success || (resp.data && resp.data.data.avaiable)) {
            commit(FETCH, {
              dataSource: resp.data.data.total,
              avaiable: resp.data.data.avaiable,
              add: resp.data.data.add
            });
            resolve(resp.data);
          } else reject(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  [CREATE]: ({ commit }, newItem) => {
    return new Promise((resolve, reject) => {
      console.log(newItem);
      axios({ url: "employees", data: newItem, method: "POST" })
        .then(resp => {
          console.log("CREATE item response");
          console.log(resp);

          if (resp.data.success || (resp.data && resp.data.data.avaiable)) {
            commit(CREATE, resp.data.data.item);
            resolve(resp);
          } else reject(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  [UPDATE]: async ({ commit }, editItem) => {
    let resp = await axios({ url: "employees", data: editItem, method: "PUT" });
    console.log("UPDATE item response");
    console.log(resp);
    if (resp.data.success || (resp.data && resp.data.data.avaiable)) {
      commit(UPDATE, editItem);
      return resp;
    }
  },
  [DELETE]: ({ commit }, item) => {
    return new Promise((resolve, reject) => {
      axios({ url: `employees?ID=${item.ID}`, data: item, method: "DELETE" })
        .then(resp => {
          console.log("DELETE item response");
          console.log(resp);

          if (resp.data.success || (resp.data && resp.data.data.avaiable)) {
            commit(DELETE, item);
            resolve(resp);
          } else reject(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  [EMPLOYEE_FETCH_ROLE]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      axios.get("roles").then(result => {
        commit(EMPLOYEE_FETCH_ROLE, result);
      });
    });
  },
  [EMPLOYEE_FETCH_USER]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      axios.get("employees").then(result => {
        commit(EMPLOYEE_FETCH_USER, result);
      });
    });
  }
};

// mutations
const mutations = {
  [FETCH]: (state, param) => {
    state.dataSource = [...param.dataSource];
    state.avaiable = [...param.avaiable];
    state.add = [...param.add];
  },
  [CREATE]: (state, item) => {
    state.dataSource = [...state.dataSource, item];
  },
  [UPDATE]: (state, param) => {
    const target = state.dataSource.find(item => item.ID == param.ID);
    if (target) {
      console.log("UPDATE", target, param);

      for (const key in target) {
        if (target.hasOwnProperty(key) && param.hasOwnProperty(key)) {
          target[key] = param[key];
        }
      }
    }
  },
  [DELETE]: (state, param) => {
    const dataSource = [...state.dataSource];
    state.dataSource = dataSource.filter(item => item.ID !== param.ID);
  },
  [EMPLOYEE_FETCH_ROLE]: (state, param) => {
    let arr = [];
    param.data.data.total.filter(item => {
      arr.push(_.pick(item, ["ID", "Name"]));

      return true;
    });
    state.listRole = [...arr];
  },
  [EMPLOYEE_FETCH_USER]: (state, param) => {
    let arr = [];
    param.data.data.total.filter(item => {
      arr.push(_.pick(item, ["ID", "Name"]));

      return true;
    });
    state.listUser = [...arr];
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
