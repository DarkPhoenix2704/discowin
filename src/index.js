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
    welcome(client)
    command(client)
    //await updateDistrict()
    await updateVaccineAvailability(client)
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