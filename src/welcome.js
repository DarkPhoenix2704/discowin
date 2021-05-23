module.exports = (client) => {
    client.on('guildMemberAdd', (member) => {
        const channel = member.guild.channels.cache.find(ch => ch.name === 'general')
        if (!channel) return
        channel.send(`Welcome to the Covid Notification Server\n
        /help for available commands`)
    })
}