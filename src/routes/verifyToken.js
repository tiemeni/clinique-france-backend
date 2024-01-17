const jwt = require("jsonwebtoken")
const { successHandler, errorHandler } = require("../commons/response.handler")
const { env } = require("../config/env/variables")
const { COOKIE_NAME } = require("../commons/constants")
const patientService = require("../services/patient.service")
const userService = require("../services/user.service")

module.exports.verifyToken = async (req, res) => {
    console.log("verif token")
    try {
        const result = await jwt.verify(req.cookies[COOKIE_NAME], process.env.jwt || env.jwt)
        const user = req.query.module === "externe" ? patientService.findOneByQuery({email: result?.username}) : userService.findOneByQuery({email: result?.username})
        if(user){
            console.log("user ", user)
            successHandler(res, result, 200)
            return;
        }
        errorHandler(res, "token not valid", 404)
    } catch (e) {
        console.log("error ------------ ", e)
        errorHandler(res, "token not valid", 503)
    }
}