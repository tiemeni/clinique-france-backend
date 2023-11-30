const mongoose = require("mongoose");
const { CENTRE, PROFESSION, SPECIALITY } = require("../../constants/entity");
const { ID_PROFESSION_SPECIALISTE } = require("../../constants/id.profession");

const specialtyModel = mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    unique: true,
    required: true,
  },
  reference: {
    type: String,
    unique: true
  },
  webAlert: {
    type: String,
  },
  secretaryAlert: {
    type: String,
  },
  idProfession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: PROFESSION,
  },
});

module.exports = mongoose.model(SPECIALITY, specialtyModel);
