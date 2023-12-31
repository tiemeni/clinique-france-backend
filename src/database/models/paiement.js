const mongoose = require('mongoose');
const { PAIEMENT, CENTRE, USER } = require('../../constants/entity');

const paiementModel = mongoose.Schema({
    moyen: {
        type: String,
        required: true,
    },
    idUtilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER
    },
});
module.exports = mongoose.model(PAIEMENT, paiementModel);