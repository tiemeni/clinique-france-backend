const mongoose = require('mongoose');
const { MOTIF, PRATICIEN, CENTRE, USER, RDV } = require('../../constants/entity');

const rdvModel = mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    idUtilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER
    },
    idPracticien: {
        type: mongoose.Schema.Types.ObjectId,
        ref: PRATICIEN
    },
    idMotif: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MOTIF
    },
    creneau: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model(RDV, rdvModel);