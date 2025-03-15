module.exports = {
    name: 'balance',
    description: 'Проверить ваш баланс',
    async execute(message, args) {
        const fs = require('fs');
        const balanceFile = './balances.json';

        function loadBalances() {
            return JSON.parse(fs.readFileSync(balanceFile, 'utf8'));
        }

        const userId = message.author.id;
        const balances = loadBalances();
        const balance = balances[userId] || 100;

        message.reply(`💰 Ваш баланс: **${balance}** монет.`);
    },
};
