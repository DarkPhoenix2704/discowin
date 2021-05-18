const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    pinCode: {type: Number, require: true},
    fortyFivePlus: {type: Boolean},
    districtId: {type: String}
})
module.exports = mongoose.model('userData', userSchema)