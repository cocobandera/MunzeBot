const Balance = require('../models/Balance');

module.exports = {
  name: 'balance',
  description: 'Показать ваш баланс',
  async execute(message) {
    const userId = message.author.id;
    let balance = await Balance.findOne({ userId });
    if (!balance) {
      balance = new Balance({ userId, coins: 100 });
      await balance.save();
    }
    message.reply(`💰 Ваш баланс: **${balance.coins}** монет.`);
  },
};
