const mongo = require('../mongo')
const districtSchema = require('../schema/districtSchema')
const userSchema = require('../schema/userSchema')
const vaccineSchema = require('../schema/vaccineAvailabilitySchema')
const notifyUsers = require('../notifyUsers')
const axios = require('axios')
let baseUrl = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id='

let districtList
let subscribedUserList;


module.exports = async client => {
    await mongo().then(async mongoose => {
        try {
            await userSchema.find({}, async (err, data) => {
                if (err) console.log(err)
                subscribedUserList = data
            })

            await districtSchema.find({}, async (err, data) => {
                if (err) console.log(err)
                districtList = data
            })
            for (let i = 0; i < subscribedUserList.length; i++) {
                let user = subscribedUserList[i]
                const district = await findObjectByKey(districtList, 'district_name', user.district_name)
                let date = getDate()
                let requestUrl = baseUrl + district._id + '&date=' + date
                console.log(requestUrl)
                await axios.get(requestUrl, {
                    headers: {
                        'User-Agent':
                            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0',
                    }
                }).then(async value => {
                    let sessionData = value.data.sessions
                    for (let j = 0; j < sessionData.length; j++) {
                        if (sessionData[j].available_capacity !== 0) {
                            await vaccineSchema.findOneAndUpdate({
                                _id: sessionData[j].center_id
                            }, {
                                _id: sessionData[j].center_id,
                                district_name: district.district_name,
                                name: sessionData[j].name,
                                vaccine: sessionData[j].vaccine,
                                min_age_limit: sessionData[j].min_age_limit,
                                fee_type: sessionData[j].fee_type,
                                fee: sessionData[j].fee,
                                available_capacity: sessionData[j].available_capacity,
                                date: sessionData[j].date
                            }, {
                                upsert: true
                            })
                        }

                    }
                }, err => {
                    console.log(err)
                })

            }
        } finally {
            await mongoose.connection.close()
            console.log('Vaccine availability Updated')
            await notifyUsers(client)

        }

    })
}

function findObjectByKey(array, key, value) {
    if (array !== undefined) {
        for (let i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return array[i]
            }
        }
        return null
    }
    return null;
}

function getDate() {
    let today = new Date()
    let dd = today.getDate()
    let mm = today.getMonth() + 1

    const yyyy = today.getFullYear()
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    today = dd + '-' + mm + '-' + yyyy
    return today
}