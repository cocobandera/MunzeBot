const Balance = require('../models/Balance');

module.exports = {
  name: 'addmoney',
  description: 'Начислить монеты игроку (только для админов). Формат: ?addmoney @user <количество>',
  async execute(message, args) {
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply('❌ У вас нет прав для использования этой команды.');
    }
    const user = message.mentions.users.first();
    const amount = args[1] ? parseInt(args[1], 10) : NaN;
    if (!user) {
      return message.reply('❌ Укажите пользователя, которому начислить монеты.');
    }
    if (isNaN(amount) || amount <= 0) {
      return message.reply('❌ Укажите корректное количество монет.');
    }
    let balance = await Balance.findOne({ userId: user.id });
    if (!balance) {
      balance = new Balance({ userId: user.id, coins: 100 });
    }
    balance.coins += amount;
    await balance.save();
    message.reply(`✅ Начислено **${amount}** монет пользователю ${user.username}.`);
  },
};
