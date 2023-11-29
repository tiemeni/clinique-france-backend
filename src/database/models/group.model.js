const mongoose = require('mongoose');
const { GROUP, CENTRE, RIGHT } = require('../../constants/entity');

const groupModel = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rights: [{
        type: mongoose.Types.ObjectId,
        ref: RIGHT,
    }],
})

module.exports = mongoose.model(GROUP, groupModel);
