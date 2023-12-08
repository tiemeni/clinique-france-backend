const { COOKIE_NAME } = require("../commons/constants")
const { successHandler } = require("../commons/response.handler")

module.exports.disconnectUser = async (req, res) => {
        res.cookie(COOKIE_NAME, "", null)
        successHandler(res, {message: "processing disconnexion"}, 201)
}