const jwtHelper = require("../jwt/jwt.helper");

// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret-example";

/**
 * Middleware: Authorization user by Token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
let isAuth = async (req, res, next) => {
  // Take token JWT into header/cookie
  const tokenFromClient = req.headers["Authorization"] || (req.cookies ? req.cookies['Authorization'] : '');
  if (req.method == 'GET' && req.url == '/' ||
    req.method == 'POST' && req.url == '/login' ||
    req.method == 'GET' && req.url.match(/verify/g)) {
    return next();
  }

  if (tokenFromClient) { // if client request contain token
    try {
      //Decode this token to json object
      const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);

      // //validate account in session
      // //For production
      // if (jwtHelper.getToken(decoded.data.ID) != tokenFromClient) { throw new Error("Error while authenication"); }

      //If token is valid, add to req object
      // next middleware
      req.jwtDecoded = decoded;
      next();
    } catch (error) {
      // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:
      console.log("Error while verify token:", error)
      let id = req.cookies ? req.cookies['id'] : '';
      jwtHelper.removeToken(id);
      res.clearCookie('Authorization');
      res.clearCookie('id');
      return res.redirect('/')

    }
  } else {
    // Không tìm thấy token trong request

    let id = req.cookies ? req.cookies['id'] : '';
    jwtHelper.removeToken(id);
    res.clearCookie('Authorization');
    res.clearCookie('id');
    return res.redirect('/')

  }
}

module.exports = {
  isAuth: isAuth,
};