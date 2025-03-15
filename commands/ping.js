module.exports = {
    name: 'ping',
    description: 'Проверить отклик бота',
    async execute(message) {
        message.reply('🏓 Pong!');
    },
};
