const jwt = require("jsonwebtoken")
const { successHandler, errorHandler } = require("../commons/response.handler")
const { env } = require("../config/env/variables")
const { COOKIE_NAME } = require("../commons/constants")

module.exports.verifyToken = async (req, res) => {
    try {
        const result = await jwt.verify(req.cookies[COOKIE_NAME], process.env.jwt || env.jwt)
        successHandler(res, result, 200)
    } catch (e) {
        errorHandler(res, "token not valid", 503)
    }
}