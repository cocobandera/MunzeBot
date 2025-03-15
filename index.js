const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const PREFIX = '?';
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

// Загрузка команд
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

commandFiles.forEach(file => {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if (!command.name || typeof command.execute !== 'function') {
    console.warn(`⚠️ Пропущен файл ${file}: нет name или execute.`);
    return;
  }
  client.commands.set(command.name, command);
  // Если у команды есть алиасы, добавляем их тоже
  if (command.aliases) {
    command.aliases.forEach(alias => client.commands.set(alias, command));
  }
  console.log(`✅ Загружена команда: ${command.name}`);
});

client.on('messageCreate', async message => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;
  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);
  if (!command) return;
  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(`❌ Ошибка выполнения команды ${commandName}:`, error);
    message.reply('❌ Ошибка выполнения команды.');
  }
});

client.once('ready', () => {
  console.log(`✅ Бот запущен как ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
