'use strict';
require('dotenv').config()
const Discord = require('discord.js')
const cron = require('node-cron')
const welcome = require('./welcome')
const command = require('./command')
const updateDistrict = require('./updateData/updateDistrictData')
const updateVaccineAvailability = require('./updateData/updateVaccineAvailability')

const client = new Discord.Client()
client.on('ready', async () => {
    //await updateDistrict()
    welcome(client)
    command(client)
    await updateVaccineAvailability(client)
    const channel = client.channels.cache.find(channel => channel.name === 'discowin')
    channel.send('Hey Guys I\'m DisCowin.\n' +
        'I will inform you if vaccines are available in your region\n' +
        'I don\'t want to clutter this channel. So please dm me\n' +
        'Use /help to see available commands ')
    cron.schedule('0 0 * * *', async () => {
        await updateDistrict()
        console.log('District Table is updated')
    })
    cron.schedule('5 * * * *', async () => {
        await updateVaccineAvailability(client)
    })

})

client.login(process.env.BOT_TOKEN).then(() => {
    console.log(`${client.user.username}:- LoggedIn`)
})