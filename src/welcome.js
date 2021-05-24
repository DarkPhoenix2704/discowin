module.exports = (client) => {
    client.on('guildMemberAdd', (member) => {
        const channel = member.guild.channels.cache.find(ch => ch.name === 'discowin')
        if (!channel) return
        channel.send(`Welcome to the Covid Notification Server\n
        /help for available commands\n`)
        channel.send('Currently I\'m available only in dm. So don\'t message me here')
    })
}