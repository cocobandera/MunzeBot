const Inventory = require('../models/Inventory');
const Balance = require('../models/Balance');

// Магазин товаров (ключи должны соответствовать вводу команды)
const shopItems = {
  танк: { name: "Танк", price: 100 },
  зелье: { name: "Зелье здоровья", price: 10 },
  меч: { name: "Меч", price: 50 },
};

module.exports = {
  name: 'buy',
  description: 'Купить предмет в магазине. Формат: ?buy <предмет> <количество>',
  async execute(message, args) {
    if (!args[0]) {
      return message.reply('❌ Укажите предмет для покупки. Пример: `?buy танк 1`');
    }
    const itemKey = args[0].toLowerCase();
    const quantity = args[1] ? parseInt(args[1], 10) : 1;
    if (isNaN(quantity) || quantity <= 0) {
      return message.reply('❌ Укажите корректное количество. Пример: `?buy танк 2`');
    }
    if (!shopItems[itemKey]) {
      return message.reply(`❌ Такого предмета нет в магазине: ${itemKey}`);
    }
    const item = shopItems[itemKey];
    const totalPrice = item.price * quantity;
    const userId = message.author.id;

    let balance = await Balance.findOne({ userId });
    if (!balance) {
      balance = new Balance({ userId, coins: 100 });
      await balance.save();
    }
    if (balance.coins < totalPrice) {
      return message.reply(`❌ Недостаточно монет! Нужно ${totalPrice}, а у вас ${balance.coins}.`);
    }
    // Списываем монеты
    balance.coins -= totalPrice;
    await balance.save();

    let inventory = await Inventory.findOne({ userId });
    if (!inventory) {
      inventory = new Inventory({ userId, items: {} });
    }
    const currentCount = inventory.items.get(item.name) || 0;
    inventory.items.set(item.name, currentCount + quantity);
    await inventory.save();

    message.reply(`✅ Вы купили **${item.name}** x${quantity} за ${totalPrice} монет!`);
  },
};
