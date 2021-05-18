const mongo = require('../mongo')
const userSchema = require('../schema/userSchema')
module.exports = async (client, message) => {
    const {guild} = message
    await mongo().then(async mongoose => {
        try {
            await userSchema.findByIdAndDelete({
                _id: guild.id
            })
            console.log(`Deleted Record with id ${guild.id}`)
            message.reply('You have been unSubscribed Successfully')
        } finally {
            await mongoose.connection.close()
        }
    })
}