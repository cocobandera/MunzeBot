const Inventory = require('../models/Inventory');

module.exports = {
  name: 'use',
  description: 'Использовать предмет из инвентаря. Формат: ?use <предмет> <количество>',
  async execute(message, args) {
    if (!args[0]) {
      return message.reply('❌ Укажите название предмета для использования. Пример: `?use зелье 2`');
    }
    // Если последнее слово является числом, то оно – количество, иначе количество = 1
    const lastArg = args[args.length - 1];
    let quantity = parseInt(lastArg, 10);
    let itemName;
    if (isNaN(quantity)) {
      quantity = 1;
      itemName = args.join(' ');
    } else {
      itemName = args.slice(0, -1).join(' ');
    }
    if (quantity <= 0) {
      return message.reply('❌ Количество должно быть положительным числом.');
    }
    const userId = message.author.id;
    const inventory = await Inventory.findOne({ userId });
    if (!inventory || !inventory.items.has(itemName)) {
      return message.reply(`❌ У вас нет предмета **${itemName}** в инвентаре.`);
    }
    const currentCount = inventory.items.get(itemName);
    if (currentCount < quantity) {
      return message.reply(`❌ У вас недостаточно **${itemName}**. Есть только ${currentCount}.`);
    }
    if (currentCount === quantity) {
      inventory.items.delete(itemName);
    } else {
      inventory.items.set(itemName, currentCount - quantity);
    }
    await inventory.save();
    message.reply(`✅ Вы использовали **${itemName}** x${quantity}.`);
  },
};
