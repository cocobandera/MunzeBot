const Balance = require('../models/Balance');

module.exports = {
  name: 'give',
  description: 'Передать монеты другому игроку. Формат: ?give @user <количество>',
  async execute(message, args) {
    const senderId = message.author.id;
    const recipient = message.mentions.users.first();
    const amount = args[1] ? parseInt(args[1], 10) : NaN;
    if (!recipient) {
      return message.reply('❌ Укажите пользователя, которому передать монеты.');
    }
    if (isNaN(amount) || amount <= 0) {
      return message.reply('❌ Укажите корректное количество монет.');
    }
    let senderBalance = await Balance.findOne({ userId: senderId });
    if (!senderBalance) {
      senderBalance = new Balance({ userId: senderId, coins: 100 });
      await senderBalance.save();
    }
    let recipientBalance = await Balance.findOne({ userId: recipient.id });
    if (!recipientBalance) {
      recipientBalance = new Balance({ userId: recipient.id, coins: 100 });
      await recipientBalance.save();
    }
    if (senderBalance.coins < amount) {
      return message.reply('❌ У вас недостаточно монет для перевода.');
    }
    senderBalance.coins -= amount;
    recipientBalance.coins += amount;
    await senderBalance.save();
    await recipientBalance.save();
    message.reply(`✅ Вы передали **${amount}** монет пользователю ${recipient.username}!`);
  },
};
