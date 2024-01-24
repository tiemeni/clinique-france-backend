const { env } = require("../config/env/variables");
const { COOKIE_NAME } = require("./constants");

exports.successHandler = (res, data, statusCode = 200) => {
    if(data?.access_token) res.cookie(COOKIE_NAME, data.access_token, {
        maxAge: env.EXPIRE_DATE,
        sameSite: "Lax",
      });
    res.status(statusCode).json({ success: true, data });
}

exports.errorHandler = (res, message, statusCode = 400, data = null) => {
    res.status(statusCode).json({ success: false, message , data });
}