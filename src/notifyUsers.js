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
                await vaccineAvailabilitySchema.find({
                    min_age_limit: getAge(subscribedUserList[i].age),
                    district_name: subscribedUserList[i].district_name
                }, (err, data) => {
                    availableVaccineList = data
                    console.log(`Vaccines available in ${subscribedUserList[i].district_name} :- ${availableVaccineList.length}`)
                })
                if (availableVaccineList.length === 0) {
                    continue
                }
                let message = `Nearby Available Vaccination Centres \n\n`
                message = message + `Date\tLocation\tVaccine\tAvailableVaccine\tFeeType\n`
                for (let j = 0; j < availableVaccineList.length; j++) {
                    const {date, name, vaccine, available_capacity, fee_type} = availableVaccineList[j]
                    message = message + `${date}\t${name}\t${vaccine}\t${available_capacity}\t${fee_type}\n`
                }
                client.users.cache.get(subscribedUserList[i]._id).send(message)

            }

        } finally {
            await mongoose.connection.close()
            console.log('Users Notified About Vaccine Availability')
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

function getAge(age) {
    if (age >= 18 && age < 45) {
        return 18
    } else if (age >= 45) {
        return 45
    }
}