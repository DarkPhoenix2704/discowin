const mongoose = require('mongoose')
const districtSchema = new mongoose.Schema({
    _id: {type: Number, required: true},
    district_name: {type: String, required: true}
})
module.exports = mongoose.model('districtList', districtSchema)