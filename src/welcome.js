module.exports = (client) => {
    client.on('guildMemberAdd', (member) => {
        const channel = member.guild.channels.cache.find(ch => ch.name === 'discowin')
        if (!channel) return
        channel.send(`Hii <@${member.id}>\nWelcome to the Covid Notification Server\n/help in dm for available commands \n Currently I\m available only in dm. So dont message me here`)
    })
}
