const mongo = require('../mongo')
const userSchema = require('../schema/userSchema')


module.exports = async (client, message) => {
    const {content, guild} = message
    await mongo().then(async mongoose => {
        try {
            let data = content.split(' ')
            if (data.length < 4 || data.length > 4) {
                console.log('Invalid Input');
                message.reply('Enter data in the below mentioned format \n /register pincode fortyFivePlus district' +
                    '\n Example :  /register 682354 true Ernakulam')
                return
            }
            let pinCode = data[1]
            console.log(pinCode)
            if (pinCode.length > 6 || pinCode.length < 6) {
                message.reply('Enter a valid Pincode!!')
                return
            }
            let fortyFivePlus = data[2]
            console.log(fortyFivePlus)
            if (fortyFivePlus !== 'true' && fortyFivePlus !== 'false') {
                message.reply('Use  true or false for fortyFivePlus field')
                return
            }
            let district = data[3]
            await userSchema.findOneAndUpdate(
                {_id: guild.id},
                {
                    _id: guild.id,
                    pinCode: parseInt(pinCode),
                    fortyFivePlus: fortyFivePlus,
                    districtId: district
                }, {
                    upsert: true
                }
            )
            message.reply('You have Successfully subscribed to Cowin notifications' +
                '\n You will be informed about vaccine availability in your region' +
                '\n Thank You for using DisCowin')
            console.log(`Data Updated Successfully : ${guild.id}  ${pinCode}  ${fortyFivePlus}  ${district}`)

        } finally {
            mongoose.connection.close().then(r => console.log(r))
        }
    })
}