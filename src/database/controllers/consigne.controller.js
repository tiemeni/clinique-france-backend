const { httpStatus } = require("../../commons/constants");
const consigneService = require("../../services/consigne.service");
const handler = require('../../commons/response.handler');


const createConsigne = async (req, res) => {
    const data = req.body;
    try {
        const isGroupExist = await consigneService.findOneByQuery({ label: data.label})
        if (isGroupExist) return handler.errorHandler(res, "Consigne already exists", httpStatus.BAD_REQUEST)

        const result = await consigneService.createGroup({ ...data })
        return handler.successHandler(res, result, httpStatus.CREATED)
    } catch (error) {
        return handler.errorHandler(res, error, httpStatus.INTERNAL_SERVER_ERROR)
    }
}

const getAllConsignes = async (req, res) => {
    try {
        const result = await consigneService.findGroupsByQuery()
        return handler.successHandler(res, result, httpStatus.ACCEPTED)
    } catch (error) {
        return handler.errorHandler(res, error, httpStatus.INTERNAL_SERVER_ERROR)
    }
}

const getConsigneById = async (req, res) => {
    try {
        const result = await consigneService.findGroupById(req.params.id)
        return handler.successHandler(res, result, httpStatus.ACCEPTED)
    } catch (error) {
        return handler.errorHandler(res, error, httpStatus.INTERNAL_SERVER_ERROR)
    }
}

const updateConsigne = async (req, res) => {
    try {
        const result = await consigneService.updateGroup(req.params.id, {
            $set: {
                ...req.body
            }
        })
        return handler.successHandler(res, result, httpStatus.ACCEPTED)
    } catch (error) {
        return handler.errorHandler(res, error, httpStatus.INTERNAL_SERVER_ERROR)
    }
}

module.exports = { createConsigne, updateConsigne, getAllConsignes, getConsigneById }