const fs = require('fs');
const inventoryFile = './inventories.json';

function loadInventory() {
    if (!fs.existsSync(inventoryFile)) {
        fs.writeFileSync(inventoryFile, '{}', 'utf8');
    }
    return JSON.parse(fs.readFileSync(inventoryFile, 'utf8'));
}

function saveInventory(data) {
    fs.writeFileSync(inventoryFile, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
    name: 'use',
    description: 'Использовать предмет из инвентаря. Формат: ?use <предмет> <количество>',
    async execute(message, args) {
        // Если не указано вообще ничего
        if (!args[0]) {
            return message.reply('❌ Укажите название предмета. Пример: `?use зелье 2`');
        }

        // Попробуем считать последнее слово как количество
        const lastArg = args[args.length - 1];
        let quantity = parseInt(lastArg, 10);
        let itemName;

        if (isNaN(quantity)) {
            // Если последнее слово не число, значит вся команда - это название предмета
            quantity = 1;
            itemName = args.join(' ');
        } else {
            // Если последнее слово - число, значит оно - количество, а всё остальное - название
            itemName = args.slice(0, -1).join(' ');
        }

        if (quantity <= 0) {
            return message.reply('❌ Количество должно быть положительным числом.');
        }

        // Загружаем инвентарь
        const userId = message.author.id;
        const inventoryData = loadInventory();

        // Проверяем, есть ли у пользователя записи
        if (!inventoryData[userId] || !inventoryData[userId][itemName]) {
            return message.reply(`❌ У вас нет предмета **${itemName}** в инвентаре.`);
        }

        // Проверяем, хватает ли предметов для использования
        if (inventoryData[userId][itemName] < quantity) {
            return message.reply(`❌ У вас недостаточно **${itemName}**. У вас есть только ${inventoryData[userId][itemName]}.`);
        }

        // Уменьшаем количество предметов
        inventoryData[userId][itemName] -= quantity;

        // Если количество дошло до 0, удаляем предмет из инвентаря
        if (inventoryData[userId][itemName] <= 0) {
            delete inventoryData[userId][itemName];
        }

        saveInventory(inventoryData);

        message.reply(`✅ Вы использовали **${itemName}** x${quantity}.`);
    },
};
