const mongo = require('../mongo')
const userSchema = require('../schema/userSchema')


module.exports = async (client, message) => {
    const {content, author} = message
    await mongo().then(async mongoose => {
        try {
            let data = content.split(' ')
            if (data.length < 3 || data.length > 3) {
                console.log('Invalid Input');
                message.reply('Enter data in the below mentioned format \n /register Age District' +
                    '\n Example :  /register 18 Ernakulam')
                return
            }
            let age = parseInt(data[1])
            if (age < 0) {
                message.reply('Enter your Age!!')
                return
            }
            let district = data[2]
            await userSchema.findOneAndUpdate(
                {_id: author.id},
                {
                    _id: author.id,
                    age: age,
                    district_name: district
                }, {
                    upsert: true
                }
            )
            message.reply('You have Successfully subscribed to Cowin notifications' +
                '\n You will be informed about vaccine availability in your region' +
                '\n Thank You for using DisCowin')
            console.log(`Data Updated Successfully : ${author.id}  ${age}  ${district}`)

        } finally {
            mongoose.connection.close()
            console.log('Mongoose:- Connection Closed')
        }
    })
}