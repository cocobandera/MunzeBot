const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  // items: Map, где ключ — название предмета, значение — количество
  items: { type: Map, of: Number, default: {} },
});

module.exports = mongoose.model('Inventory', InventorySchema);
