const fs = require('fs');
const inventoryFile = './inventories.json';

function loadInventory() {
    if (!fs.existsSync(inventoryFile)) {
        fs.writeFileSync(inventoryFile, '{}', 'utf8');
    }
    return JSON.parse(fs.readFileSync(inventoryFile, 'utf8'));
}

module.exports = {
    name: 'inventory',
    aliases: ['inv'], // Теперь ?inv работает как ?inventory
    description: 'Показать ваш инвентарь',
    async execute(message) {
        const userId = message.author.id;
        const inventoryData = loadInventory();

        // Если у пользователя нет записей в инвентаре
        if (!inventoryData[userId] || Object.keys(inventoryData[userId]).length === 0) {
            return message.reply('👜 Ваш инвентарь пуст.');
        }

        let reply = '🎒 **Ваш инвентарь**:\n';
        // Перебираем предметы (ключ — название предмета, значение — количество)
        for (const [itemName, count] of Object.entries(inventoryData[userId])) {
            reply += `🔹 **${itemName}** x${count}\n`;
        }

        message.reply(reply);
    },
};
