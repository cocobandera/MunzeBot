const fs = require('fs');

const shopFile = './shop.json';
const inventoryFile = './inventories.json';
const balanceFile = './balances.json';

function loadJSON(file) {
    // Если файла нет — создаём пустой объект
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, '{}', 'utf8');
    }
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
    name: 'buy',
    description: 'Купить предмет в магазине',
    async execute(message, args) {
        // Проверяем, ввёл ли пользователь название предмета
        if (!args[0]) {
            return message.reply('❌ Укажите предмет для покупки. Пример: `?buy танк 1`');
        }

        const itemKey = args[0].toLowerCase(); // ключ из shop.json, например "танк"
        const quantity = args[1] ? parseInt(args[1]) : 1; // количество (по умолчанию 1)

        if (isNaN(quantity) || quantity <= 0) {
            return message.reply('❌ Укажите корректное количество. Пример: `?buy танк 2`');
        }

        const userId = message.author.id;
        const shopData = loadJSON(shopFile);
        const inventoryData = loadJSON(inventoryFile);
        const balanceData = loadJSON(balanceFile);

        // Проверяем, есть ли такой предмет в магазине
        if (!shopData[itemKey]) {
            return message.reply(`❌ Такого предмета нет в магазине: ${itemKey}`);
        }

        // Если у пользователя нет записи о балансе — даём 100 монет
        if (!balanceData[userId]) {
            balanceData[userId] = 100;
        }

        // Получаем название и цену предмета
        const itemName = shopData[itemKey].name; // например "Танк"
        const itemPrice = shopData[itemKey].price;
        const totalPrice = itemPrice * quantity;

        // Проверяем, хватает ли монет
        if (balanceData[userId] < totalPrice) {
            return message.reply(`❌ Недостаточно монет! Нужно ${totalPrice}, а у вас ${balanceData[userId]}.`);
        }

        // Списываем монеты
        balanceData[userId] -= totalPrice;
        saveJSON(balanceFile, balanceData);

        // Добавляем предметы в инвентарь
        if (!inventoryData[userId]) {
            inventoryData[userId] = {};
        }

        // Если предмет уже есть, увеличиваем его количество
        if (!inventoryData[userId][itemName]) {
            inventoryData[userId][itemName] = 0;
        }
        inventoryData[userId][itemName] += quantity;

        saveJSON(inventoryFile, inventoryData);

        message.reply(`✅ Вы купили **${itemName}** x${quantity} за ${totalPrice} монет!`);
    },
};
