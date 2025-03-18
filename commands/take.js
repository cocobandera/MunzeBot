const Balance = require('../models/Balance');

module.exports = {
  name: 'take',
  description: 'Забрать деньги у другого игрока. Формат: ?take @user <количество>',
  async execute(message, args) {
    // Проверка на наличие прав администратора
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply('❌ У вас нет прав для использования этой команды.');
    }

    // Получаем упомянутого игрока и количество монет
    const recipient = message.mentions.users.first();
    const amount = args[1] ? parseInt(args[1], 10) : NaN;

    // Проверка на наличие указанного пользователя и корректность количества
    if (!recipient) {
      return message.reply('❌ Укажите пользователя, у которого нужно забрать монеты.');
    }

    if (isNaN(amount) || amount <= 0) {
      return message.reply('❌ Укажите корректное количество монет.');
    }

    // Получаем баланс пользователя, у которого будем забирать деньги
    let recipientBalance = await Balance.findOne({ userId: recipient.id });
    if (!recipientBalance) {
      recipientBalance = new Balance({ userId: recipient.id, coins: 100 });
      await recipientBalance.save();
    }

    // Проверка, есть ли достаточно монет у пользователя
    if (recipientBalance.coins < amount) {
      return message.reply(`❌ У этого пользователя недостаточно монет!`);
    }

    // Списываем деньги с баланса пользователя
    recipientBalance.coins -= amount;
    await recipientBalance.save();

    // Получаем баланс администратора
    let senderBalance = await Balance.findOne({ userId: message.author.id });
    if (!senderBalance) {
      senderBalance = new Balance({ userId: message.author.id, coins: 100 });
      await senderBalance.save();
    }

    // Добавляем деньги на баланс администратора
    senderBalance.coins += amount;
    await senderBalance.save();

    message.reply(`✅ Вы забрали **${amount} монет** у ${recipient.username} и добавили их себе!`);
  },
};
