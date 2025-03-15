const fs = require('fs');
const shopFile = './shop.json';

function loadShop() {
    return JSON.parse(fs.readFileSync(shopFile, 'utf8'));
}

module.exports = {
    name: 'shop',
    description: 'Показать список товаров в магазине',
    async execute(message) {
        const shopItems = loadShop();
        let shopList = '🛒 **Магазин**:\n';

        for (const key in shopItems) {
            shopList += `🔹 **${shopItems[key].name}** — ${shopItems[key].price} монет\n`;
        }

        message.reply(shopList);
    },
};
