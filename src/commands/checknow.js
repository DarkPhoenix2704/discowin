const mongo = require('../mongo')
const districtSchema = require('../schema/districtSchema')
const userSchema = require('../schema/userSchema')
const axios = require('axios')

let baseUrl = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id='
let availableVaccineList
module.exports = async (client, message) => {
    let authorId = message.author.id
    let user
    let districtList
    await mongo().then(async mongoose => {
        try {
            await userSchema.find({
                _id: authorId
            }, (err, data) => {
                if (err) console.log(err)
                user = data
            })
            await districtSchema.find({}, async (err, data) => {
                if (err) console.log(err)
                districtList = data
            })
            let date = getDate()
            const district = await findObjectByKey(districtList, 'district_name', user[0].district_name)
            let url = baseUrl + district._id + '&date=' + date
            console.log(url)
            await axios.get(url, {
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0',

                }
            }).then(async value => {
                let sessionData = value.data.sessions
                let availableSessions = []
                for (let j = 0; j < sessionData.length; j++) {
                    if (sessionData[j].available_capacity !== 0) {
                        availableSessions.push(sessionData[j])
                    }
                }
                if (availableSessions.length === 0) {
                    await message.author.send('Currently Vaccines are not available in nearest Centre')
                } else {
                    let messageData = 'The Vaccines are available in following Places\n'
                    messageData = messageData + `Date\tLocation\tVaccine\tAvailableVaccine\tFeeType\n`
                    for (let j = 0; j < availableSessions.length; j++) {
                        const {date, name, vaccine, available_capacity, fee_type} = availableSessions[j]
                        messageData = messageData + `${date}\t${name}\t${vaccine}\t${available_capacity}\t${fee_type}\n`
                    }
                    message.author.send(messageData)

                }
                }
            )


        } finally {
            await mongoose.connection.close()
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