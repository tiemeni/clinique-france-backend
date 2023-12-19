const mongoose = require('mongoose');
const { CONSIGNE } = require('../../constants/entity');

const ConsigneModel = mongoose.Schema({
    label: {
        type: String,
        require
    },
    content: {
        type: String,
    }
})

module.exports = mongoose.model(CONSIGNE, ConsigneModel);