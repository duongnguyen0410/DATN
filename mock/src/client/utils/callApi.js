import axios from "axios";

// Add a request interceptor
axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    // console.log('request', config);
    // Object.assign(config.headers, {...config.headers, abc: 'abc'});
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    console.log(response.config.method.toUpperCase(), response.request.responseURL, response.status);

    if (response.status == 401 || response.status == 403) {
      this.$router.push({ path: `/` });
    } else return response;
  },
  function(error) {
    // Do something with response error
    // console.log('error', error)
    return Promise.reject(error);
  }
);

export default axios;
