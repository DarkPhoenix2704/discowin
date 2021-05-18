'use strict';
require('dotenv').config()
const Discord = require('discord.js')
const cron = require('node-cron')

const welcome = require('./welcome')
const command = require('./command')
const updateDistrict = require('./updateDistrictData')

const client = new Discord.Client()

client.on('ready', async () => {
    console.log(`${client.user.username} has logged In`)
    welcome(client)
    command(client)
    cron.schedule('0 0 * * *', async () => {
        await updateDistrict()
        console.log('District Table is updated')
    })
})

client.login(process.env.BOT_TOKEN)