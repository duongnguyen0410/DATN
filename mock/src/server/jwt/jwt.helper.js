const jwt = require("jsonwebtoken");
const _ = require('lodash')

var session = {}
/**
 * private function generateToken
 * @param user 
 * @param secretSignature 
 * @param tokenLife 
 */
let generateToken = (user, secretSignature, tokenLife) => {
  return new Promise((resolve, reject) => {
    // Định nghĩa những thông tin của user mà bạn muốn lưu vào token ở đây
    const userData = _.omit(user, 'password');
    // Thực hiện ký và tạo token
    jwt.sign(
      {data: userData},
      secretSignature,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        resolve(token);
    });
  });
}

/**
 * This module used for verify jwt token
 * @param {*} token 
 * @param {*} secretKey 
 */
let verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
}

/**
 * This module used to store jwt token
 * @param {*} id 
 * @param {*} token 
 */
let setToken = (id, token) => {
  session[id] = token;
}

/**
 * This module used to get jwt token
 * @param {*} id 
 * @param {*} token 
 */
let getToken = (id) => {
  return session[id];
}

/**
 * This module used to remove jwt token
 * @param {*} id 
 * @param {*} token 
 */
let removeToken = (id) => {
  delete session[id];
}

module.exports = {
  generateToken: generateToken,
  verifyToken: verifyToken,
  storeToken: setToken,
  getToken: getToken,
  removeToken: removeToken
};