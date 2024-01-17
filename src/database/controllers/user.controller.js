const handler = require("../../commons/response.handler");
const { httpStatus, COOKIE_NAME } = require("../../commons/constants");
const auth = require("../../commons/auth");
const userService = require("../../services/user.service");
const specialityService = require("../../services/specialty.service");
const { env } = require("../../config/env/variables");
const cloudinary = require("../../../cloudinary.config");
const { generateRandomCode, sendCodeVerif } = require("../../helpers");
const patientService = require("../../services/patient.service");

const createUser = async (req, res) => {
  const data = req.body;
  try {
    console.log(req.query.module)
    // if user already exist
    const condition = { email: data.email };
    const isUserExist = req.query.module !== "externe" ? await userService.findOneByQuery(condition) : await patientService.findOneByQuery(condition);
    if (isUserExist)
      return handler.errorHandler(
        res,
        req.query.module !== "externe" ? "L'utilisateur existe déjà" : "Le patient existe déjà",
        httpStatus.BAD_REQUEST
      );

    //create and store the new user
    const payload = { ...data };
    const user = req.query.module !== "externe" ? await userService.createUser(payload) : await patientService.createPatient(payload);

    const token = await auth.generateToken({
      id: user._id,
      username: user.email,
      type: req.query.module !== "externe" ? "user" : "patient",
    });

    return handler.successHandler(
      res,
      { user, access_token: token },
      httpStatus.CREATED
    );
  } catch (err) {
    return handler.errorHandler(
      res,
      err.message,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const condition = { email: email };
    const user = req.query.module !== "externe" ? await userService.findOneByQuery(condition) : await patientService.findOneByQuery(condition);
    if (!user) {
      return handler.errorHandler(
        res,
        req.query.module !== "externe" ? "l'utilisateur n'existe pas" : "Le patient n'existe pas",
        httpStatus.NOT_FOUND
      );
    }

    console.log(user.password === password)

    if (await auth.verifyPassword(password, user.password)) {
      const token = await auth.generateToken({
        id: user._id,
        username: user.email,
        type: req.query.module !== "externe" ? "user" : "patient",
      });
      return handler.successHandler(res, {
        user,
        access_token: token,
      });
    } else {
      return handler.errorHandler(
        res,
        "Invalid password",
        httpStatus.NOT_ACCEPTABLE
      );
    }
  } catch (err) {
    return handler.errorHandler(
      res,
      err.message,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const getUserById = async (req, res) => {
  try {
    const condition = {
      _id: req.params.userid,
      isPraticien: req.query.isPraticien ?? false,
    };
    const foundUser = await userService.findOneByQuery(condition);
    if (foundUser == null)
      return handler.errorHandler(res, "No user founded", httpStatus.NOT_FOUND);
    return handler.successHandler(res, foundUser);
  } catch (err) {
    return handler.errorHandler(
      res,
      err.message,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const getPraticienByIdSpeciality = async (req, res) => {
  console.log("here");
  let concernedPraticens = [];
  try {
    const condition = { isPraticien: true };
    const foundUser = await userService.findUserByQuery(condition);
    if (foundUser == null)
      return handler.errorHandler(res, "No user founded", httpStatus.NOT_FOUND);
    req.query.idSpeciality &&
      foundUser?.forEach((e, _i) => {
        if (e.job?._id == req.query.idSpeciality) {
          concernedPraticens.push(e);
        }
      });
    return handler.successHandler(res, concernedPraticens);
  } catch (err) {
    return handler.errorHandler(
      res,
      err.message,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const getUsersGroupByJob = async (req, res) => {
  try {
    if (!req.query.isPraticien)
      return handler.errorHandler(
        res,
        "Les utilisateurs ne peuvent être groupé par spécialités.",
        httpStatus.BAD_REQUEST
      );

    const users = await userService.findAndGroupByJob({
      isPraticien: req.query.isPraticien,
    });

    return handler.successHandler(res, users);
  } catch (error) {
    return handler.errorHandler(
      res,
      error.message,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const getAllUsers = async (req, res) => {
  let foundUsers;
  try {
    const condition = { isPraticien: req.query.isPraticien ?? false };
    foundUsers = await userService.findUserByQuery(condition);
    return handler.successHandler(res, foundUsers);
  } catch (err) {
    return handler.errorHandler(
      res,
      err.message,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const updateUserById = async (req, res) => {
  try {
    let extractedPw = req.body.password;
    if (extractedPw) extractedPw = await auth.encryptPassword(extractedPw);
    const result = req.query.module === "externe" ? await patientService.updatePatient(
      req.params.userid,
      { $set: { ...req.body, password: extractedPw } }
    ) : await userService.updateUser(
      req.params.userid,
      { $set: { ...req.body, password: extractedPw } }
    );
    return handler.successHandler(res, result, httpStatus.CREATED);
  } catch (err) {
    return handler.errorHandler(
      res,
      err.message,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const deleteUserById = async (req, res) => {
  try {
    const result = await userService.deleteOne({ _id: req.params.userid });
    return handler.successHandler(res, result);
  } catch (err) {
    return handler.errorHandler(
      res,
      err.message,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const deleteAllUsers = async (req, res) => {
  try {
    const isDelete = await userService.deleteUsers();
    return handler.successHandler(res, isDelete);
  } catch (err) {
    return handler.errorHandler(
      res,
      err.message,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const uploadPicture = async (req, res) => {
  console.log("here")
  try {
    const userId = req.params.userid;
    const photo = req.file.buffer;

    // Sauvegarde de l'image dans cloudinary
    await cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
        },
        async (error, result) => {
          if (error) {
            console.log("here 1")
            return handler.errorHandler(
              res,
              "Erreur lors du téléchargement vers Cloudinary: " + error,
              httpStatus.INTERNAL_SERVER_ERROR
            );
          }
          const user =  req.query.module === "externe" ? await patientService.findPatientById(userId) : await userService.findUserById(userId);
          if (!user) {
            return handler.errorHandler(
              res,
              "Utilisateur non trouvé",
              httpStatus.NOT_FOUND
            );
          }

          user.photo = result.secure_url;
          await user.save();

          return handler.successHandler(res, user);
        }
      )
      .end(photo);
  } catch (error) {
    return handler.errorHandler(
      res,
      error.message,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const updatePushToken = async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.params.userid;

    req.query.module === "externe" ? await userService.findAndUpdate(userId, { expoToken: token }) : await userService.findAndUpdate(userId, { expoToken: token });
    return handler.successHandler(res, {
      message: "Le token a bien été enregistré",
    });
  } catch (error) {
    return handler.errorHandler(
      res,
      error.message,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const processVerifCode = async (req, res) => {
  console.log(req.body);
  try {
    const { email } = req.body;
    const register = req.body.register;
    let codeVerif;
    const userExist = req.query.module === "externe" ? await patientService.findOneByQuery({ email: email }) : await userService.findOneByQuery({ email: email });
    console.log(userExist)
    if ((userExist && !register) || (register === true && !userExist)) {
      codeVerif = generateRandomCode();
      const callbacks = {
        onError: (err) =>
          handler.errorHandler(res, err, httpStatus.INTERNAL_SERVER_ERROR),
        onSuccess: () =>
          handler.successHandler(res, {
            codeVerif: codeVerif,
            id: userExist?._id,
          }),
      };
      const result = await sendCodeVerif(codeVerif, email, callbacks);
    } else {
      return handler.errorHandler(
        res,
        userExist
          ? "l'utilisateur existe deja , connextez vous"
          : "l'utilisateur n'existe pas!",
        404
      );
    }
  } catch (error) {
    return handler.errorHandler(res, error, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

const searchPratByKey = async (req, res) => {
  const key = req.params.searchKey;
  const query = { name: { $regex: key, $options: "i" }, isPraticien: true };
  try {
    const founds = await userService.findUserByQuery(query);
    if (founds) {
      return handler.successHandler(res, founds);
    } else {
      return handler.errorHandler(res, [], 404);
    }
  } catch (error) {
    handler.errorHandler(res, error, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

const searchPraticienByIdSpeciality = async (req, res) => {
  const key = req.params.searchKey;
  if (key?.toString()?.length > 0) {
    const query = { label: { $regex: key, $options: "i" } };
    const foundSpeciality = await specialityService.findSpecialtyByQuery(query);
    if (foundSpeciality?.length > 0) {
      let scecificSpeciality = foundSpeciality[0];
      const query2 = { job: scecificSpeciality?._id, isPraticien: true };
      const concernedPraticien = await userService.findUserByQuery(query2);
      if (concernedPraticien) {
        return handler.successHandler(res, concernedPraticien);
      } else {
        return handler.errorHandler(
          res,
          "une erreur est survenue!",
          httpStatus.INTERNAL_SERVER_ERROR
        );
      }
    } else {
      return handler.successHandler(res, []);
    }
  } else {
    return handler.successHandler(res, []);
  }
};

const searhUserByKey = async (req, res) => {
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
    const founds = await userService.findUserByQuery(query);
    if (founds) {
      return handler.successHandler(res, founds);
    } else {
      return handler.errorHandler(res, [], 404);
    }
  } catch (error) {
    handler.errorHandler(res, error, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  createUser,
  processVerifCode,
  getPraticienByIdSpeciality,
  getUserById,
  getAllUsers,
  updateUserById,
  deleteUserById,
  signIn,
  deleteAllUsers,
  getUsersGroupByJob,
  uploadPicture,
  updatePushToken,
  searchPratByKey,
  searchPraticienByIdSpeciality,
  searhUserByKey
};
