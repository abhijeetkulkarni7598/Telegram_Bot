const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const User = require('./models/User');
const BotSetting = require('./models/BotSetting');

// Replace with your bot token
const BOT_TOKEN = '7643836758:AAEngv9-sBPAN9zxbSaB1qhOaIdnCVQuXKA';
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// MongoDB connection
mongoose.connect('mongodb+srv://abhijeetkulkarni117:abhi123@cluster0.y2jzzdp.mongodb.net/Telegram_Bot?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// Start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const user = await User.findOne({ chatId });

  if (!user) {
    await User.create({ chatId });
    bot.sendMessage(chatId, 'Welcome! You are now subscribed to weather updates. Use /unsubscribe to stop receiving updates.');
  } else {
    bot.sendMessage(chatId, 'Welcome back! Use /unsubscribe to stop receiving updates.');
  }
});

// Subscribe command
bot.onText(/\/subscribe/, async (msg) => {
  const chatId = msg.chat.id;
  await User.findOneAndUpdate({ chatId }, { subscribed: true });
  bot.sendMessage(chatId, 'You have subscribed to weather updates.');
});

// Unsubscribe command
bot.onText(/\/unsubscribe/, async (msg) => {
  const chatId = msg.chat.id;
  await User.findOneAndUpdate({ chatId }, { subscribed: false });
  bot.sendMessage(chatId, 'You have unsubscribed from weather updates.');
});

// Weather command
bot.onText(/\/weather/, async (msg) => {
  const chatId = msg.chat.id;
  const user = await User.findOne({ chatId });

  if (!user || !user.subscribed) {
    bot.sendMessage(chatId, 'You are not subscribed to weather updates. Use /subscribe to subscribe.');
    return;
  }

  const settings = await BotSetting.findOne();
  if (!settings || !settings.apiKey) {
    bot.sendMessage(chatId, 'Weather API is not configured. Please contact the admin.');
    return;
  }

  // Fetch weather data (example for OpenWeatherMap)
  const axios = require('axios');
  const city = 'Pune'; // Default city
  const apiKey = settings.apiKey;

  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${'9d1f0d67aecb91b703b1a3f5f4f4c136'}`);
    const weather = response.data.weather[0].description;
    const temperature = (response.data.main.temp - 273.15).toFixed(2); // Convert Kelvin to Celsius

    bot.sendMessage(chatId, `Weather in ${city}: ${weather}, Temperature: ${temperature}°C`);
  } catch (error) {
    bot.sendMessage(chatId, 'Failed to fetch weather data. Please try again later.');
  }
});
