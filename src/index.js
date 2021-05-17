'use strict';
require('dotenv').config()
const Discord = require('discord.js')
const welcome = require('./welcome')
const command = require('./command')
const client = new Discord.Client()


client.on('ready', async () => {
    console.log(`${client.user.username} has logged In`)
    welcome(client)
    command(client)
})

client.login(process.env.BOT_TOKEN)