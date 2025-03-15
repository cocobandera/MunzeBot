const fs = require('fs');
const balanceFile = './balances.json';

function loadBalances() {
    return JSON.parse(fs.readFileSync(balanceFile, 'utf8'));
}

function saveBalances(data) {
    fs.writeFileSync(balanceFile, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
    name: 'give',
    description: 'Передать монеты другому игроку',
    async execute(message, args) {
        const senderId = message.author.id;
        const recipient = message.mentions.users.first();
        const amount = parseInt(args[1]);

        if (!recipient) return message.reply('❌ Укажите пользователя, которому передать монеты.');
        if (isNaN(amount) || amount <= 0) return message.reply('❌ Укажите корректное количество монет.');

        const balances = loadBalances();

        if (!balances[senderId]) {
            balances[senderId] = 100;
        }
        if (!balances[recipient.id]) {
            balances[recipient.id] = 100;
        }

        if (balances[senderId] < amount) {
            return message.reply('❌ У вас недостаточно монет!');
        }

        balances[senderId] -= amount;
        balances[recipient.id] += amount;
        saveBalances(balances);

        message.reply(`✅ Вы передали **${amount}** монет пользователю ${recipient.username}!`);
    },
};
