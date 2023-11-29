const { httpStatus } = require("../commons/constants");
const { errorHandler } = require("../commons/response.handler");
const { findCentreById } = require("../services/structure.service");

module.exports = async (req, res, next) => {
  console.log("in here");
  try {
    if (
      (!req.query.idCentre || req.query.idCentre == null) &&
      !req.query.module
    )
      return errorHandler(
        res,
        "Veuillez renseigner l'identifiant du centre",
        httpStatus.OK
      );

    if ((!req.query.idCentre || req.query.idCentre == null) && req.query.module)
      next();

    if (req.query.idCentre) {
      const { idCentre } = req.query;
      const isExist = await findCentreById(idCentre);

      if (!isExist)
        errorHandler(
          res,
          "Veuillez renseigner un identifiant de centre valide",
          httpStatus.OK
        );

      req.idCentre = idCentre;
      next();
    }
  } catch (e) {
    console.log("exception here", e.message);
    return errorHandler(
        res,
        "une erreur est survenue sur le serveur",
        httpStatus.INTERNAL_SERVER_ERROR
      );
  }
};
