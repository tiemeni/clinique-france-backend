const { env } = require("../config/env/variables");
const { COOKIE_NAME } = require("./constants");

exports.successHandler = (res, data, statusCode = 200) => {
    if(data?.access_token) res.cookie(COOKIE_NAME, data.access_token, {
        maxAge: env.EXPIRE_DATE,
        httpOnly: true,
        secure: true, // Utilisez 'secure' si vous êtes en production et utilisez HTTPS
        sameSite: 'None'
      });
    res.status(statusCode).json({ success: true, data, cookieData:res.cookies });
}

exports.errorHandler = (res, message, statusCode = 400, data = null) => {
    res.status(statusCode).json({ success: false, message , data });
}