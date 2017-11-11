'use strict';

const Discord = require('discord.js');
const bot     = new Discord.Client({'autoReconnect': true, 'max_message_cache': 0});
const blessed = require('blessed');
const _       = require('lodash');
const moment  = require('moment');
const chalk   = require('chalk');

const config  = require('./config/config');
const token = config.token;

let lastCommand = [];
let currentIndex = -1;

bot.login(token);

const screen = blessed.screen({
  'smartCSR': true,
  'title': 'Discord-CLI',
  'fullUnicode': true,
});

let box = blessed.box({
  'top': 1,
  'left': 'center',
  'width': '100%',
  'height': '90%',
  'content': '',
  'tags': true,
  'alwaysScroll': true,
  'scrollable': true,
  'mouse': true,
  'scrollbar': {
    'style': {
      'bg': 'yellow'
    }
  },
  'keys': true,
  'border': {
    'type': 'line'
  },
  'style': {
    'fg': 'white',
    'border': {
      'fg': '#f0f0f0'
    }
  }
});

let inputbox = blessed.textbox({
  'bottom': 0,
  'width': '100%',
  'height': 2,
  'inputOnFocus': true,
  'style': {
    'fg': 'white'
  }
});

const useCommands = (text) => {
  box.pushLine(text);
}

screen.append(box);
screen.append(inputbox);
inputbox.focus();
inputbox.key(['escape', 'C-c'], () => (process.exit(0)));
screen.render();

inputbox.key('enter', () => {
  const commandUsed = inputbox.getValue();
  useCommands(commandUsed);
  lastCommand.push(commandUsed);
  currentIndex = _.size(lastCommand);
  inputbox.clearValue();
  inputbox.focus();
  screen.render();
});

inputbox.on('keypress', function(ch, key) {
  if (key && key.name === 'up' && currentIndex >= 0) {
    inputbox.clearValue();
    inputbox.setValue(lastCommand[--currentIndex]);
    inputbox.focus();
    screen.render();
  } else if (key && key.name === 'down' && currentIndex + 1 <= _.size(lastCommand)) {
    inputbox.clearValue();
    inputbox.setValue(lastCommand[++currentIndex]);
    inputbox.focus();
    screen.render();
  }
});


bot.on('ready', () => {
  box.pushLine(`Connected as ${bot.user.tag} (userId: ${bot.user.id})`);
  box.setScrollPerc(100);
  screen.render();
});

bot.on('disconnect', e => {
  box.pushLine('Disconnected');
  box.setScrollPerc(100);
  screen.render();
});

bot.on('message', message => {
  let isDirectMessage = false;
  if (message.author.bot && message.channel.type !== 'dm') return;
  let msg = `[${moment(message.createdTimestamp).format('DD/MM/YYYY HH:mm:ss')}] `;
  if (message.guild)
    msg += `${message.guild.name}(${message.guild.id}) - ${message.channel.name}(${message.channel.id})`;
  if (message.channel.type === 'dm') {
    msg += '(DM)';
    isDirectMessage = true;
  }
  msg += ` - [${message.author.username}]${message.author.tag}(${message.author.id}) :`;
  if (isDirectMessage) msg = chalk.redBright(msg);
  msg += ` \n ${message.cleanContent}`;
  box.pushLine(msg);
  box.setScrollPerc(100);
  screen.render();
});
