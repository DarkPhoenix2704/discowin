const mongo = require('../mongo')
const districtSchema = require('../schema/districtSchema')
const userSchema = require('../schema/userSchema')
const vaccineSchema = require('../schema/vaccineAvailabilitySchema')
const axios = require('axios')
let baseUrl = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id='

let districtList
let subscribedUserList;


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
            for (let i = 0; i < subscribedUserList.length; i++) {
                let district = subscribedUserList[i]
                const id = await findObjectByKey(districtList, 'district_name', district.district_name)._id
                let date = getDate()
                let requestUrl = baseUrl + id + '&date=' + date
                console.log(requestUrl)
                await axios.get(requestUrl, {
                    headers: {
                        'User-Agent':
                            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0',
                    }
                }).then(async value => {
                    let sessionData = value.data.sessions
                    await vaccineSchema.deleteMany({})
                    for (i = 0; i < sessionData.length; i++) {
                        await vaccineSchema.findOneAndUpdate({
                            _id: sessionData[i].center_id
                        }, {
                            _id: sessionData[i].center_id,
                            district_name: district.district_name,
                            name: sessionData[i].name,
                            vaccine: sessionData[i].vaccine,
                            min_age_limit: sessionData[i].min_age_limit,
                            fee_type: sessionData[i].fee_type,
                            fee: sessionData[i].fee,
                            date: sessionData[i].date
                        }, {
                            upsert: true
                        })
                    }
                })

            }
        } finally {
            await mongoose.connection.close()
        }

    })
}

function findObjectByKey(array, key, value) {
    for (let i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i]
        }
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