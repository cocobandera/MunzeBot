const { Client, Collection, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const PREFIX = '?'; 

const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent
]});

client.commands = new Collection();


client.on('messageCreate', async message => {
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('❌ Ошибка выполнения команды.');
    }
});

client.once('ready', () => {
    console.log(`✅ Бот запущен как ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
