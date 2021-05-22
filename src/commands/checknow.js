const notifyUsers = require('../notifyUsers')

module.exports = async client => {
    await notifyUsers(client)
}