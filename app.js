'use strict';

const Discord = require('discord.js');
const bot     = new Discord.Client({'autoReconnect': true, 'max_message_cache': 0});
const blessed = require('blessed');
const config  = require('./config/config');
const token = config.token;

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
  useCommands(inputbox.getValue());
  inputbox.clearValue();
  inputbox.focus();
  screen.render();
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
