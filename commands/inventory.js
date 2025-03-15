const Inventory = require('../models/Inventory');

module.exports = {
  name: 'inventory',
  aliases: ['inv'],
  description: 'Показать ваш инвентарь',
  async execute(message) {
    const userId = message.author.id;
    const inventory = await Inventory.findOne({ userId });
    if (!inventory || inventory.items.size === 0) {
      return message.reply('👜 Ваш инвентарь пуст.');
    }
    let reply = '🎒 **Ваш инвентарь:**\n';
    // Перебираем Map предметов
    for (const [itemName, count] of inventory.items) {
      reply += `🔹 **${itemName}** x${count}\n`;
    }
    message.reply(reply);
  },
};
