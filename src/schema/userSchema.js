const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    guild_id: {type: String, required: true},
    pinCode: {type: Number, require: true},
    age: {type: Number, required: true},
    district_name: {type: String, required: true}
})
module.exports = mongoose.model('userData', userSchema)