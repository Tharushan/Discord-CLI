'use strict';

const Discord = require('discord.js');
const bot     = new Discord.Client({'autoReconnect': true, 'max_message_cache': 0});
const config  = require('./config/config');
const token = config.token;

bot.login(token);

bot.on('ready', () => {
  console.log(`Connected as ${bot.user.tag} (userId: ${bot.user.id})`);
});

bot.on('disconnect', e => {
  console.log('Disconnected');
});
