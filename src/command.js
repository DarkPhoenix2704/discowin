const prefix = '/'
const register = require('./commands/register')
const checkNow = require('./commands/checknow')
const unRegister = require('./commands/unregister')
const help = require('./commands/help')
module.exports = client => {
    client.on('message', message => {
        const {content} = message
        if (message.content.startsWith(prefix)) {
            const request = message.content.split(' ')[0];
            switch (request) {
                case '/register':
                    register(client, message)
                    break
                case '/checknow':
                    checkNow(client, message)
                    break
                case '/unregister':
                    unRegister(client, message)
                    break
                case '/help':
                    help(client, message)
                    break
                default:
                    message.reply('Enter a valid Command!')
                    break
            }
        }
    })
}