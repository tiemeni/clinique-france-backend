const { COOKIE_NAME } = require("../commons/constants")
const { successHandler } = require("../commons/response.handler")

module.exports.disconnectUser = async (req, res) => {
        res.cookie(COOKIE_NAME, '', {
                httpOnly: process.env.NODE_ENV === 'production' | true,
                secure: process.env.NODE_ENV === 'production' | true, 
                expires: new Date(0) 
              });
        successHandler(res, {message: "processing disconnexion"}, 201)
}