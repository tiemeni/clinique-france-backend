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

const deleteConsigneById = async (req, res) => {
    try {
        const result = await consigneService.deleteOne({ _id: req.params.consigneId });
        return handler.successHandler(res, result)
    } catch (err) {
        return handler.errorHandler(res, err, httpStatus.INTERNAL_SERVER_ERROR)
    }
}

const searhConsignesByKey = async (req, res) => {
    let key = req.query;
    const formatQuery = (obj) => {
      let res = {};
      Object.keys(obj).forEach((key) => {
        res[key] = { $regex: obj[key], $options: "i" };
      });
      return res;
    };
  
    const query = formatQuery(key);
  
    try {
      const founds = await consigneService.findGroupsByQuery(query);
      if (founds) {
        return handler.successHandler(res, founds);
      } else {
        return handler.errorHandler(res, [], 404);
      }
    } catch (error) {
      handler.errorHandler(res, error, httpStatus.INTERNAL_SERVER_ERROR);
    }
  };

module.exports = { createConsigne, updateConsigne, getAllConsignes, getConsigneById, deleteConsigneById, searhConsignesByKey }