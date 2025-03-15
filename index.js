const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
require('dotenv').config();

const PREFIX = '?';
const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent
]});

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Подключение к MongoDB успешно установлено!"))
.catch(err => console.error("🔴 Ошибка подключения к MongoDB:", err));

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

commandFiles.forEach(file => {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.name, command);
  if (command.aliases && Array.isArray(command.aliases)) {
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
  } catch (err) {
    console.error(`❌ Ошибка выполнения команды ${commandName}:`, err);
    message.reply('❌ Ошибка выполнения команды.');
  }
});

client.once('ready', () => {
  console.log(`✅ Бот запущен как ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
