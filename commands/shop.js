const shopItems = {
    танк: { name: "Танк", price: 100 },
    зелье: { name: "Зелье здоровья", price: 10 },
    меч: { name: "Меч", price: 50 }
  };
  
  module.exports = {
    name: 'shop',
    description: 'Показать товары магазина',
    async execute(message) {
      let reply = '🛒 **Магазин:**\n';
      for (const key in shopItems) {
        reply += `🔹 **${shopItems[key].name}** — ${shopItems[key].price} монет\n`;
      }
      message.reply(reply);
    },
  };
  