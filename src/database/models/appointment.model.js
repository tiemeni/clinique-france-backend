const mongoose = require("mongoose")
const { APPOINTMENT, MOTIF, PATIENT, CENTRE, USER, LIEU } = require("../../constants/entity")

const appointmentModel = mongoose.Schema({
    practitioner: {
        type: mongoose.Types.ObjectId,
        ref: USER,
        required: true
    },
    patient: {
        type: mongoose.Types.ObjectId,
        ref: PATIENT,
        required: true
    },
    motif: {
        type: mongoose.Types.ObjectId,
        ref: MOTIF,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    provenance: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    date_long: {
        type: Date,
        required: true
    },
    dayOfWeek: {
        type: Number,
        required: true
    },
    wasMoved: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'Planifié'
    },
    sent: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    backgroundColor: {
        type: String,
        default: '#3788d8'
    },
    borderColor: {
        type: String,
        default: '#3788d8'
    }
})

module.exports = mongoose.model(APPOINTMENT, appointmentModel)
