const mongo = require('../mongo')
const userSchema = require('../schema/userSchema')
module.exports = async (client, message) => {
    const {author} = message
    await mongo().then(async mongoose => {
        try {
            await userSchema.findByIdAndDelete({
                _id: author.id
            })
            console.log(`Deleted Record with id ${author.id}`)
            message.reply('You have been unSubscribed Successfully')
        } finally {
            await mongoose.connection.close()
        }
    })
}