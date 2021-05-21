const mongo = require('./mongo')
const districtSchema = require('./schema/districtSchema')
const userSchema = require('./schema/userSchema')
const vaccineAvailabilitySchema = require('./schema/vaccineAvailabilitySchema')

let districtList
let subscribedUserList
let availableVaccineList

module.exports = async client => {
    await mongo().then(async mongoose => {
        try {
            await userSchema.find({}, (err, data) => {
                if (err) console.log(err)
                subscribedUserList = data
            })

            await districtSchema.find({}, (err, data) => {
                if (err) console.log(err)
                districtList = data
            })
            await vaccineAvailabilitySchema.find({}, (err, data) => {
                if (err) console.log(err)
                availableVaccineList = data
            })

            for (let i = 0; i < subscribedUserList.length; i++) {
                await vaccineAvailabilitySchema.find({district_name: subscribedUserList[i].district_name}, (err, data) => {
                    availableVaccineList = data
                })
                if (availableVaccineList.length === 0) {
                    continue
                }
                const channel = client.channels.cache.get('839451838452989976')
                channel.send('<@' + subscribedUserList[i]._id + '>  ' + 'availableVaccineList')

            }

            console.log(availableVaccineList)
        } finally {
            await mongoose.connection.close()
        }
    })
}


function findObjectByKey(array, key, value) {
    console.log(array)
    for (let i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i]
        }
    }
    return null;
}