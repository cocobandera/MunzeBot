const fs = require('fs');
const inventoryFile = './inventories.json';

function loadInventory() {
    return JSON.parse(fs.readFileSync(inventoryFile, 'utf8'));
}

module.exports = {
    name: 'inventory',
    description: 'Показать ваш инвентарь',
    async execute(message) {
        const userId = message.author.id;
        const inventory = loadInventory();

        if (!inventory[userId] || inventory[userId].length === 0) {
            return message.reply('👜 Ваш инвентарь пуст.');
        }

        message.reply(`🎒 Ваш инвентарь: ${inventory[userId].join(', ')}`);
    },
};
