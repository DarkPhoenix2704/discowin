const mongo = require('../mongo')
const userSchema = require('../schema/userSchema')


module.exports = async (client, message) => {
    const {content, guild, author} = message
    await mongo().then(async mongoose => {
        try {
            let data = content.split(' ')
            if (data.length < 4 || data.length > 4) {
                console.log('Invalid Input');
                message.reply('Enter data in the below mentioned format \n /register Pincode Age District' +
                    '\n Example :  /register 682354 18 Ernakulam')
                return
            }
            let pinCode = data[1]
            if (pinCode.length > 6 || pinCode.length < 6) {
                console.log('Invalid Input');
                message.reply('Enter data in the below mentioned format \n /register Pincode Age District' +
                    '\n Example :  /register 682354 18 Ernakulam')
                return
            }
            let age = parseInt(data[2])
            if (age < 0) {
                message.reply('Enter your Age!!')
                return
            }
            let district = data[3]
            await userSchema.findOneAndUpdate(
                {_id: author.id},
                {
                    _id: author.id,
                    guild_id: guild.id,
                    pinCode: parseInt(pinCode),
                    age: age,
                    district_name: district
                }, {
                    upsert: true
                }
            )
            message.reply('You have Successfully subscribed to Cowin notifications' +
                '\n You will be informed about vaccine availability in your region' +
                '\n Thank You for using DisCowin')
            console.log(`Data Updated Successfully : ${guild.id}  ${pinCode}  ${age}  ${district}`)

        } finally {
            mongoose.connection.close().then(r => console.log(r))
            console.log('Mongoose:- Connection Closed')
        }
    })
}