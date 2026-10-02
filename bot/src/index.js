require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

if (!process.env.BOT_TOKEN) {
  console.log('BOT_TOKEN is not set. Copy .env.example to .env and add your token.');
  process.exit(0);
}

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start(ctx => ctx.reply('Добро пожаловать в TezBor!', Markup.inlineKeyboard([
  Markup.button.webApp('🛍 Открыть TezBor', process.env.MINI_APP_URL)
])));
bot.launch();
console.log('TezBor bot started');
