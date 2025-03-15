const mongoose = require('mongoose');

const BalanceSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  coins: { type: Number, default: 100 }, // начальный баланс 100 монет
});

module.exports = mongoose.model('Balance', BalanceSchema);
