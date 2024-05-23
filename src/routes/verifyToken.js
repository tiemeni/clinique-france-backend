const jwt = require("jsonwebtoken")
const { successHandler, errorHandler } = require("../commons/response.handler")
const { env } = require("../config/env/variables")
const { COOKIE_NAME } = require("../commons/constants")
const patientService = require("../services/patient.service")
const userService = require("../services/user.service")

module.exports.verifyToken = async (req, res) => {
    try {
        const result = await jwt.verify(req.cookies[COOKIE_NAME], process.env.jwt || env?.jwt)
        const user = req.query.module === "externe" ? await patientService.findOneByQuery({email: result?.username}) : await userService.findOneByQuery({email: result?.username})
        if(user){
            successHandler(res, result, 200)
            return;
        }
        errorHandler(res, "token not valid", 404)
    } catch (e) {
        errorHandler(res, `token not valid server have error, ${e }, cookies reçus = ${JSON.stringify(req.cookies)}`, 503)
    }
}