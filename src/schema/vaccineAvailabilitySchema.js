const mongoose = require('mongoose')

const vaccineAvailabilitySchema = new mongoose.Schema({
    _id: {type: Number, required: true},
    district_name: {type: String, required: true},
    name: {type: String, required: true},
    vaccine: {type: String, required: true},
    min_age_limit: {type: Number, required: true},
    fee_type: {type: String, required: true},
    fee: {type: Number},
    date: {type: String, required: true}


})
module.exports = mongoose.model('vaccineAvailability', vaccineAvailabilitySchema)