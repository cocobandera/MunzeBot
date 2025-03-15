const fs = require('fs');
const inventoryFile = './inventories.json';

function loadInventory() {
    return JSON.parse(fs.readFileSync(inventoryFile, 'utf8'));
}

function saveInventory(data) {
    fs.writeFileSync(inventoryFile, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
    name: 'use',
    description: 'Использовать предмет из инвентаря',
    async execute(message, args) {
        if (!args[0]) return message.reply('❌ Укажите предмет для использования.');

        const userId = message.author.id;
        const itemName = args.join(' '); // Позволяет использовать предметы с пробелами в названии
        const inventory = loadInventory();

        if (!inventory[userId] || !inventory[userId][itemName]) {
            return message.reply(`❌ У вас нет **${itemName}** в инвентаре.`);
        }

        // Уменьшаем количество предметов
        inventory[userId][itemName] -= 1;

        // Если предметов больше нет, удаляем его из инвентаря
        if (inventory[userId][itemName] <= 0) {
            delete inventory[userId][itemName];
        }

        saveInventory(inventory);

        message.reply(`✅ Вы использовали **${itemName}**.`);
    },
};
