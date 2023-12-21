const mongoose = require("mongoose");
const {
  PROFESSION,
  MOTIF,
  LIEU,
  SPECIALITY,
  CENTRE,
  CONSIGNE,
} = require("../../constants/entity");

const motifModel = mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  nom: {
    type: String,
    required: true,
    unique: true,
  },
  couleur: {
    type: String,
  },
  default_time: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
  },
  active: {
    type: Boolean,
    required: true,
  },
  idConsigne: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: CONSIGNE
  },
  idProfession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: PROFESSION,
  },
  idSpeciality: {
    type: mongoose.Schema.Types.ObjectId,
    ref: SPECIALITY,
    required: true,
  },
});
module.exports = mongoose.model(MOTIF, motifModel);
