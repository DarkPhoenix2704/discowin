const mongo = require('./mongo')
const districtSchema = require('./schema/districtSchema')
const axios = require('axios');
const fetch = require("node-fetch");

const url = 'https://cdn-api.co-vin.in/api/v2/admin/location/districts/17'


module.exports = async () => {
    let data;
    await axios.get(url, {
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0',
        }
    }).then(async value => {
        data = value.data
        await mongo().then(async mongoose => {
            try {
                await districtSchema.deleteMany({})
                const districtArray = data.districts
                for (let i = 0; i < districtArray.length; i++) {
                    await districtSchema.findOneAndUpdate({_id: districtArray[i].district_id}, {
                        _id: districtArray[i].district_id,
                        district_name: districtArray[i].district_name
                    }, {
                        upsert: true
                    })
                }
            } finally {
                await mongoose.connection.close()
            }
        })
    })
}