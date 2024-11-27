const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  apiKey: { type: String, required: true }, // Weather API key
});

module.exports = mongoose.model('BotSetting', settingsSchema);
