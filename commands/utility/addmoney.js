const fs = require('fs');
const balanceFile = './balances.json';

function loadBalances() {
    return JSON.parse(fs.readFileSync(balanceFile, 'utf8'));
}

function saveBalances(data) {
    fs.writeFileSync(balanceFile, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
    name: 'addmoney',
    description: 'Начислить монеты игроку (только для админов)',
    async execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('❌ У вас нет прав для использования этой команды.');
        }

        const user = message.mentions.users.first();
        const amount = parseInt(args[1]);

        if (!user) return message.reply('❌ Укажите пользователя, которому начислить монеты.');
        if (isNaN(amount) || amount <= 0) return message.reply('❌ Укажите корректное количество монет.');

        const balances = loadBalances();
        if (!balances[user.id]) {
            balances[user.id] = 100;
        }

        balances[user.id] += amount;
        saveBalances(balances);

        message.reply(`✅ Начислено **${amount}** монет пользователю ${user.username}.`);
    },
};
