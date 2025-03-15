const fs = require('fs');

const shopFile = './shop.json';
const inventoryFile = './inventories.json';
const balanceFile = './balances.json';

function loadShop() {
    return JSON.parse(fs.readFileSync(shopFile, 'utf8'));
}

function loadInventory() {
    return JSON.parse(fs.readFileSync(inventoryFile, 'utf8'));
}

function saveInventory(data) {
    fs.writeFileSync(inventoryFile, JSON.stringify(data, null, 2), 'utf8');
}

function loadBalances() {
    return JSON.parse(fs.readFileSync(balanceFile, 'utf8'));
}

function saveBalances(data) {
    fs.writeFileSync(balanceFile, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
    name: 'buy',
    description: 'Купить предмет в магазине',
    async execute(message, args) {
        if (!args[0]) return message.reply('❌ Укажите предмет для покупки.');

        const userId = message.author.id;
        const itemKey = args[0].toLowerCase();
        const shopItems = loadShop();
        const inventory = loadInventory();
        const balances = loadBalances();

        if (!shopItems[itemKey]) {
            return message.reply('❌ Такого предмета нет в магазине.');
        }

        if (!balances[userId]) {
            balances[userId] = 100;
        }

        const itemPrice = shopItems[itemKey].price;
        if (balances[userId] < itemPrice) {
            return message.reply(`❌ У вас недостаточно монет! Вам нужно ${itemPrice} монет.`);
        }

        balances[userId] -= itemPrice;
        saveBalances(balances);

        if (!inventory[userId]) {
            inventory[userId] = [];
        }

        inventory[userId].push(shopItems[itemKey].name);
        saveInventory(inventory);

        message.reply(`✅ Вы купили **${shopItems[itemKey].name}** за ${itemPrice} монет!`);
    },
};
