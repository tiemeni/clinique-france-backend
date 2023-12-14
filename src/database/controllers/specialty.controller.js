const { httpStatus } = require('../../commons/constants');
const handler = require('../../commons/response.handler');
const specialtyService = require('../../services/specialty.service');

const createSpecialty = async (req, res) => {
    const data = req.body
    try {
        const isSpecialtyExist = await specialtyService.findOneByQuery({ title: data.title })
        if (isSpecialtyExist) return handler.errorHandler(res, "Specialty already exist", httpStatus.BAD_REQUEST)

        const result = await specialtyService.createSpecialty({ ...data });
        return handler.successHandler(res, result, httpStatus.CREATED)
    } catch (error) {
        return handler.errorHandler(res, error, httpStatus.INTERNAL_SERVER_ERROR)
    }
}

const getAllSpecialties = async (req, res) => {
    try {
        const result = await specialtyService.findSpecialtyByQuery();
        return handler.successHandler(res, result, httpStatus.ACCEPTED)
    } catch (error) {
        return handler.errorHandler(res, error, httpStatus.INTERNAL_SERVER_ERROR)
    }
}

const getOneSpecialty = async (req, res) => {
    try {
        const result = await specialtyService.findSpecialtyById(req.params.id)
        return handler.successHandler(res, result, httpStatus.ACCEPTED)
    } catch (error) {
        return handler.errorHandler(res, error, httpStatus.INTERNAL_SERVER_ERROR)
    }
}

const getSpecialitiesByIdProfession = async (req, res) => {
    try {
        const result = await specialtyService.findSpecialtyByQuery({ idProfession: req.params.idProfession })
        return handler.successHandler(res, result, httpStatus.ACCEPTED)
    } catch (error) {
        return handler.errorHandler(res, error, httpStatus.INTERNAL_SERVER_ERROR)
    }
}

const updateSpecialtyById = async (req, res) => {
    try {
        const result = await specialtyService.updateSpecialty(req.params.id, {
            $set: {
                ...req.body
            }
        });
        return handler.successHandler(res, result, httpStatus.CREATED)
    } catch (error) {
        return handler.errorHandler(res, error, httpStatus.INTERNAL_SERVER_ERROR)
    }
}

const deleteSpecialtyById = async (req, res) => {
    try {
        const result = await specialtyService.deleteOne({ _id: req.params.id});
        return handler.successHandler(res, result, httpStatus.CREATED)
    } catch (error) {
        console.log(`Error when deleting ${error}`);
        return handler.errorHandler(res, error, httpStatus.INTERNAL_SERVER_ERROR)
    }
}

const searhSpecByKey = async (req, res) => {
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
      const founds = await specialtyService.findSpecialtyByQuery(query);
      if (founds) {
        return handler.successHandler(res, founds);
      } else {
        return handler.errorHandler(res, [], 404);
      }
    } catch (error) {
      handler.errorHandler(res, error, httpStatus.INTERNAL_SERVER_ERROR);
    }
  };

module.exports = { createSpecialty, getAllSpecialties, updateSpecialtyById, deleteSpecialtyById, getOneSpecialty, getSpecialitiesByIdProfession, searhSpecByKey }
